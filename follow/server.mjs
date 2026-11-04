// Phone follow relay: a small zero-dependency Node server (owner, 3 Nov). The presenter's CityOps app creates a session (a 6-digit code) and
// tells it which page is on screen; phones join with the code and get the page's script live over Server-Sent Events.
//   node follow/server.mjs            listens on 127.0.0.1:${FOLLOW_PORT:-8090}; URLs are under ${FOLLOW_BASE:-/} (nginx strips nothing)
// Live sessions are in memory only. A session ends by itself when (a) the presenter has been silent for 90 minutes (a phone left open does not keep it alive),
// (b) it is 24 hours old, or (c) the presenter taps Stop. Ending it closes every phone's feed and frees its memory. The presenter token never
// leaves the presenter.
import { createServer } from 'node:http';
import { randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.FOLLOW_PORT ?? 8090);
const BASE = (process.env.FOLLOW_BASE ?? '/').replace(/\/?$/, '/');
const ROOT = fileURLToPath(new URL('./public/', import.meta.url));
const IDLE = Number(process.env.FOLLOW_IDLE_MS ?? 90 * 60 * 1000); // no page change or presenter call for this long ends the session
const MAX_AGE = 24 * 3600 * 1000;
const MAX_SESSIONS = 50;
const MAX_LISTENERS = 400;
const MAX_PER_IP = 12; // open live feeds from one address

/** @type {Map<string, {token: string, state: object, seq: number, last: number, res: Set<import('node:http').ServerResponse>}>} */
const sessions = new Map();
const feeds = new Map(); // ip -> open live feeds
const tries = new Map(); // ip -> [window start, count]: slows down guessing of codes

const MIME = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json' };

// ---- the script store (owner, 3 Nov): colleagues edit scripts and comment on pages from the CityOps "Scripts" mode.
// Every save is a version, appended to data/versions.jsonl, and goes live to phones at once. Comments are appended to data/comments.jsonl
// (add, reply, resolve, delete as events). Both files are the whole truth: the state below is rebuilt from them when the relay starts.
// Who did it comes from X-Remote-User, which nginx sets from the login on the manager's paths and blanks on the public ones.
const DATA = fileURLToPath(new URL(process.env.FOLLOW_DATA ? 'file://' + process.env.FOLLOW_DATA + '/' : './data/', import.meta.url));
const VFILE = join(DATA, 'versions.jsonl');
const CFILE = join(DATA, 'comments.jsonl');
/** @type {Map<string, {en: {v: number, text: string, by: string, at: string}, th: {v: number, text: string, by: string, at: string}}>} the live (latest) text per page and language */
const live = new Map();
/** @type {Array<{n: number, id: string, lang: string, text: string, by: string, at: string, note: string, from?: number}>} */
const versions = [];
/** @type {Map<string, Array<{cid: string, id: string, by: string, at: string, text: string, parent: string | null, resolved: boolean, deleted: boolean}>>} */
const comments = new Map();
const lines = (f) => (existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).flatMap((l) => { try { return [JSON.parse(l)]; } catch { return []; } }) : []);
for (const v of lines(VFILE)) {
  versions.push(v);
  const cur = live.get(v.id) ?? { en: null, th: null };
  cur[v.lang] = { v: v.n, text: v.text, by: v.by, at: v.at };
  live.set(v.id, cur);
}
for (const e of lines(CFILE)) applyComment(e);
function applyComment(e) {
  const list = comments.get(e.id) ?? [];
  if (e.op === 'add') list.push({ cid: e.cid, id: e.id, by: e.by, at: e.at, text: e.text, parent: e.parent ?? null, resolved: false, deleted: false });
  const c = list.find((x) => x.cid === e.cid);
  if (c && e.op === 'resolve') c.resolved = !!e.value;
  if (c && e.op === 'delete') c.deleted = true;
  if (c && e.op === 'edit') c.text = e.text;
  comments.set(e.id, list);
}
const save = async (f, obj) => {
  await mkdir(DATA, { recursive: true });
  await appendFile(f, JSON.stringify(obj) + '\n');
};
const who = (req) => String(req.headers['x-remote-user'] ?? '').slice(0, 40);
/** the pages' default text (the generated scripts.json: English from the scenes, Thai where it was written) */
const defaults = () => {
  try {
    return JSON.parse(readFileSync(join(ROOT, 'scripts.json'), 'utf8')).pages;
  } catch {
    return [];
  }
};
/** the pages as phones and the manager see them: the default text, replaced by the latest saved version where there is one */
const merged = () =>
  defaults().map((p) => {
    const l = live.get(p.id);
    return { ...p, en: l?.en ? l.en.text : p.en, th: l?.th ? l.th.text : p.th, vEn: l?.en?.v ?? 0, vTh: l?.th?.v ?? 0, byEn: l?.en?.by ?? '', byTh: l?.th?.by ?? '', atEn: l?.en?.at ?? '', atTh: l?.th?.at ?? '' };
  });
