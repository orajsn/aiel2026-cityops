/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { cpus, tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { canSaveFrom, TUNNEL_HOSTS } from './src/engine/remote';
import { normalizeTraffic } from './src/content/traffic';

/** Camera mode → Save: write the owner's saved angles into the project (dev server only). */
function cameraOverrides(): Plugin {
  const file = fileURLToPath(new URL('./src/content/cameraOverrides.json', import.meta.url));
  return {
    name: 'cityops-camera-overrides',
    configureServer(server) {
      server.middlewares.use('/__camera-overrides', (req, res) => {
        if (req.method === 'GET') {
          // read fresh from disk: the file is excluded from the watcher, so its module copy goes stale
          res.setHeader('content-type', 'application/json');
          res.setHeader('cache-control', 'no-store');
          return void res.end(existsSync(file) ? readFileSync(file, 'utf8') : '{}');
        }
        if (req.method !== 'POST') return void res.writeHead(405).end();
        // the public tunnel link is view-only
        if (!canSaveFrom(req.headers)) return void res.writeHead(403).end('view-only');
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
            res.writeHead(200).end('ok');
          } catch {
            res.writeHead(400).end('bad json');
          }
        });
      });
    },
  };
}

/**
 * Traffic mode → Save: GET/POST /__traffic reads and writes src/content/traffic.json (dev server only). Every save is
 * cleaned by normalizeTraffic (counts, speeds and points clamped, size-limited) and the previous file is kept as
 * traffic.prev.json. Unlike camera saves this works through the public links too: the owner draws on the iPad
 * through the VM's HTTPS link, and the data is only routes and numbers. The file is not watched, so a save never
 * reloads a page someone is presenting from.
 */
function trafficSaves(): Plugin {
  const file = fileURLToPath(new URL('./src/content/traffic.json', import.meta.url));
  const prev = fileURLToPath(new URL('./src/content/traffic.prev.json', import.meta.url));
  return {
    name: 'cityops-traffic',
    configureServer(server) {
      server.middlewares.use('/__traffic', (req, res) => {
        res.setHeader('cache-control', 'no-store');
        if (req.method === 'GET') {
          res.setHeader('content-type', 'application/json');
          return void res.end(JSON.stringify(normalizeTraffic(existsSync(file) ? readFileSync(file, 'utf8') : null)));
        }
        if (req.method !== 'POST') return void res.writeHead(405).end();
        let body = '';
        let size = 0;
        req.on('data', (c: Buffer) => {
          size += c.length;
          if (size > 512 * 1024) req.destroy();
          else body += c;
        });
        req.on('end', () => {
          try {
            const clean = normalizeTraffic(JSON.parse(body));
            if (existsSync(file)) writeFileSync(prev, readFileSync(file));
            writeFileSync(file, `${JSON.stringify(clean, null, 2)}\n`);
            res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(clean));
          } catch {
            res.writeHead(400).end('bad json');
          }
        });
      });
    },
  };
}

/**
 * A change to a scene module reloads the page instead of hot-swapping it: hot-swapped three.js objects pile
 * up on the GPU in an open tab (the owner's tab crawled again after a run of edits). HTML overlays and
 * styles still hot-swap.
 */
function fullReloadForScene(): Plugin {
  return {
    name: 'full-reload-for-scene',
    handleHotUpdate({ file, server }) {
      if (/[\/]src[\/](world|engine)[\/]/.test(file)) {
        server.ws.send({ type: 'full-reload', path: '*' });
        return [];
      }
    },
  };
}

/**
 * GET /__viewers: how many browsers have the app open right now (one hot-reload socket each). The capture tools
 * (tools/browser.mjs) wait while it is above zero, so a capture never slows the PC while someone uses the app.
 */
function viewersCount(): Plugin {
  return {
    name: 'cityops-viewers',
    configureServer(server) {
      server.middlewares.use('/__viewers', (_req, res) => {
        res.setHeader('content-type', 'application/json');
        res.setHeader('cache-control', 'no-store');
        res.end(JSON.stringify({ viewers: server.ws.clients.size }));
      });
    },
  };
}

/**
 * The capture tools' hidden browser draws the city in software: its gpu-process alone kept ~12 of 16 cores busy at
 * AboveNormal priority (Edge raises it itself), and when a tool was killed its browser kept running and the PC
 * crawled (owner, 25 Oct). The dev server runs all day, so it keeps watch: while a capture holds the lock, every
 * capture process goes to Idle priority on a quarter of the cores (re-applied every 5 s, Edge raises it again);
 * once the holder has died, its browser is closed and the lock removed; once a minute, any capture browser with no
 * live holder is closed. Windows only; capture processes are found by their throw-away profile folder name.
 */
