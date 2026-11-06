// Refresh the previews of Lab 3's code map steps for the page overview: public/thumbs/3.6m.jpg and 3.6m_1.jpg ... 3.6m_18.jpg (384 x 216).
// The page's HTML is captured; the 3D city behind it is not drawn by a headless browser without WebGL, so the previews show the panel over the scrim.
// Run against a running dev server:  PLAYWRIGHT=/path/to/playwright-core node tools/capture-code-map-thumbs.mjs http://127.0.0.1:8082/aiexperiencelive2026/
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT ?? 'playwright-core');
const base = process.argv[2] ?? 'http://localhost:5174/';
const out = new URL('../public/thumbs/', import.meta.url).pathname;
const steps = Number(process.env.STEPS ?? 18);

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 0.2 });
const page = await ctx.newPage();
await page.goto(`${base}#scene=3.6m`);
await page.waitForSelector('[data-testid=code-map]', { timeout: 40000 });
await page.waitForTimeout(3500);
for (let i = 0; i <= steps; i++) {
  if (i > 0) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(2500);
  }
  const file = `${out}${i === 0 ? '3.6m' : `3.6m_${i}`}.jpg`;
  await page.screenshot({ path: file, type: 'jpeg', quality: 80 });
  console.log('wrote', file);
}
await browser.close();
