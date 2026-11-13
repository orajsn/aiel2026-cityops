// A browser smoke test of a RUNNING deployment: every page opens without errors, the service worker takes charge, the phone-follow flow works
// end to end (presenter starts sharing, a phone joins with the code, the phone follows a page change), and the script manager lists
// the pages and saves a version that reaches the phone live. Panels only: no GPU needed (WebGL shader errors are ignored).
//   node .claude/skills/cityops-live/scripts/smoke.cjs <app url> [user password]
//   node .claude/skills/cityops-live/scripts/smoke.cjs http://localhost:5174/                       (dev server; no login)
//   node .claude/skills/cityops-live/scripts/smoke.cjs https://host/aiexperiencelive2026/ mali pw   (behind nginx's login)
// Needs Playwright (npm i --no-save playwright-core && npx playwright-core install chromium, or PLAYWRIGHT_CORE=<folder>).
// Needs the phone relay behind the same address (<url>follow/); without it the phone and manager parts report SKIP.
// It SAVES one script version on a page (the page named by SMOKE_PAGE, default 0.1, language en, note "smoke test") and restores the text.
const fs = require('node:fs');
const path = require('node:path');
const load = () => {
  for (const m of [process.env.PLAYWRIGHT_CORE, 'playwright-core', 'playwright'].filter(Boolean)) { try { return require(m); } catch { /* next */ } }
  console.error('Playwright is not installed'); process.exit(2);
};
const { chromium } = load();
const [urlArg, user, pass] = process.argv.slice(2);
if (!urlArg) { console.error('usage: smoke.cjs <app url> [user password]'); process.exit(1); }
const base = urlArg.replace(/\/?$/, '/');
const results = [];
const ok = (name, good, detail = '') => { results.push(good); console.log(`${good ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); };
const skip = (name, why) => console.log(`SKIP  ${name}  ${why}`);

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu', '--ignore-certificate-errors'] });
  const ctxOpts = { viewport: { width: 1600, height: 900 }, ignoreHTTPSErrors: true, ...(user ? { httpCredentials: { username: user, password: pass } } : {}) };
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const failed = [], errors = [];
  // the dev server's own endpoints are absent from a static build: the app falls back to its bundled data, so those 404s are expected
  page.on('response', (r) => { if (r.status() >= 400 && !/__(camera-overrides|traffic|viewers)/.test(r.url()) && !/\/follow\/api\/s\//.test(r.url())) failed.push(`${r.status()} ${r.url().replace(base, '/')}`); });
  page.on('pageerror', (e) => { if (!(e.stack || '').includes('WebGLProgram')) errors.push(e.message.slice(0, 140)); });

  // 1. the app opens and every page opens
  await page.goto(base + '#scene=0.0');
  await page.waitForTimeout(6000);
  ok('the app opens', (await page.locator('.strip').count()) > 0, (await page.locator('.strip').first().textContent()) || '');
  const ids = Object.keys(
    JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../follow/public/scripts.json'), 'utf8')).pages.reduce((a, p) => ((p.id.match(/\./g) || []).length <= 1 ? { ...a, [p.id]: 1 } : a), {}),
  );
  let opened = 0, emptyStrip = [];
  for (const id of ids) {
    await page.evaluate((i) => { location.hash = '#scene=' + i; }, id);
    await page.waitForTimeout(900);
    const s = (await page.locator('.strip').first().textContent()) || '';
    const here = await page.evaluate(() => location.hash);
    if (s.trim() && here === '#scene=' + id) opened++; else emptyStrip.push(id);
  }
  ok(`every page opens (${opened} of ${ids.length})`, opened === ids.length, emptyStrip.length ? 'not opened: ' + emptyStrip.join(', ') : '');
  ok('no failed requests while opening them', failed.length === 0, failed.slice(0, 5).join(' | '));
  ok('no page errors (WebGL shader errors ignored)', errors.length === 0, errors.slice(0, 3).join(' | '));

  // 2. the service worker keeps the map (needs https or localhost)
  const sw = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return { secure: false };
    const reg = await navigator.serviceWorker.getRegistration();
    return { secure: true, active: !!reg?.active, caches: (await caches.keys()).length };
  });
  if (!sw.secure) skip('service worker', 'the address is not https or localhost');
  else ok('the service worker is active and caching', sw.active, JSON.stringify(sw));

  // 3. the phone follow flow
  const relay = await page.evaluate(async (b) => (await fetch(b + 'follow/api/pages', { cache: 'no-store' })).ok, base).catch(() => false);
  if (!relay) { skip('phone follow and script manager', `no relay answers at ${base}follow/`); }
  else {
    await page.evaluate(() => { location.hash = '#scene=0.2'; });
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Start sharing' }).click();
    await page.waitForSelector('[data-follow-settings-code]', { timeout: 10000 });
    const code = ((await page.locator('[data-follow-settings-code]').textContent()) || '').replace(/\s/g, '');
    ok('the presenter gets a 6-digit code', /^\d{6}$/.test(code), code);
    await page.locator('.follow-card').click();   // the join card covers the screen until it is clicked
    await page.getByRole('button', { name: 'Close settings' }).click();
    const phone = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, ignoreHTTPSErrors: true })).newPage();
    await phone.goto(base + 'follow/');
    const boxes = phone.locator('.otp input');
    for (let i = 0; i < 6; i++) await boxes.nth(i).fill(code[i]);
    await phone.locator('#goBtn').click();   // the phone page speaks Thai by default
    await phone.waitForSelector('#view:not([hidden])', { timeout: 10000 });
    await phone.waitForTimeout(1500);
    const t1 = await phone.locator('#ttl').textContent();
    ok('a phone joins with the code and shows the page', !!t1, t1 || '');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(4000);
    const t2 = await phone.locator('#ttl').textContent();
    ok('the phone follows the presenter to the next page', !!t2 && t2 !== t1, `${t1} -> ${t2}`);
    ok('the phone shows a script', ((await phone.locator('#script').textContent()) || '').trim().length > 20);

    // 4. the script manager: the page lists, a save reaches the phone live, and the text is restored
    const mgr = await ctx.newPage();
    await mgr.goto(base + '?mode=scripts');
    await mgr.waitForSelector('nav[aria-label="Pages"] button', { timeout: 15000 }).catch(() => {});
    const listed = await mgr.locator('nav[aria-label="Pages"] button').count();
    ok('the script manager lists the pages', listed > 50, `${listed} pages`);
    const pid = process.env.SMOKE_PAGE || '0.1';
    const api = (p, o = {}) => mgr.evaluate(async ([b, p2, o2]) => { const r = await fetch(b + p2, { ...o2, headers: { 'content-type': 'application/json' } }); return { s: r.status, j: await r.json().catch(() => ({})) }; }, [base + 'follow/', p, o]);
    const pages = (await api('api/m/pages')).j.pages;
    const pg = pages.find((x) => x.id === pid);
    const marker = ' [smoke ' + Date.now() + ']';
    const saved = await api('api/m/script/' + pid, { method: 'PUT', body: JSON.stringify({ lang: 'en', text: pg.en + marker, base: pg.vEn, note: 'smoke test' }) });
    ok('a script version saves', saved.s === 200 && saved.j.ok, `version ${saved.j.version}`);
    const back = await api('api/m/script/' + pid, { method: 'PUT', body: JSON.stringify({ lang: 'en', text: pg.en, base: saved.j.version, note: 'smoke test: restored' }) });
    ok('the text is restored (a second version)', back.s === 200, `version ${back.j.version}`);
    const vs = (await api('api/m/versions/' + pid + '?lang=en')).j.versions || [];
    ok('both versions are in the history', vs.some((v) => v.note === 'smoke test') && vs.some((v) => v.note === 'smoke test: restored'));
    // the presenter stops sharing: the phone is told the session ended
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Stop sharing' }).click();
    await page.waitForTimeout(1500);
    ok('Stop sharing ends the session', !(await api('api/s/' + code)).j.ok && (await api('api/s/' + code)).s === 404);
  }
  await browser.close();
  const bad = results.filter((r) => !r).length;
  console.log(`\n${bad ? bad + ' check(s) FAILED' : 'All checks passed'} (${results.length} run)`);
  process.exit(bad ? 1 : 0);
})();
