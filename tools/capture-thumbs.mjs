// Refresh the page-overview previews: public/thumbs/<scene id>.jpg (384 x 216).
// Needs the dev server running (npm run dev). Opens every page in one hidden browser (closed afterwards,
// process tree and all), waits for the camera to settle, hides the buttons and script bar, and saves a
// small picture of the 1920 x 1080 stage.
//   node tools/capture-thumbs.mjs [http://localhost:5173/] [ids...]
// BROWSER=<path to msedge.exe or chrome.exe> overrides the browser.
import { mkdirSync, writeFileSync } from 'node:fs';
import { wait, withBrowser } from './browser.mjs';

const base = process.argv[2] ?? 'http://localhost:5173/';
const only = process.argv.slice(3);
const out = new URL('../public/thumbs/', import.meta.url);
mkdirSync(out, { recursive: true });

await withBrowser(async (page) => {
  await page.open(base, '0.1');
  // pictures of the scene only: no buttons, script bar, counter or progress line
  await page.eval(`(() => { const s = document.createElement('style'); s.textContent = '.stepper,.script,.counter,.progress,.cam-edit{display:none!important}'; document.head.appendChild(s); return true; })()`);
  const ids = only.length ? only : await page.eval("(async () => (await import('/src/scenes/index.ts')).SCENES.map((s) => s.id))()");
  for (const id of ids) {
    await page.go(id);
    // inspection pages push in after the walk; long camera moves take up to ~5 s
    await wait(['0.4', '3.1a', '3.1b', '3.1c', '3.13', '3.14'].includes(id) ? 9000 : 6500);
    writeFileSync(new URL(`${id}.jpg`, out), await page.shot(0.2, 78));
    console.log('preview', id);
  }
});
