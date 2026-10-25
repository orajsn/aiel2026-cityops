// A hidden Edge/Chrome driven over CDP, for page captures. Always closes its whole process tree.
//
// Guards (owner, 25 Oct: the PC kept going laggy from captures and nobody noticed until it was slow):
//  - one capture at a time on this PC, across every tool and every Claude session (a lock file);
//  - the browser starts at Idle priority, and the dev server (vite.config.ts, captureGuard) keeps every capture
//    process at Idle on a quarter of the cores while it runs, and closes it once its tool has died in any way
//    (finished, crashed, killed by a timeout or a stopped task); a watchdog child of the tool cannot do that here,
//    since the environment ends a tool's children with it;
//  - leftovers from an earlier run are closed before a new browser starts, and on exit or Ctrl+C;
//  - no capture while someone has the app open (the dev server's /__viewers count): it waits, and pauses
//    between pages if someone opens it mid-run. CAPTURE_ANYWAY=1 skips the wait.
import { spawn, spawnSync } from 'node:child_process';
import { closeSync, mkdtempSync, openSync, readFileSync, rmSync, unlinkSync, writeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DEFAULT = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PREFIX = 'cityops-capture-';
const LOCK = join(tmpdir(), 'cityops-capture.lock');
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === 'EPERM';
  }
};

const ps = (command) => spawnSync('powershell', ['-NoProfile', '-Command', command], { stdio: 'ignore' });

/** kill every process whose command line has `pattern` (our own throw-away profile folders, never the user's browser) */
const killMatching = (pattern) => {
  if (process.platform === 'win32') ps(`Get-CimInstance Win32_Process -Filter "Name='msedge.exe' OR Name='chrome.exe'" | Where-Object { $_.CommandLine -like '*${pattern}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`);
};

/** one capture at a time: wait for a live holder, take over from a dead one */
async function takeLock() {
  for (let said = false; ; ) {
    try {
      const fd = openSync(LOCK, 'wx');
      writeSync(fd, String(process.pid));
      closeSync(fd);
      return;
    } catch {
      const pid = Number(readFileSync(LOCK, 'utf8').trim());
      if (!pid || !alive(pid)) {
        try {
          unlinkSync(LOCK);
        } catch {
          /* someone else took it over first */
        }
        continue;
      }
      if (!said) console.error(`[capture] another capture is running (pid ${pid}); waiting for it to finish`);
      said = true;
      await wait(5000);
    }
  }
}

function dropLock() {
  try {
    if (readFileSync(LOCK, 'utf8').trim() === String(process.pid)) unlinkSync(LOCK);
  } catch {
    /* gone already */
  }
}

/** how many browsers have the app open, from the dev server; null if it cannot say */
async function viewers(base) {
  try {
    return (await fetch(new URL('__viewers', base)).then((r) => r.json())).viewers;
  } catch {
    return null;
  }
}

/** wait while more than `own` browsers have the app open (own = 1 once our hidden page is connected) */
async function waitForNoViewers(base, own) {
  if (process.env.CAPTURE_ANYWAY === '1') return;
  for (let said = false; ; ) {
    const n = await viewers(base);
    if (n === null) {
      if (!said) console.error('[capture] the dev server does not report viewers (restart it to load the check); going ahead');
      return;
    }
    if (n <= own) {
      if (said) console.error('[capture] the app is closed now; going on');
      return;
    }
    if (!said) console.error(`[capture] someone has the app open (${n - own}); waiting until it is closed. CAPTURE_ANYWAY=1 skips this`);
    said = true;
    await wait(20000);
  }
}

/**
 * Run `fn(page)` with a fresh hidden browser at 1920 x 1080. page.send(method, params) talks CDP,
 * page.eval(expr) evaluates in the page, page.shot(scale) returns a JPEG buffer of the stage.
 * The browser and every child process are killed afterwards, even if `fn` throws or node is killed.
 */
export async function withBrowser(fn) {
  await takeLock();
  // anything left with our profile prefix now is an orphan of an earlier run (we hold the lock)
  killMatching(PREFIX);
  const profile = mkdtempSync(join(tmpdir(), PREFIX));
  const name = profile.split(/[\\/]/).pop();
  const port = 9400 + Math.floor(Math.random() * 500);
  // on exit or Ctrl+C, close this browser and the lock (a hard kill skips this: the dev server's guard and the
  // next capture clean up after that)
  const bail = () => {
    killMatching(name);
    dropLock();
  };
  const onSignal = () => (bail(), process.exit(130));
  const SIGNALS = ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'];
  process.once('exit', bail);
  for (const sig of SIGNALS) process.once(sig, onSignal);
  const exe = process.env.BROWSER ?? DEFAULT;
  const args = ['--headless=new', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', `--user-data-dir=${profile}`, '--window-size=1920,1080', '--hide-scrollbars', `--remote-debugging-port=${port}`, 'about:blank'];
  // on Windows, start it at Idle priority: every process the browser makes inherits that (its sandboxed
  // renderers refuse a priority change from outside afterwards), so the PC's own work always comes first
  const proc =
    process.platform === 'win32'
      ? spawn('cmd.exe', ['/d', '/c', `start "" /low /b "${exe}" ${args.join(' ')}`], { stdio: 'ignore', windowsVerbatimArguments: true, windowsHide: true })
      : spawn(exe, args, { stdio: 'ignore' });
  let ws;
  let base;
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
      /** open the app on `id` and wait until the map has loaded (and, first, until nobody else has the app open) */
      open: async (url, id) => {
        base = url;
        await waitForNoViewers(base, 0);
        await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
        await send('Page.navigate', { url: `${base}#scene=${id}` });
        for (let i = 0; i < 240; i++) {
          await wait(1000);
          if (await page.eval("!!document.querySelector('canvas') && !document.querySelector('.map-loading')")) break;
        }
        await wait(2500);
      },
      /** go to page `id`; pauses first while someone else has the app open */
      go: async (id) => {
        if (base) await waitForNoViewers(base, 1);
        return page.eval(`location.hash = '#scene=${id}'`);
      },
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
    if (process.platform === 'win32') killMatching(name);
    else proc.kill('SIGKILL');
    dropLock();
    process.off('exit', bail);
    for (const sig of SIGNALS) process.off(sig, onSignal);
    await wait(800);
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
    } catch {
      /* a file still locked: the temp folder is cleaned by the system later */
    }
  }
}
