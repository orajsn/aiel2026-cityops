import { chapter0 } from '../../src/scenes/chapter0';
import { SCENES } from '../../src/scenes/index';
import { SHOTS } from '../../src/world/shots';
import { OVERLAYS } from '../../src/overlay/registry';
import { assetPosition } from '../../src/content/geo';
import { projectToScreen } from '../../src/world/frame';

test('chapter 0 scenes are 0.x, start at page zero (0.0) and end at 0.7', () => {
  expect(chapter0[0].id).toBe('0.0');
  expect(chapter0[1].id).toBe('0.1');
  expect(chapter0[chapter0.length - 1].id).toBe('0.7');
  for (const s of chapter0) {
    expect(s.id.startsWith('0.')).toBe(true);
    expect(s.chapter).toBe(0);
  }
});

test('every shot and overlay referenced by chapter 0 exists', () => {
  for (const s of chapter0) {
    expect(SHOTS[s.shot]).toBeDefined();
    if (s.enterFrom) expect(SHOTS[s.enterFrom]).toBeDefined();
    if (s.overlay) expect(OVERLAYS[s.overlay]).toBeDefined();
  }
});

test('the database is one page on the sky stage with all four shapes (owner: not split into four steps)', () => {
  expect(chapter0.filter((s) => s.id.startsWith('0.5')).map((s) => s.id)).toEqual(['0.5']);
  expect(chapter0.find((s) => s.id === '0.5')!.shot).toBe('sky');
  expect(chapter0.find((s) => s.id === '0.5')!.world?.sky).toBe('shapes');
  expect(chapter0.find((s) => s.id === '0.6')!.world?.sky).toBe('brain');
});

test('the recap subset is marked', () => {
  expect(chapter0.filter((s) => s.recapMode).map((s) => s.id)).toEqual(['0.1', '0.5', '0.7']);
});

test('SCENES starts with chapter 0, on page zero', () => {
  expect(SCENES[0].id).toBe('0.0');
});

test('page zero opens on the wide view over Bangkok, so Next flies down into page 1 (owner, 25 Oct)', () => {
  const zero = chapter0[0];
  expect(zero.pageZero).toBe(true);
  expect(zero.shot).toBe('city');
  expect(zero.overlay).toBeUndefined();
  // page 1 no longer cuts to a starting shot of its own: the move comes from page zero
  expect(chapter0[1].enterFrom).toBeUndefined();
});

test('0.3 frames the place the document flow lands, clear of the counters panel', () => {
  const s = chapter0.find((x) => x.id === '0.3')!;
  const shot = SHOTS[s.shot];
  const ops = assetPosition('City Operations Control Center');
  const p = projectToScreen(shot.position, shot.target, [ops.x, 1, ops.z]);
  expect(p.front).toBe(true);
  expect(p.x).toBeGreaterThan(-0.8);
  expect(p.x).toBeLessThan(0.4); // the counters panel covers the right fifth
  expect(Math.abs(p.y)).toBeLessThan(0.7);
  expect((s.world as { highlight?: string[] }).highlight).toContain('City Operations Control Center');
});

test('the model is never named on screen or in the script: it is the language model (owner)', async () => {
  const { SCRIPT } = await import('../../src/scenes/script');
  expect(JSON.stringify(SCENES)).not.toMatch(/\bllama/i);
  expect(JSON.stringify(SCRIPT)).not.toMatch(/\bllama/i);
});

test('pages are numbered 1, 2, 3 inside each part (Introduction, Lab 2, Lab 3), not by chapter code; page zero is 0', async () => {
  const { pageNumber } = await import('../../src/scenes/index');
  for (const c of [0, 1, 2]) {
    const pages = SCENES.filter((s) => s.chapter === c && !s.pageZero);
    expect(pages.map((s) => pageNumber(s.id))).toEqual(pages.map((_, i) => i + 1));
  }
  expect(pageNumber('0.0')).toBe(0);
  expect(pageNumber('0.1')).toBe(1);
});
