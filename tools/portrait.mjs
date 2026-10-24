// Render the Lab 3 cast portraits from the characters' own 3D models:
//   node tools/portrait.mjs http://localhost:5174 mercer:character-female-a vance:character-male-d
// Writes src/assets/portraits/<name>.png (transparent, 512 x 512; bundled by Vite, see chapter2.ts). One hidden browser.
import { mkdirSync, writeFileSync } from 'node:fs';
import { wait, withBrowser } from './browser.mjs';

const [, , base, ...items] = process.argv;
mkdirSync('src/assets/portraits', { recursive: true });
await withBrowser(async (page) => {
  for (const it of items) {
    const [name, who] = it.split(':');
    await page.send('Page.navigate', { url: `${base}/tools/portrait.html?who=${who}` });
    let png;
    for (let i = 0; i < 60 && !png; i++) {
      await wait(500);
      png = await page.eval('window.__portrait');
    }
    if (!png) throw new Error(`no portrait for ${who}`);
    writeFileSync(`src/assets/portraits/${name}.png`, Buffer.from(png.split(',')[1], 'base64'));
    console.log('portrait', name, who);
  }
});
