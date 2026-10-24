// Full-size captures of pages for review: node tools/capture-pages.mjs <out dir> <base url> 1.4:3000,6000 1.5:5000 ...
// Each item is a scene id and the times (ms after jumping to it) to capture at.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { wait, withBrowser } from './browser.mjs';

const [, , out, base, ...items] = process.argv;
mkdirSync(out, { recursive: true });
await withBrowser(async (page) => {
  await page.open(base, items[0].split(':')[0]);
  for (const it of items) {
    const [id, times = '5000'] = it.split(':');
    await page.go(id);
    const t0 = Date.now();
    for (const ms of times.split(',').map(Number)) {
      await wait(Math.max(0, ms - (Date.now() - t0)));
      writeFileSync(join(out, `${id}@${ms}.jpg`), await page.shot());
    }
    console.log('captured', id);
  }
});