function captureGuard(): Plugin {
  const LOCK = join(tmpdir(), 'cityops-capture.lock');
  const n = cpus().length;
  const k = Math.max(2, Math.floor(n / 4));
  const mask = Number(((1n << BigInt(k)) - 1n) << BigInt(Math.max(0, n - k)));
  const MATCH = `Get-CimInstance Win32_Process -Filter "Name='msedge.exe' OR Name='chrome.exe'" | Where-Object { $_.CommandLine -like '*cityops-capture-*' }`;
  const CALM = `${MATCH} | ForEach-Object { $q = Get-Process -Id $_.ProcessId -ErrorAction SilentlyContinue; if ($q) { if ($q.PriorityClass -ne 'Idle') { try { $q.PriorityClass = 'Idle' } catch {} }; if ([int64]$q.ProcessorAffinity -ne ${mask}) { try { $q.ProcessorAffinity = [IntPtr]${mask} } catch {} } } }`;
  const CLOSE = `${MATCH} | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`;
  const alive = (pid: number) => {
    try {
      process.kill(pid, 0);
      return true;
    } catch (e) {
      return (e as NodeJS.ErrnoException).code === 'EPERM';
    }
  };
  let busy = false;
  const ps = (command: string) => {
    if (busy) return;
    busy = true;
    spawn('powershell', ['-NoProfile', '-Command', command], { stdio: 'ignore', windowsHide: true }).on('exit', () => (busy = false)).on('error', () => (busy = false));
  };
  return {
    name: 'cityops-capture-guard',
    configureServer(server) {
      if (process.platform !== 'win32') return;
      let tick = 0;
      const timer = setInterval(() => {
        tick++;
        let holder = 0;
        try {
          holder = Number(readFileSync(LOCK, 'utf8').trim());
        } catch {
          /* no capture running */
        }
        if (holder && alive(holder)) return ps(CALM);
        if (holder) {
          try {
            unlinkSync(LOCK);
          } catch {
            /* gone already */
          }
          return ps(CLOSE);
        }
        if (tick % 12 === 0) ps(CLOSE);
      }, 5000);
      timer.unref();
      server.httpServer?.on('close', () => clearInterval(timer));
    },
  };
}

/**
 * The map is ~50 MB and the tunnel carries ~0.5 MB/s (measured 25 Oct: the 20 MB photo took 42 s), so the iPad
 * waited minutes on "Loading the Bangkok map". Map files under /models never change while we work:
 * - the geometry (.bin, .gltf) goes out gzip-compressed (29 MB -> 11.5 MB), compressed once and kept in memory;
 * - every /models file may be kept by the browser for a week without asking again (a second visit is instant).
 * Pictures (.jpeg/.png/.glb) are already compressed and are only given the cache rule.
 */
function fastModels(): Plugin {
  const root = fileURLToPath(new URL('./public', import.meta.url));
  const packed = new Map<string, { mtime: number; gz: Buffer }>();
  const TYPES: Record<string, string> = { '.bin': 'application/octet-stream', '.gltf': 'model/gltf+json' };
  return {
    name: 'cityops-fast-models',
    configureServer(server) {
      // files the watcher does not see (public/** is ignored so previews do not reload the page): the dev server
      // only learns of new public files at startup, so new previews and sw.js are read straight from disk here
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url ?? '').split('?')[0]);
        const fresh = url === '/sw.js' ? 'text/javascript' : url.startsWith('/thumbs/') && url.endsWith('.jpg') && !url.includes('..') ? 'image/jpeg' : null;
        if (!fresh) return next();
        const file = join(root, url);
        if (!existsSync(file)) return next();
        res.writeHead(200, { 'content-type': fresh, 'cache-control': 'no-cache' });
        res.end(readFileSync(file));
      });
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url ?? '').split('?')[0]);
        if (!url.startsWith('/models/') || url.includes('..')) return next();
        res.setHeader('cache-control', 'public, max-age=604800');
        const ext = url.slice(url.lastIndexOf('.'));
        if (!TYPES[ext] || !/\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''))) return next();
        const file = join(root, url);
        let st;
        try {
          st = statSync(file);
        } catch {
          return next();
        }
        let hit = packed.get(file);
        if (!hit || hit.mtime !== st.mtimeMs) packed.set(file, (hit = { mtime: st.mtimeMs, gz: gzipSync(readFileSync(file), { level: 9 }) }));
        const etag = `"gz-${st.size}-${Math.round(st.mtimeMs)}"`;
        res.setHeader('etag', etag);
        res.setHeader('vary', 'accept-encoding');
        if (req.headers['if-none-match'] === etag) return void res.writeHead(304).end();
        res.writeHead(200, { 'content-type': TYPES[ext], 'content-encoding': 'gzip', 'content-length': hit.gz.length });
        res.end(req.method === 'HEAD' ? undefined : hit.gz);
      });
    },
  };
}

export default defineConfig({
  base: './',
  build: { assetsInlineLimit: 0 },
  // the saved-angles file changes while presenting: do not reload the page when it does. Polling: on this
  // machine the file-change events were sometimes missed and the server kept serving stale code.
  plugins: [react(), cameraOverrides(), trafficSaves(), fullReloadForScene(), viewersCount(), captureGuard(), fastModels()],
  server: { port: 5174, strictPort: true, watch: { ignored: ['**/src/content/cameraOverrides.json', '**/src/content/traffic.json', '**/src/content/traffic.prev.json', '**/public/**', '**/.claude/**'], usePolling: true, interval: 400 }, allowedHosts: TUNNEL_HOSTS },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
