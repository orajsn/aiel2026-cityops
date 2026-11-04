import { chapter0 } from '../../src/scenes/chapter0';
import { chapter1 } from '../../src/scenes/chapter1';
import { SCENES } from '../../src/scenes/index';
import { SHOTS } from '../../src/world/shots';
import { OVERLAYS } from '../../src/overlay/registry';
import { assetPosition } from '../../src/content/geo';
import { projectToScreen } from '../../src/world/frame';

test('the Introduction is only the city, then the bridge and its three labs (owner, 29 Oct)', () => {
  expect(chapter0.map((s) => s.id)).toEqual(['0.0', '0.1', '0.2', '0.7', '0.7a', '0.7b', '0.7c']);
  for (const s of chapter0) expect(s.chapter).toBe(0);
});

test('Lab 2 opens on the crack (the deck’s Story), and its old 0.x pages keep their ids (the saved camera angles are keyed by id)', () => {
  const ids = SCENES.map((s) => s.id);
  const first = ids.indexOf('0.4');
  // the 'Open the lab' page (0.4g, page 0 of Lab 2) comes just before the crack
  expect(ids[first - 1]).toBe('0.4g');
  expect(SCENES[first - 2].chapter).not.toBe(1);
  // (3 Nov: 0.4b, the route for today, is out of the selected deck, so the Story is two pages and Why follows)
  expect(ids.slice(first, first + 3)).toEqual(['0.4', '0.4a', '2.0']);
  for (const id of ['0.3', '0.5', '0.6']) expect(chapter1.find((s) => s.id === id)?.chapter).toBe(1);
});

test('every shot and overlay referenced by chapter 0 exists', () => {
  for (const s of chapter0) {
    expect(SHOTS[s.shot]).toBeDefined();
    if (s.enterFrom) expect(SHOTS[s.enterFrom]).toBeDefined();
    if (s.overlay) expect(OVERLAYS[s.overlay]).toBeDefined();
  }
});

test('Lab 2 pages are panels only: one held view, no sky stage, no camera move (owner, 29 Oct)', () => {
  // except one query, four lenses: the owner kept its database-in-the-sky sequence (29 Oct)
  const lab2 = chapter1.filter((s) => s.id !== '2.9' && !s.id.startsWith('2.6'));
  for (const s of lab2) {
    expect(s.shot).toBe('bridge');
    expect(s.world?.sky).toBeUndefined();
  }
  for (const s of chapter1.filter((s) => s.id.startsWith('2.6'))) expect(s.world?.sky).toBe('unified');
});

test('the recap subset is marked', () => {
  expect([...chapter0, ...chapter1].filter((s) => s.recapMode).map((s) => s.id)).toEqual(['0.1', '0.7', '0.5']);
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
  // the running number follows the show order: the bridge is the Introduction's page 3, the crack opens Lab 2
  expect(pageNumber('0.7')).toBe(3);
  expect(pageNumber('0.7c')).toBe(6);
  expect(pageNumber('0.4g')).toBe(0);
  expect(pageNumber('0.4')).toBe(1);
  // Lab 2 runs 1 to 37 (the selected deck): the workbench is 6, what the agent can see 8, is the model awake 10
  expect(pageNumber('2.1a')).toBe(5);
  expect(pageNumber('0.5')).toBe(6);
  expect(pageNumber('0.3')).toBe(8);
  expect(pageNumber('0.6')).toBe(10);
  expect(pageNumber('2.9')).toBe(37);
  expect(pageNumber('2.9')).toBe(SCENES.filter((s) => s.chapter === 1 && !s.pageZero).length);
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
