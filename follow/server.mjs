// Phone follow relay: a small zero-dependency Node server (owner, 3 Nov). The presenter's CityOps app creates a session (a 6-digit code) and
// tells it which page is on screen; phones join with the code and get the page's script live over Server-Sent Events.
//   node follow/server.mjs            listens on 127.0.0.1:${FOLLOW_PORT:-8090}; URLs are under ${FOLLOW_BASE:-/} (nginx strips nothing)
// Nothing is stored on disk. A session ends by itself when (a) the presenter has been silent for 4 hours (a phone left open does not keep it alive),
// (b) it is 24 hours old, or (c) the presenter taps Stop. Ending it closes every phone's feed and frees its memory. The presenter token never
// leaves the presenter.
import { createServer } from 'node:http';
import { randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.FOLLOW_PORT ?? 8090);
const BASE = (process.env.FOLLOW_BASE ?? '/').replace(/\/?$/, '/');
const ROOT = fileURLToPath(new URL('./public/', import.meta.url));
const IDLE = Number(process.env.FOLLOW_IDLE_MS ?? 4 * 3600 * 1000); // no page change or presenter call for this long ends the session
const MAX_AGE = 24 * 3600 * 1000;
const MAX_SESSIONS = 50;
const MAX_LISTENERS = 400;
const MAX_PER_IP = 12; // open live feeds from one address

/** @type {Map<string, {token: string, state: object, seq: number, last: number, res: Set<import('node:http').ServerResponse>}>} */
const sessions = new Map();
const feeds = new Map(); // ip -> open live feeds
const tries = new Map(); // ip -> [window start, count]: slows down guessing of codes

const MIME = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
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

const body = (req) =>
  new Promise((resolve) => {
    let b = '';
    req.on('data', (c) => {
      b += c;
      if (b.length > 4000) req.destroy();
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
      const who = ip(req);
      if ((feeds.get(who) ?? 0) >= MAX_PER_IP) return json(res, 429, { error: 'too many open feeds' });
      feeds.set(who, (feeds.get(who) ?? 0) + 1);
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
        feeds.set(who, Math.max(0, (feeds.get(who) ?? 1) - 1));
      };
      req.on('close', done);
      res.on('close', done);
      res.on('error', done);
      return;
    }
    if (!m[2] && req.method === 'GET') return json(res, 200, { ok: true, state: s.state, listeners: s.res.size });
    return json(res, 405, { error: 'method' });
  }

  // ---- the phone app and its scripts
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
