// @ts-nocheck (spawns Node; the project has no @types/node)
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { once } from 'node:events';
import { qrPath } from '../src/engine/follow';
import { SCRIPT_TH } from '../src/content/scriptTh';
import { SCENES } from '../src/scenes/index';
import { LAB3_CUT } from '../src/scenes/chapter2';

// the phone follow relay (follow/server.mjs): create a session, join it, follow it live, and keep strangers out
let proc: ChildProcess;
const PORT = 18090 + Math.floor(Math.random() * 500);
const base = `http://127.0.0.1:${PORT}/f/`;
const fixtureRoot = resolve('.local', 'follow-tests');
mkdirSync(fixtureRoot, { recursive: true });
const fixtures: string[] = [];
const fixture = () => { const dir = mkdtempSync(join(fixtureRoot, 'relay-')); fixtures.push(dir); return dir; };
const stop = async (child: ChildProcess) => {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = once(child, 'exit');
  child.kill();
  await exited;
};
async function readUntil(reader: ReadableStreamDefaultReader<Uint8Array>, needle: string): Promise<string> {
  const decoder = new TextDecoder();
  let text = '';
  let timer: ReturnType<typeof setTimeout>;
  try {
    return await Promise.race([
      (async () => {
        while (!text.includes(needle)) {
          const chunk = await reader.read();
          if (chunk.done) throw new Error(`SSE ended before ${needle}`);
          text += decoder.decode(chunk.value, { stream: true });
        }
        return text;
      })(),
      new Promise<never>((_resolve, reject) => { timer = setTimeout(() => reject(new Error(`SSE did not deliver ${needle}`)), 3000); }),
    ]);
  } catch (error) {
    await reader.cancel();
    throw error;
  } finally {
    clearTimeout(timer!);
  }
}

