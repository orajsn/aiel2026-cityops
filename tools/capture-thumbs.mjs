// Refresh the page-overview previews: public/thumbs/<scene id>.jpg (384 x 216).
// Needs the dev server running (npm run dev). Opens the pages in a hidden browser (closed afterwards, process
// tree and all), hides the buttons, script bar and Jupyter handle, and saves a small picture of the 1920 x 1080
// stage at the END of each page (owner, 25 Oct: many pages play a sequence, so the preview shows where it lands):
//   1. wait until the camera has arrived (the store's `settled`),
//   2. on sky pages, wait for the act clock to run out (SkyStage ACT_MS, 12 s),
//   3. then wait until the overlay has not changed for QUIET ms (motion writes styles every frame while it plays),
//   capped at CAP ms for pages with a motion that never stops.
//   node tools/capture-thumbs.mjs http://localhost:5174/ [ids...]
// BROWSER=<path to msedge.exe or chrome.exe> overrides the browser.
import { mkdirSync, writeFileSync } from 'node:fs';
import { wait, withBrowser } from './browser.mjs';

const base = process.argv[2] ?? 'http://localhost:5174/';
const only = process.argv.slice(3);
const out = new URL('../public/thumbs/', import.meta.url);
mkdirSync(out, { recursive: true });

const ACT_MS = 12500;
const QUIET = 3000;
const CAP = 35000;
// the hidden browser draws the city in software and falls behind after a few long moves: a fresh one per group
const GROUP = 4;

/** in the page: watch the stage's DOM; resolves once the camera has settled, the act has run and nothing changed for QUIET ms */
const settleThenQuiet = (sky) => `(async () => {
  const { useSceneStore } = await import('/src/engine/store.ts');
  const t0 = performance.now();
  while (!useSceneStore.getState().settled && performance.now() - t0 < 20000) await new Promise((r) => setTimeout(r, 200));
  const settledAt = performance.now();
  let last = performance.now();
  const mo = new MutationObserver(() => { last = performance.now(); });
  mo.observe(document.getElementById('app'), { subtree: true, childList: true, attributes: true, characterData: true });
  const minEnd = settledAt + ${sky ? ACT_MS : 1500};
  while (performance.now() - settledAt < ${CAP}) {
    await new Promise((r) => setTimeout(r, 250));
    const now = performance.now();
    if (now >= minEnd && now - last >= ${QUIET}) break;
  }
  mo.disconnect();
  return Math.round((performance.now() - settledAt) / 100) / 10;
})()`;

const ids = only.length
  ? only
  : await withBrowser(async (page) => {
      await page.open(base, '0.1');
      return page.eval("(async () => (await import('/src/scenes/index.ts')).SCENES.map((s) => s.id))()");
    });

for (let g = 0; g < ids.length; g += GROUP) {
  const group = ids.slice(g, g + GROUP);
  await withBrowser(async (page) => {
    await page.open(base, group[0]);
    // pictures of the scene only: no buttons, script bar, counter, progress line or Jupyter handle
    await page.eval(`(() => { const s = document.createElement('style'); s.textContent = '.stepper,.script,.counter,.progress,.cam-edit,.jd{display:none!important}'; document.head.appendChild(s); return true; })()`);
    const shots = await page.eval("(async () => Object.fromEntries((await import('/src/scenes/index.ts')).SCENES.map((s) => [s.id, s.shot])))()");
    for (const id of group) {
      await page.go(id);
      await wait(300);
      const secs = await page.eval(settleThenQuiet(String(shots[id] ?? '').startsWith('sky')));
      writeFileSync(new URL(`${id}.jpg`, out), await page.shot(0.2, 78));
      console.log('preview', id, `(${secs}s after the camera arrived)`);
    }
  });
}
