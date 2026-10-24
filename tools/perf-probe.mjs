// Walks pages in a hidden browser and prints the renderer's geometry/texture counts, heap and fps after each:
// node tools/perf-probe.mjs <base url> id,id,... [ms per page]  — counts must not climb on repeat visits.
import { wait, withBrowser } from './browser.mjs';

const [, , base, list, msArg] = process.argv;
const ids = list.split(',');
const ms = Number(msArg ?? 5000);
await withBrowser(async (page) => {
  await page.open(base, ids[0]);
  await page.eval("window.__snap = () => { const gl = window.__r3f.get().gl; return { geo: gl.info.memory.geometries, tex: gl.info.memory.textures, heap: Math.round(performance.memory.usedJSHeapSize / 1048576), frame: gl.info.render.frame, t: performance.now() }; }; true");
  let prev = await page.eval('window.__snap()');
  for (const id of ids) {
    await page.go(id);
    await wait(ms);
    const s = await page.eval('window.__snap()');
    console.log(id.padEnd(5), 'geo', s.geo, 'tex', s.tex, 'heap', s.heap + 'MB', 'fps', Math.round((s.frame - prev.frame) / ((s.t - prev.t) / 1000)));
    prev = s;
  }
});