const broadcast = (event) => {
  const line = `event: script\ndata: ${JSON.stringify(event)}\n\n`;
  for (const s of sessions.values()) for (const r of s.res) r.write(line);
};
const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : -1);

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
};
const ip = (req) => String(req.headers['x-real-ip'] ?? req.socket.remoteAddress ?? '');
const limited = (req) => {
  const k = ip(req);
  const now = Date.now();
  const t = tries.get(k);
  if (!t || now - t[0] > 60_000) {
    tries.set(k, [now, 1]);
    return false;
  }
  t[1] += 1;
  return t[1] > 40;
};
const endSession = (code, s) => {
  for (const r of s.res) {
    try {
      r.end('event: end\ndata: {}\n\n');
    } catch {
      /* already gone */
    }
  }
  s.res.clear();
  sessions.delete(code);
};
const sweep = () => {
  const now = Date.now();
  for (const [code, s] of sessions) if (now - s.last > IDLE || now - s.born > MAX_AGE) endSession(code, s);
  for (const [k, t] of tries) if (now - t[0] > 120_000) tries.delete(k);
  for (const [k, n] of feeds) if (n <= 0) feeds.delete(k);
};
setInterval(sweep, Number(process.env.FOLLOW_SWEEP_MS ?? 60_000)).unref();
// one line every 10 minutes in the journal: enough to see a leak (sessions, feeds and memory should return to ~0 after an event)
setInterval(() => {
  let n = 0;
  for (const s of sessions.values()) n += s.res.size;
  console.log(`follow: ${sessions.size} sessions, ${n} feeds, rss ${(process.memoryUsage().rss / 1048576).toFixed(0)} MB`);
}, 600_000).unref();

const body = (req, max = 4000) =>
  new Promise((resolve) => {
    let b = '';
    req.on('data', (c) => {
      b += c;
      if (b.length > max) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(b || '{}'));
      } catch {
        resolve({});
      }
    });
  });

