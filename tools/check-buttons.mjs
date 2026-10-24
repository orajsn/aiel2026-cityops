// Checks that nothing covers the bottom-right buttons (CC, pages, CAM, Back, Next) on any page, with the
// Jupyter drawer closed and open: node tools/check-buttons.mjs http://localhost:5174/ <ids...>
// Prints one line per page and exits 1 if any button is covered.
import { readFileSync } from 'node:fs';
import { wait, withBrowser } from './browser.mjs';

/** pages with a Jupyter stop (src/content/labStops.ts): wait for the handle there, then also check with the drawer open */
const STOPS = new Set([...readFileSync(new URL('../src/content/labStops.ts', import.meta.url), 'utf8').matchAll(/^\s*'(\d\.\d+[a-z]?)': /gm)].map((m) => m[1]));

const [, , base, ...ids] = process.argv;
if (!ids.length) throw new Error('give the page ids to check, e.g. 2.1 3.6');
const probe = `(() => {
  const bad = [];
  document.querySelectorAll('.stepper__btn').forEach((b) => {
    const r = b.getBoundingClientRect();
    const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    if (!(e === b || b.contains(e))) bad.push((b.getAttribute('aria-label') || '?') + ' under ' + (e ? e.tagName + '.' + String(e.className).slice(0, 50) : 'nothing'));
  });
  if (document.querySelectorAll('.stepper__btn').length !== 5) bad.push('expected 5 buttons, found ' + document.querySelectorAll('.stepper__btn').length);
  return bad.join(' | ');
})()`;

let failed = 0;
// the headless browser draws the city in software (2-5 fps) and falls behind after a few long camera moves,
// so each group of four pages gets a fresh browser
const GROUP = 4;
for (let g = 0; g < ids.length; g += GROUP) {
  const group = ids.slice(g, g + GROUP);
  await withBrowser(async (page) => {
    await page.open(base, group[0]);
    for (const id of group) {
      await page.go(id);
      // let the page settle; on a stop page the Jupyter handle appears once it has (give up after 25 s)
      await wait(5000);
      if (STOPS.has(id)) for (let t = 0; t < 40 && !(await page.eval("!!document.querySelector('.jd__tab')")); t++) await wait(500);
      await wait(1200);
      const closed = await page.eval(probe);
      const opened = (await page.eval(`(() => { const t = document.querySelector('.jd__tab'); if (!t) return false; t.click(); return true; })()`)) ? (await wait(900), await page.eval(probe)) : null;
      const missing = STOPS.has(id) && opened === null;
      const line = `${id}  closed: ${closed || 'ok'}${opened === null ? (missing ? '  drawer: handle never appeared' : '') : `  drawer open: ${opened || 'ok'}`}`;
      if (closed || opened || missing) failed++;
      console.log(line);
    }
  });
}
process.exit(failed ? 1 : 0);
