// @ts-expect-error node:fs has no type declarations here (vitest runs in node)
import { readFileSync, readdirSync } from 'node:fs';

/** every file under src, recursively */
function files(dir: string): string[] {
  return (readdirSync(dir, { withFileTypes: true }) as { name: string; isDirectory(): boolean }[]).flatMap((d) => (d.isDirectory() ? files(`${dir}/${d.name}`) : [`${dir}/${d.name}`]));
}

test('the bottom-right buttons sit above every other layer, so no page, label or drawer can cover them (iPad)', () => {
  const css: string = readFileSync('src/styles.css', 'utf8');
  const stepper = Number(css.match(/\n\.stepper \{[^}]*z-index: (\d+)/)?.[1] ?? 0);
  const others: number[] = [];
  for (const m of css.matchAll(/\n([^\n{]+)\{[^}]*z-index: (\d+)/g)) if (!/^\.stepper\b/.test(m[1].trim())) others.push(Number(m[2]));
  for (const f of files('src').filter((p) => /\.tsx?$/.test(p))) {
    const src: string = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/zIndex: (\d+)/g)) others.push(Number(m[1]));
    for (const m of src.matchAll(/zIndexRange=\{\[(\d+)/g)) others.push(Number(m[1]));
  }
  expect(others.length).toBeGreaterThan(5);
  expect(stepper).toBeGreaterThan(Math.max(...others));
});
