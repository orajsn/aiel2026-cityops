// Local-only production preview and isolated phone/script relay. Not a VM web server.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const port = Number(process.env.CITYOPS_LOCAL_PORT || 8767);
const relayPort = Number(process.env.CITYOPS_RELAY_PORT || 8092);
if (![port, relayPort].every(p => Number.isInteger(p) && p > 0 && p <= 65535) || port === relayPort) throw new Error('Choose two distinct valid local ports.');
if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error('Run npm run build before starting the local preview.');
const data = path.join(root, '.local', 'follow-data');
fs.mkdirSync(data, { recursive: true });
const relay = spawn(process.execPath, ['follow/server.mjs'], {
  cwd: root, windowsHide: true, stdio: ['ignore', 'inherit', 'inherit'],
  env: { ...process.env, FOLLOW_PORT: String(relayPort), FOLLOW_BASE: '/follow/', FOLLOW_DATA: data.replaceAll('\\', '/'), CITYOPS_AUTOCOMMIT: '0' },
});
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.geojson': 'application/geo+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.mp4': 'video/mp4' };
const origin = `http://127.0.0.1:${port}`;
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, origin).pathname); } catch { res.writeHead(400).end(); return; }
  if (pathname.startsWith('/follow/')) {
    const allowed = new Set([origin, `http://localhost:${port}`]);
    if (!new Set([`127.0.0.1:${port}`, `localhost:${port}`]).has(req.headers.host || '')) { res.writeHead(403).end('Local preview only'); return; }
    if (req.headers.origin && !allowed.has(req.headers.origin)) { res.writeHead(403).end('Local preview only'); return; }
    const headers = { ...req.headers, host: `127.0.0.1:${relayPort}` };
    delete headers['x-remote-user'];
    if (pathname.startsWith('/follow/api/m/')) headers['x-remote-user'] = 'local-presenter';
    const upstream = http.request({ hostname: '127.0.0.1', port: relayPort, path: req.url, method: req.method, headers }, incoming => {
      res.writeHead(incoming.statusCode || 502, incoming.headers); incoming.pipe(res);
    });
    upstream.on('error', () => { if (!res.headersSent) res.writeHead(502); res.end('Local relay unavailable'); });
    res.on('close', () => upstream.destroy()); req.pipe(upstream); return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return; }
  let file = path.resolve(dist, '.' + pathname);
  if (file !== dist && !file.startsWith(dist + path.sep)) { res.writeHead(403).end(); return; }
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.statSync(file).isFile()) throw new Error('not a file');
    res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff' });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end('Not found'); }
});
let closing = false;
function close() { if (closing) return; closing = true; server.close(); relay.kill(); }
server.on('error', error => { console.error(error.message); close(); process.exitCode = 1; });
relay.on('error', error => { console.error(error.message); close(); process.exitCode = 1; });
relay.on('exit', code => { if (!closing) { console.error(`Local relay stopped (${code}).`); close(); process.exitCode = 1; } });
process.on('SIGINT', close); process.on('SIGTERM', close);
server.listen(port, '127.0.0.1', () => console.log(`Senayan source preview: ${origin}\nScript manager: ${origin}/?mode=scripts\nLocal edits: .local/follow-data (not Git)`));