beforeAll(async () => {
  proc = spawn(process.execPath, ['follow/server.mjs'], { env: { ...process.env, FOLLOW_PORT: String(PORT), FOLLOW_BASE: '/f/', FOLLOW_DATA: fixture() }, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(base + 'api/s/000000');
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
});
afterAll(async () => {
  await stop(proc);
  const root = realpathSync(fixtureRoot);
  for (const dir of fixtures) {
    const target = realpathSync(dir);
    if (dirname(target) !== root) throw new Error('Refusing cleanup outside the relay test fixture directory');
    rmSync(target, { recursive: true, force: true });
  }
});

test('a session has a 6-digit code; only the presenter token can move the page; phones get the state first, then every change', async () => {
  const { code, token } = await (await fetch(base + 'api/create', { method: 'POST' })).json();
  expect(code).toMatch(/^\d{6}$/);
  expect((await fetch(`${base}api/s/${code}/state`, { method: 'POST', headers: { 'x-token': 'nope' }, body: '{"id":"3.3b"}' })).status).toBe(403);
  expect((await fetch(`${base}api/s/${code}/state`, { method: 'POST', headers: { 'x-token': token }, body: '{"id":"3.3b"}' })).status).toBe(200);
  const events = await fetch(`${base}api/s/${code}/events`);
  const reader = events.body!.getReader();
  expect(await readUntil(reader, '"id":"3.3b"')).toContain('"id":"3.3b"');
  await fetch(`${base}api/s/${code}/state`, { method: 'POST', headers: { 'x-token': token }, body: '{"id":"3.2b"}' });
  expect(await readUntil(reader, '"id":"3.2b"')).toContain('"id":"3.2b"');
  await reader.cancel();
  expect((await fetch(base + 'api/s/000000')).status).toBe(404);
  expect((await fetch(`${base}api/s/${code}/end`, { method: 'POST', headers: { 'x-token': token } })).status).toBe(200);
  expect((await fetch(`${base}api/s/${code}`)).status).toBe(404);
});

test('a session ends by itself when the presenter goes quiet, and its phones are told; an open phone does not keep it alive', async () => {
  const quiet = spawn(process.execPath, ['follow/server.mjs'], { env: { ...process.env, FOLLOW_PORT: String(PORT + 1), FOLLOW_BASE: '/f/', FOLLOW_DATA: fixture(), FOLLOW_IDLE_MS: '600', FOLLOW_SWEEP_MS: '200' }, stdio: 'ignore' });
  try {
    const q = `http://127.0.0.1:${PORT + 1}/f/`;
    for (let i = 0; i < 50; i++) { try { await fetch(q + 'api/s/000000'); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }
    const { code } = await (await fetch(q + 'api/create', { method: 'POST' })).json();
    const feed = await fetch(`${q}api/s/${code}/events`);
    const reader = feed.body!.getReader();
    expect(await readUntil(reader, 'event: end')).toContain('event: end');
    await reader.cancel();
    expect((await fetch(`${q}api/s/${code}`)).status).toBe(404);
  } finally {
    await stop(quiet);
  }
});

test('the script manager: a login name is needed, every save is a version that goes live, a stale save is refused, comments thread', async () => {
  const dir = fixture();
  const mp = spawn(process.execPath, ['follow/server.mjs'], { env: { ...process.env, FOLLOW_PORT: String(PORT + 2), FOLLOW_BASE: '/f/', FOLLOW_DATA: dir }, stdio: 'ignore' });
  try {
    const m = `http://127.0.0.1:${PORT + 2}/f/`;
    for (let i = 0; i < 50; i++) { try { await fetch(m + 'api/pages'); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }
    const as = (u: string) => ({ 'x-remote-user': u });
    expect((await fetch(m + 'api/m/me')).status).toBe(401);
    expect((await (await fetch(m + 'api/m/me', { headers: as('Mali') })).json()).user).toBe('Mali');
    const put = (u: string, text: string, base: number) => fetch(m + 'api/m/script/3.3b', { method: 'PUT', headers: as(u), body: JSON.stringify({ lang: 'th', text, base }) });
    const a = await put('Mali', 'แก้ครั้งแรก', 0);
    expect((await a.json()).version).toBe(1);
    expect((await put('Nok', 'แก้ซ้อน', 0)).status).toBe(409); // Nok started from the default, Mali saved first
    expect((await put('Nok', 'แก้ต่อ', 1)).status).toBe(200);
    const pages = (await (await fetch(m + 'api/pages')).json()).pages; // public: phones read the latest
    expect(pages.find((p: { id: string }) => p.id === '3.3b').th).toBe('แก้ต่อ');
    const vs = (await (await fetch(m + 'api/m/versions/3.3b?lang=th', { headers: as('Mali') })).json()).versions;
    expect(vs.map((v: { by: string }) => v.by)).toEqual(['Nok', 'Mali']);
    const c = await (await fetch(m + 'api/m/comments/3.3b', { method: 'POST', headers: as('Mali'), body: JSON.stringify({ text: 'ช้าไป' }) })).json();
    await fetch(m + 'api/m/comments/3.3b', { method: 'POST', headers: as('Nok'), body: JSON.stringify({ text: 'ok', parent: c.cid }) });
    expect((await fetch(m + 'api/m/comments/3.3b', { method: 'PATCH', headers: as('Nok'), body: JSON.stringify({ op: 'delete', cid: c.cid }) })).status).toBe(403); // only the author deletes
    const list = (await (await fetch(m + 'api/m/comments/3.3b', { headers: as('Mali') })).json()).comments;
    expect(list.filter((x: { parent: string | null }) => x.parent === c.cid)).toHaveLength(1);
  } finally {
    await stop(mp);
  }
});

test('the phone page and its scripts are served, and nothing outside the public folder is', async () => {
  expect((await fetch(base)).status).toBe(200);
  expect((await fetch(base + 'scripts.json')).status).toBe(200);
  expect((await fetch(base + '..%2f..%2fpackage.json')).status).toBe(404);
  expect((await fetch(`http://127.0.0.1:${PORT}/other`)).status).toBe(404);
});

test('the QR for a join address is a real code, and every Thai script page is a real page', () => {
  const q = qrPath('https://example.org/follow/?c=123456');
  expect(q.n).toBeGreaterThanOrEqual(21);
  expect(q.d.startsWith('M')).toBe(true);
  const ids = new Set(SCENES.map((s) => s.id));
  for (const id of Object.keys(SCRIPT_TH)) expect(ids.has(id) || LAB3_CUT.has(id), id).toBe(true); // a hidden page keeps its script
  expect(Object.keys(SCRIPT_TH)).toHaveLength(50);
  for (const s of SCENES.filter((x) => x.chapter === 2)) expect(SCRIPT_TH[s.id], s.id).toBeTruthy(); // all of Lab 3 has Thai
});

// owner, 4 Nov: the viewer can show the slide's plain preview picture, or not
test('the phone viewer has a slide-picture switch, and the pictures reach the open phone page', async () => {
  const html = readFileSync('follow/public/index.html', 'utf8');
  expect(html).toContain('id="thumbBtn"');
  expect(html).toContain('thumbs/${encodeURIComponent(p.id.replace(');
  const picture = await fetch(base + 'thumbs/3.7.jpg');
  expect(picture.status).toBe(200);
  expect(picture.headers.get('content-type')).toBe('image/jpeg');
  const bytes = new Uint8Array(await picture.arrayBuffer());
  expect(bytes.length).toBeGreaterThan(1000);
  expect(Array.from(bytes.slice(0, 3))).toEqual([0xff, 0xd8, 0xff]);
  expect((await fetch(base + 'thumbs/..%2f..%2fserver.mjs')).status).toBe(404);
});

// owner, 4 Nov: the viewer renders the scripts' markdown, and never as HTML, because colleagues write them
test('the phone viewer renders markdown safely, and leaves names with underscores alone', () => {
  new Function(readFileSync('follow/public/md.js', 'utf8'))();
  const box = document.createElement('div');
  (window as any).renderMarkdown(box, '# Title\n\nThis is **the foundation** and *a key* in `CITY_MEMORY` or CITY_MEMORY_call_copilot.\nNext line\n\n- one\n- two\n\n1. first\n\n> quote\n\n[site](https://example.com) [bad](javascript:alert(1))\n\n<img src=x onerror=alert(1)>');
  expect(box.querySelector('h3')!.textContent).toBe('Title');
  expect(box.querySelector('strong')!.textContent).toBe('the foundation');
  expect(box.querySelector('em')!.textContent).toBe('a key');
  expect(box.querySelector('code')!.textContent).toBe('CITY_MEMORY');
  expect(box.textContent).toContain('CITY_MEMORY_call_copilot');
  expect(box.querySelector('br')).toBeTruthy();
  expect(box.querySelectorAll('ul li')).toHaveLength(2);
  expect(box.querySelectorAll('ol li')).toHaveLength(1);
  expect(box.querySelector('blockquote')!.textContent).toBe('quote');
  const links = box.querySelectorAll('a');
  expect(links).toHaveLength(1);
  expect(links[0].getAttribute('href')).toBe('https://example.com');
  expect(box.querySelector('img')).toBeNull();
  expect(box.textContent).toContain('<img src=x onerror=alert(1)>');
  expect(box.textContent).toContain('[bad](javascript:alert(1))');
});

test('the code map has one script per click: English and Thai for every stop, nothing left as a wall', async () => {
  const { STEP_EN, STEP_TH, STEP_PAGES, stepScriptId } = await import('../src/content/scriptSteps');
  const { MAP_STEPS } = await import('../src/content/lab3Map');
  expect(STEP_PAGES['3.6m']).toBe(MAP_STEPS.length);
  expect(STEP_EN['3.6m']).toHaveLength(MAP_STEPS.length);
  expect(STEP_TH['3.6m']).toHaveLength(MAP_STEPS.length);
  expect(stepScriptId('3.6m', 0)).toBe('3.6m');
  expect(stepScriptId('3.6m', 7)).toBe('3.6m.7');
  for (const t of STEP_EN['3.6m']) expect(t.length).toBeLessThan(400);
  for (const t of STEP_TH['3.6m']) expect(t.trim().length).toBeGreaterThan(0);
});
