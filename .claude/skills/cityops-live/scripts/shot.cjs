// Look at a page the way the audience sees it (the panels; the 3D city needs a GPU): open #scene=<id>, press Next <clicks> times, take a picture.
//   node .claude/skills/cityops-live/scripts/shot.cjs 3.6m 6                     -> /tmp/cityops-3.6m-6.png
//   node .claude/skills/cityops-live/scripts/shot.cjs 3.5e 3 out.png --clean      (hide the page counter, progress bar and the Next buttons)
//   node .claude/skills/cityops-live/scripts/shot.cjs 3.15d 4 th.jpg --thumb      (a 384 px preview like public/thumbs/<id>.jpg)
// Needs the dev server running (npm run dev, default http://127.0.0.1:5174/; set CITYOPS_URL for another address) and Playwright:
//   npm i --no-save playwright-core && npx playwright-core install chromium     (or set PLAYWRIGHT_CORE to an existing playwright-core folder)
// ALWAYS look at the picture (and at the page's own text sizes) before you call a page done: a wide shot hides overflow and clipping.
const path = require('node:path');
const load = () => {
  for (const m of [process.env.PLAYWRIGHT_CORE, 'playwright-core', 'playwright'].filter(Boolean)) {
    try { return require(m); } catch { /* try the next */ }
  }
  console.error('Playwright is not installed: npm i --no-save playwright-core && npx playwright-core install chromium');
  process.exit(2);
};
const { chromium } = load();
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const flag = (f) => process.argv.includes(f);
const [id, clicks = '0', out] = args;
if (!id) { console.error('usage: shot.cjs <scene id> [clicks] [out file] [--clean] [--thumb]'); process.exit(1); }
const base = (process.env.CITYOPS_URL || 'http://127.0.0.1:5174/').replace(/\/?$/, '/');
const file = out || `/tmp/cityops-${id}-${clicks}.${flag('--thumb') ? 'jpg' : 'png'}`;
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: flag('--thumb') ? 0.2 : 1 });
  const page = await ctx.newPage();
  const bad = [];
  // without a GPU three.js cannot read a shader's log and throws from WebGLProgram: expected there, not a bug in the page
  let noGpu = 0;
  page.on('pageerror', (e) => ((e.stack || '').includes('WebGLProgram') ? noGpu++ : bad.push(e.message.slice(0, 160))));
  await page.goto(`${base}#scene=${id}`);
  await page.reload();
  await page.waitForTimeout(6000);
  if (flag('--clean') || flag('--thumb')) await page.addStyleTag({ content: '.stepper,.script,.counter,.progress,.cam-edit,.jd{display:none!important}' });
  for (let i = 0; i < Number(clicks); i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(700); }
  await page.waitForTimeout(5500); // the panel and its animations settle
  const info = await page.evaluate(() => ({ hash: location.hash, strip: document.querySelector('.strip')?.textContent || '' }));
  await page.screenshot({ path: path.resolve(file), type: flag('--thumb') ? 'jpeg' : 'png', quality: flag('--thumb') ? 82 : undefined });
  console.log(`${info.strip}  ${info.hash}  ->  ${path.resolve(file)}${bad.length ? `\npage errors: ${bad.join(' | ')}` : ''}${noGpu ? `\n(${noGpu} WebGL shader errors ignored: this machine has no GPU, the 3D city is not drawn)` : ''}`);
  await browser.close();
})();