const sameToken = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};
const push = (s) => {
  const line = `data: ${JSON.stringify({ ...s.state, seq: s.seq, listeners: s.res.size })}\n\n`;
  for (const r of s.res) r.write(line);
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  if (!url.pathname.startsWith(BASE)) return json(res, 404, { error: 'not found' });
  const path = url.pathname.slice(BASE.length - 1); // keeps the leading slash
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('referrer-policy', 'no-referrer');

  // ---- the presenter creates a session (nginx puts the login in front of this one path)
  if (path === '/api/create' && req.method === 'POST') {
    if (sessions.size >= MAX_SESSIONS) sweep();
    if (sessions.size >= MAX_SESSIONS) return json(res, 503, { error: 'too many sessions' });
    let code;
    do code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    while (sessions.has(code));
    const token = randomBytes(24).toString('hex');
    sessions.set(code, { token, state: { id: '', lang: 'en' }, seq: 0, born: Date.now(), last: Date.now(), res: new Set() });
    return json(res, 200, { code, token });
  }

  const m = path.match(/^\/api\/s\/(\d{6})(\/state|\/events|\/end)?$/);
  if (m) {
    const s = sessions.get(m[1]);
    if (limited(req)) return json(res, 429, { error: 'slow down' });
    if (!s) return json(res, 404, { error: 'no such session' });
    // the presenter reports the page on screen
    if (m[2] === '/state' && req.method === 'POST') {
      if (!sameToken(req.headers['x-token'], s.token)) return json(res, 403, { error: 'not the presenter' });
      s.last = Date.now(); // only the presenter keeps a session alive
      const b = await body(req);
      const id = typeof b.id === 'string' ? b.id.slice(0, 16) : '';
      s.state = { id, lang: b.lang === 'th' ? 'th' : 'en' };
      s.seq += 1;
      push(s);
      return json(res, 200, { ok: true, listeners: s.res.size });
    }
    if (m[2] === '/end' && req.method === 'POST') {
      if (!sameToken(req.headers['x-token'], s.token)) return json(res, 403, { error: 'not the presenter' });
      endSession(m[1], s);
      return json(res, 200, { ok: true });
    }
    // a phone follows: the current state now, then every change
    if (m[2] === '/events' && req.method === 'GET') {
      if (s.res.size >= MAX_LISTENERS) return json(res, 503, { error: 'room is full' });
      const addr = ip(req);
      if ((feeds.get(addr) ?? 0) >= MAX_PER_IP) return json(res, 429, { error: 'too many open feeds' });
      feeds.set(addr, (feeds.get(addr) ?? 0) + 1);
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive', 'x-accel-buffering': 'no' });
      res.write('retry: 2000\n\n');
      s.res.add(res);
      res.write(`data: ${JSON.stringify({ ...s.state, seq: s.seq, listeners: s.res.size })}\n\n`);
      push(s);
      const beat = setInterval(() => {
        try {
          res.write(': beat\n\n');
        } catch {
          done();
        }
      }, 20_000);
      let closed = false;
      const done = () => {
        if (closed) return;
        closed = true;
        clearInterval(beat);
        s.res.delete(res);
        feeds.set(addr, Math.max(0, (feeds.get(addr) ?? 1) - 1));
      };
      req.on('close', done);
      res.on('close', done);
      res.on('error', done);
      return;
    }
    if (!m[2] && req.method === 'GET') return json(res, 200, { ok: true, state: s.state, listeners: s.res.size });
    return json(res, 405, { error: 'method' });
  }

  // ---- the manager's API (nginx puts the login in front of /api/m/ and sets X-Remote-User)
  if (path.startsWith('/api/m/')) {
    const user = who(req);
    if (!user) return json(res, 401, { error: 'login needed' });
    const q = path.slice('/api/m/'.length).split('/');
    if (q[0] === 'me') return json(res, 200, { user });
    if (q[0] === 'pages' && req.method === 'GET') {
      const counts = {};
      for (const [id, list] of comments) counts[id] = list.filter((c) => !c.deleted && !c.parent && !c.resolved).length;
      return json(res, 200, { pages: merged().map((p) => ({ ...p, open: counts[p.id] ?? 0 })) });
    }
    const id = decodeURIComponent(q[1] ?? '').slice(0, 16);
    if (!/^[0-9a-z.]+$/i.test(id)) return json(res, 400, { error: 'bad page' });
    // save a script: a new version, live at once. `base` is the version the editor started from; a newer one means someone else saved first
    if (q[0] === 'script' && req.method === 'PUT') {
      const b = await body(req, 60_000);
      const lang = b.lang === 'th' ? 'th' : 'en';
      const text = typeof b.text === 'string' ? b.text.replace(/\r\n/g, '\n').slice(0, 20_000) : null;
      if (text === null) return json(res, 400, { error: 'no text' });
      const cur = merged().find((p) => p.id === id);
      if (!cur) return json(res, 404, { error: 'no such page' });
      const have = lang === 'th' ? cur.vTh : cur.vEn;
      if (num(b.base) !== have) return json(res, 409, { error: 'newer version', version: have, by: lang === 'th' ? cur.byTh : cur.byEn, text: lang === 'th' ? cur.th : cur.en });
      if (text === (lang === 'th' ? cur.th : cur.en)) return json(res, 200, { ok: true, unchanged: true, version: have });
      const v = { n: versions.length + 1, id, lang, text, by: user, at: new Date().toISOString(), note: String(b.note ?? '').slice(0, 200), ...(b.from !== undefined ? { from: num(b.from) } : {}) };
      versions.push(v);
      await save(VFILE, v);
      const l = live.get(id) ?? { en: null, th: null };
      l[lang] = { v: v.n, text, by: user, at: v.at };
      live.set(id, l);
      broadcast({ id, lang, text });
      return json(res, 200, { ok: true, version: v.n, by: user, at: v.at });
    }
    // the history of one page and language, newest first; version 0 is the default text the page started with
    if (q[0] === 'versions' && req.method === 'GET') {
      const lang = url.searchParams.get('lang') === 'th' ? 'th' : 'en';
      const base = defaults().find((p) => p.id === id);
      const list = versions.filter((v) => v.id === id && v.lang === lang).reverse();
      return json(res, 200, { versions: list, default: base ? base[lang] : '' });
    }
    if (q[0] === 'comments' && req.method === 'GET') return json(res, 200, { comments: (comments.get(id) ?? []).filter((c) => !c.deleted || (comments.get(id) ?? []).some((x) => x.parent === c.cid && !x.deleted)) });
    if (q[0] === 'comments' && req.method === 'POST') {
      const b = await body(req, 8000);
      const text = typeof b.text === 'string' ? b.text.trim().slice(0, 2000) : '';
      if (!text) return json(res, 400, { error: 'empty' });
      const list = comments.get(id) ?? [];
      const parent = typeof b.parent === 'string' && list.some((c) => c.cid === b.parent && !c.parent) ? b.parent : null;
      const e = { op: 'add', cid: randomBytes(6).toString('hex'), id, by: user, at: new Date().toISOString(), text, parent };
      applyComment(e);
      await save(CFILE, e);
      return json(res, 200, { ok: true, cid: e.cid });
    }
    if (q[0] === 'comments' && req.method === 'PATCH') {
      const b = await body(req, 2000);
      const c = (comments.get(id) ?? []).find((x) => x.cid === b.cid);
      if (!c) return json(res, 404, { error: 'no such comment' });
      let e;
      if (b.op === 'resolve' && !c.parent) e = { op: 'resolve', cid: c.cid, id, by: user, at: new Date().toISOString(), value: !!b.value };
      else if (b.op === 'delete' && c.by === user) e = { op: 'delete', cid: c.cid, id, by: user, at: new Date().toISOString() };
      else return json(res, 403, { error: 'not allowed' });
      applyComment(e);
      await save(CFILE, e);
      return json(res, 200, { ok: true });
    }
    return json(res, 404, { error: 'not found' });
  }

  // ---- the phone app and its scripts
  if (path === '/api/pages' && req.method === 'GET') return json(res, 200, { pages: merged() });
  if (req.method === 'GET') {
    const rel = normalize(path === '/' || path === '' ? '/index.html' : path).replace(/^(\.\.[/\\])+/, '');
    try {
      const file = await readFile(join(ROOT, rel));
      res.writeHead(200, { 'content-type': MIME[extname(rel)] ?? 'application/octet-stream', 'cache-control': rel.endsWith('.json') ? 'no-cache' : 'public, max-age=300' });
      return res.end(file);
    } catch {
      return json(res, 404, { error: 'not found' });
    }
  }
  json(res, 404, { error: 'not found' });
}).listen(PORT, '127.0.0.1', () => console.log(`follow relay on 127.0.0.1:${PORT}${BASE}`));
