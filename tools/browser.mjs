// A hidden Edge/Chrome driven over CDP, for page captures. Always closes its whole process tree.
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DEFAULT = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Run `fn(page)` with a fresh hidden browser at 1920 x 1080. page.send(method, params) talks CDP,
 * page.eval(expr) evaluates in the page, page.shot(scale) returns a JPEG buffer of the stage.
 * The browser and every child process are killed afterwards, even if `fn` throws.
 */
export async function withBrowser(fn) {
  const profile = mkdtempSync(join(tmpdir(), 'cityops-capture-'));
  const port = 9400 + Math.floor(Math.random() * 500);
  const proc = spawn(process.env.BROWSER ?? DEFAULT, ['--headless=new', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', `--user-data-dir=${profile}`, '--window-size=1920,1080', '--hide-scrollbars', `--remote-debugging-port=${port}`, 'about:blank'], { stdio: 'ignore' });
  let ws;
  try {
    let list;
    for (let i = 0; i < 60 && !list; i++) {
      await wait(250);
      list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json()).catch(() => undefined);
    }
    ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let n = 0;
    const pending = new Map();
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) pending.get(m.id)(m), pending.delete(m.id);
    };
    const send = (method, params = {}) => new Promise((r) => { const id = ++n; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
    const page = {
      send,
      eval: async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value,
      shot: async (scale = 1, quality = 82) => Buffer.from((await send('Page.captureScreenshot', { format: 'jpeg', quality, clip: { x: 0, y: 0, width: 1920, height: 1080, scale } })).result.data, 'base64'),
      /** open the app on `id` and wait until the map has loaded */
      open: async (base, id) => {
        await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
        await send('Page.navigate', { url: `${base}#scene=${id}` });
        for (let i = 0; i < 240; i++) {
          await wait(1000);
          if (await page.eval("!!document.querySelector('canvas') && !document.querySelector('.map-loading')")) break;
        }
        await wait(2500);
      },
      go: (id) => page.eval(`location.hash = '#scene=${id}'`),
    };
    return await fn(page);
  } finally {
    try {
      ws?.close();
    } catch {
      /* already closed */
    }
    // Edge's launcher hands off to a new main process and exits, so killing its tree misses the browser:
    // kill every process started with our own throw-away profile folder (never the user's own browser)
    if (process.platform === 'win32') {
      const name = profile.split(/[\\/]/).pop();
      spawnSync('powershell', ['-NoProfile', '-Command', `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*${name}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`], { stdio: 'ignore' });
    } else proc.kill('SIGKILL');
    await wait(800);
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
    } catch {
      /* a file still locked: the temp folder is cleaned by the system later */
    }
  }
}
