// @ts-nocheck (spawns Node; the project has no @types/node)
import { spawn, type ChildProcess } from 'node:child_process';
import { qrPath } from '../src/engine/follow';
import { SCRIPT_TH } from '../src/content/scriptTh';
import { SCENES } from '../src/scenes/index';

// the phone follow relay (follow/server.mjs): create a session, join it, follow it live, and keep strangers out
let proc: ChildProcess;
const PORT = 18090 + Math.floor(Math.random() * 500);
const base = `http://127.0.0.1:${PORT}/f/`;

beforeAll(async () => {
  proc = spawn(process.execPath, ['follow/server.mjs'], { env: { ...process.env, FOLLOW_PORT: String(PORT), FOLLOW_BASE: '/f/' }, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(base + 'api/s/000000');
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
});
afterAll(() => proc.kill());

test('a session has a 6-digit code; only the presenter token can move the page; phones get the state first, then every change', async () => {
  const { code, token } = await (await fetch(base + 'api/create', { method: 'POST' })).json();
  expect(code).toMatch(/^\d{6}$/);
  expect((await fetch(`${base}api/s/${code}/state`, { method: 'POST', headers: { 'x-token': 'nope' }, body: '{"id":"3.2a"}' })).status).toBe(403);
  expect((await fetch(`${base}api/s/${code}/state`, { method: 'POST', headers: { 'x-token': token }, body: '{"id":"3.2a"}' })).status).toBe(200);
  const events = await fetch(`${base}api/s/${code}/events`);
  const reader = events.body!.getReader();
  const read = async () => new TextDecoder().decode((await reader.read()).value);
  let text = await read();
  expect(text + (await read())).toContain('"id":"3.2a"');
  await fetch(`${base}api/s/${code}/state`, { method: 'POST', headers: { 'x-token': token }, body: '{"id":"3.2b"}' });
  let more = '';
  for (let i = 0; i < 5 && !more.includes('"id":"3.2b"'); i++) more += await read();
  expect(more).toContain('"id":"3.2b"');
  await reader.cancel();
  expect((await fetch(base + 'api/s/000000')).status).toBe(404);
  expect((await fetch(`${base}api/s/${code}/end`, { method: 'POST', headers: { 'x-token': token } })).status).toBe(200);
  expect((await fetch(`${base}api/s/${code}`)).status).toBe(404);
});

test('a session ends by itself when the presenter goes quiet, and its phones are told; an open phone does not keep it alive', async () => {
  const quiet = spawn(process.execPath, ['follow/server.mjs'], { env: { ...process.env, FOLLOW_PORT: String(PORT + 1), FOLLOW_BASE: '/f/', FOLLOW_IDLE_MS: '600', FOLLOW_SWEEP_MS: '200' }, stdio: 'ignore' });
  try {
    const q = `http://127.0.0.1:${PORT + 1}/f/`;
    for (let i = 0; i < 50; i++) { try { await fetch(q + 'api/s/000000'); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }
    const { code } = await (await fetch(q + 'api/create', { method: 'POST' })).json();
    const feed = await fetch(`${q}api/s/${code}/events`);
    const reader = feed.body!.getReader();
    let seen = '';
    for (let i = 0; i < 20 && !seen.includes('event: end'); i++) seen += new TextDecoder().decode((await reader.read()).value ?? new Uint8Array());
    expect(seen).toContain('event: end');
    expect((await fetch(`${q}api/s/${code}`)).status).toBe(404);
  } finally {
    quiet.kill();
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
  for (const id of Object.keys(SCRIPT_TH)) expect(ids.has(id), id).toBe(true);
  expect(Object.keys(SCRIPT_TH)).toHaveLength(38);
  for (const s of SCENES.filter((x) => x.chapter === 2)) expect(SCRIPT_TH[s.id], s.id).toBeTruthy(); // all of Lab 3 has Thai
});
