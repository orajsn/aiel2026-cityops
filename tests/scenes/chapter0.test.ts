import { chapter0 } from '../../src/scenes/chapter0';
import { SCENES } from '../../src/scenes/index';
import { SHOTS } from '../../src/world/shots';
import { OVERLAYS } from '../../src/overlay/registry';

test('chapter 0 scenes are 0.x, start at 0.1 and end at 0.7', () => {
  expect(chapter0[0].id).toBe('0.1');
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

test('the core dive has four face sub-scenes', () => {
  const faces = chapter0.filter((s) => s.id.startsWith('0.5') && s.id !== '0.5').map((s) => s.world?.core);
  expect(faces).toEqual(['tables', 'json', 'graph', 'vectors']);
});

test('the recap subset is marked', () => {
  expect(chapter0.filter((s) => s.recapMode).map((s) => s.id)).toEqual(['0.1', '0.5', '0.7']);
});

test('SCENES starts with chapter 0', () => {
  expect(SCENES[0].id).toBe('0.1');
});
