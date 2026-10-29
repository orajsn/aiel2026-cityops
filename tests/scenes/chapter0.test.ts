import { chapter0, lab2Opening } from '../../src/scenes/chapter0';
import { SCENES } from '../../src/scenes/index';
import { SHOTS } from '../../src/world/shots';
import { OVERLAYS } from '../../src/overlay/registry';
import { assetPosition } from '../../src/content/geo';
import { projectToScreen } from '../../src/world/frame';

test('the Introduction is only the city, then the bridge and its three labs (owner, 29 Oct)', () => {
  expect(chapter0.map((s) => s.id)).toEqual(['0.0', '0.1', '0.2', '0.7', '0.7a', '0.7b', '0.7c']);
  for (const s of chapter0) expect(s.chapter).toBe(0);
});

test('the data pages open Lab 2, in their old order, keeping their ids (the saved camera angles are keyed by id)', () => {
  expect(lab2Opening.map((s) => s.id)).toEqual(['0.3', '0.4', '0.5', '0.6']);
  for (const s of lab2Opening) expect(s.chapter).toBe(1);
  const ids = SCENES.map((s) => s.id);
  expect(ids.slice(ids.indexOf('0.3'), ids.indexOf('0.3') + 5)).toEqual(['0.3', '0.4', '0.5', '0.6', '2.1']);
});

test('every shot and overlay referenced by chapter 0 exists', () => {
  for (const s of [...chapter0, ...lab2Opening]) {
    expect(SHOTS[s.shot]).toBeDefined();
    if (s.enterFrom) expect(SHOTS[s.enterFrom]).toBeDefined();
    if (s.overlay) expect(OVERLAYS[s.overlay]).toBeDefined();
  }
});

test('the database is one page on the sky stage with all four shapes (owner: not split into four steps)', () => {
  expect(lab2Opening.filter((s) => s.id.startsWith('0.5')).map((s) => s.id)).toEqual(['0.5']);
  expect(lab2Opening.find((s) => s.id === '0.5')!.shot).toBe('sky');
  expect(lab2Opening.find((s) => s.id === '0.5')!.world?.sky).toBe('shapes');
  expect(lab2Opening.find((s) => s.id === '0.6')!.world?.sky).toBe('brain');
});

test('the recap subset is marked', () => {
  expect([...chapter0, ...lab2Opening].filter((s) => s.recapMode).map((s) => s.id)).toEqual(['0.1', '0.7', '0.5']);
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
  const s = lab2Opening.find((x) => x.id === '0.3')!;
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
  // the running number follows the show order: the bridge is the Introduction's page 3, the data stream opens Lab 2
  expect(pageNumber('0.7')).toBe(3);
  expect(pageNumber('0.7c')).toBe(6);
  expect(pageNumber('0.3')).toBe(1);
  expect(pageNumber('0.6')).toBe(4);
  expect(pageNumber('2.1')).toBe(5);
});

test('0.7 is one panel across four clicks at the bridge: three cards, then each lab opens in turn', () => {
  const pages = chapter0.filter((s) => s.id.startsWith('0.7'));
  expect(pages.map((s) => (s.overlayProps as { step: number }).step)).toEqual([0, 1, 2, 3]);
  expect(new Set(pages.map((s) => s.overlayGroup)).size).toBe(1);
  expect(new Set(pages.map((s) => s.shot))).toEqual(new Set(['bridge']));
  for (const s of pages) expect(s.overlay).toBe('ThreeLabs');
  // no incident markers in 3D: the crack in the panel is the one red thing
  for (const s of pages) expect((s.world as { markers?: unknown }).markers).toBeUndefined();
});
