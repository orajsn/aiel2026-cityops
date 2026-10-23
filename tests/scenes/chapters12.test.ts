import { chapter1 } from '../../src/scenes/chapter1';
import { chapter2 } from '../../src/scenes/chapter2';
import { SCENES } from '../../src/scenes/index';
import { SHOTS } from '../../src/world/shots';
import { OVERLAYS } from '../../src/overlay/registry';

// one story beat per Storyboard row (doc tab "Storyboard"), in order
const CH1_BEATS = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9'];
const CH2_BEATS = ['2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10', '2.11', '2.12', '2.13', '2.14', '2.15', '2.16', '2.17'];

const beats = (ch: typeof chapter1) => ch.map((s) => s.id);

test('chapter 1 and 2 beats follow the storyboard rows exactly', () => {
  expect(beats(chapter1)).toEqual(CH1_BEATS);
  expect(beats(chapter2)).toEqual(CH2_BEATS);
});

test('no hand-off cards anywhere: one click per story beat', () => {
  expect(SCENES.filter((s) => s.card)).toHaveLength(0);
});

test('every shot and overlay referenced by chapters 1 and 2 exists', () => {
  for (const s of [...chapter1, ...chapter2]) {
    expect(SHOTS[s.shot]).toBeDefined();
    if (s.overlay) expect(OVERLAYS[s.overlay]).toBeDefined();
  }
});

test('incident beats carry the fictional scenario tag', () => {
  for (const id of ['1.7', '2.13', '2.14']) {
    const s = [...chapter1, ...chapter2].find((x) => x.id === id)!;
    expect((s.overlayProps as { tag?: string }).tag).toBe('fictional scenario');
  }
});

test('SCENES runs chapter 0, then 1, then 2', () => {
  const chapters = SCENES.map((s) => s.chapter);
  expect(chapters).toEqual([...chapters].sort());
  expect(SCENES.length).toBe(11 + 9 + 18);
});

test('no banned names anywhere in the copy', () => {
  const text = JSON.stringify([...chapter1, ...chapter2]);
  for (const w of ['Kirkland', 'MEA', 'MWA', 'BMA', 'One city. One database. Two labs.']) expect(text).not.toContain(w);
});

test('every scene has a presenter script', () => {
  for (const s of SCENES) expect(s.script?.length ?? 0, s.id).toBeGreaterThan(40);
});
