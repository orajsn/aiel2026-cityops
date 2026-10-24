// Checks that nothing covers the bottom-right buttons (CC, pages, CAM, Back, Next) on any page, with the
// Jupyter drawer closed and open: node tools/check-buttons.mjs http://localhost:5174/ <ids...>
// Prints one line per page and exits 1 if any button is covered.
import { wait, withBrowser } from './browser.mjs';

const [, , base, ...ids] = process.argv;
if (!ids.length) throw new Error('give the page ids to check, e.g. 2.1 3.6');
const probe = `(() => {
  const bad = [];
  document.querySelectorAll('.stepper__btn').forEach((b) => {
    const r = b.getBoundingClientRect();
    const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    if (!(e === b || b.contains(e))) bad.push((b.getAttribute('aria-label') || '?') + ' under ' + (e ? e.tagName + '.' + String(e.className).slice(0, 50) : 'nothing'));
  });
  return bad.join(' | ');
})()`;

let failed = 0;
await withBrowser(async (page) => {
  await page.open(base, ids[0]);
  for (const id of ids) {
    await page.go(id);
    // let the page settle: on a stop page the Jupyter handle appears once it has (give up after 20 s)
    await wait(4000);
    for (let t = 0; t < 32 && !(await page.eval("!!document.querySelector('.jd__tab') || !!document.querySelector('.overlay-layer')")); t++) await wait(500);
    await wait(1500);
    const closed = await page.eval(probe);
    const opened = (await page.eval(`(() => { const t = document.querySelector('.jd__tab'); if (!t) return false; t.click(); return true; })()`)) ? (await wait(900), await page.eval(probe)) : null;
    const line = `${id}  closed: ${closed || 'ok'}${opened === null ? '' : `  drawer open: ${opened || 'ok'}`}`;
    if (closed || opened) failed++;
    console.log(line);
  }
});
process.exit(failed ? 1 : 0);
