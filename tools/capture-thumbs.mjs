// Refresh the page-overview previews: public/thumbs/<scene id>.jpg (384 x 216).
// Needs the dev server running (npm run dev). Opens every page in a hidden Edge/Chrome, waits for the
// camera to settle, hides the buttons and script bar, and saves a small picture of the 1920 x 1080 stage.
//   node tools/capture-thumbs.mjs [http://localhost:5173/] [ids...]
// BROWSER=<path to msedge.exe or chrome.exe> overrides the browser.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://localhost:5173/';
const only = process.argv.slice(3);
const out = new URL('../public/thumbs/', import.meta.url);
mkdirSync(out, { recursive: true });
const browserPath = process.env.BROWSER ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), 'cityops-thumbs-'));
const browser = spawn(browserPath, ['--headless=new', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', `--user-data-dir=${profile}`, '--window-size=1920,1080', '--hide-scrollbars', `--remote-debugging-port=${port}`, 'about:blank'], { stdio: 'ignore' });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let list;
  for (let i = 0; i < 40 && !list; i++) {
    await wait(250);
    list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json()).catch(() => undefined);
  }
  const page = list.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let n = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) pending.get(m.id)(m), pending.delete(m.id);
  };
  const send = (method, params = {}) => new Promise((r) => { const id = ++n; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;

  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `${base}#scene=0.1` });
  for (let i = 0; i < 240; i++) {
    await wait(1000);
    if (await evaluate("!!document.querySelector('canvas') && !document.querySelector('.map-loading')")) break;
  }
  await wait(2500);
  // pictures of the scene only: no buttons, script bar, counter or progress line
  await evaluate(`(() => { const s = document.createElement('style'); s.textContent = '.stepper,.script,.counter,.progress,.cam-edit{display:none!important}'; document.head.appendChild(s); return true; })()`);
  const ids = only.length ? only : await evaluate("(async () => (await import('/src/scenes/index.ts')).SCENES.map((s) => s.id))()");
  for (const id of ids) {
    await evaluate(`location.hash = '#scene=${id}'`);
    // inspection pages push in after the walk; the rest settle sooner
    await wait(['0.4', '2.1', '2.13', '2.14'].includes(id) ? 8000 : 5500);
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 78, clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 0.2 } });
    writeFileSync(new URL(`${id}.jpg`, out), Buffer.from(shot.result.data, 'base64'));
    console.log('preview', id);
  }
  ws.close();
} finally {
  browser.kill();
}
