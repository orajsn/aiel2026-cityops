/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { canSaveFrom, TUNNEL_HOSTS } from './src/engine/remote';

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

export default defineConfig({
  plugins: [react(), cameraOverrides()],
  base: './',
  build: { assetsInlineLimit: 0 },
  // the saved-angles file changes while presenting: do not reload the page when it does. Polling: on this
  // machine the file-change events were sometimes missed and the server kept serving stale code.
  server: { port: 5173, strictPort: false, watch: { ignored: ['**/src/content/cameraOverrides.json', '**/public/**'], usePolling: true, interval: 400 }, allowedHosts: TUNNEL_HOSTS },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
