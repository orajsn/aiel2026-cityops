import { chapter1 } from '../../src/scenes/chapter1';
import { chapter2 } from '../../src/scenes/chapter2';
import { SCENES } from '../../src/scenes/index';
import { SHOTS } from '../../src/world/shots';
import { OVERLAYS } from '../../src/overlay/registry';

// one story beat per Storyboard row (doc tab "Storyboard"), in order
const CH1_BEATS = ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9'];
const CH2_BEATS = ['3.0', '3.1a', '3.1b', '3.1c', '3.2a', '3.2b', '3.2p', '3.2c', '3.2e', '3.3a', '3.3b', '3.4a', '3.4b', '3.4c', '3.4d', '3.5b', '3.6', '3.7', '3.8a', '3.8b', '3.9', '3.10', '3.11', '3.12a', '3.12b', '3.13', '3.14', '3.15', '3.15b', '3.15c', '3.16', '3.17'];

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

test('no page says "fictional scenario" (owner: everyone already knows)', () => {
  expect(JSON.stringify(SCENES)).not.toMatch(/fictional/i);
});

test('SCENES runs chapter 0, then 1, then 2', () => {
  const chapters = SCENES.map((s) => s.chapter);
  expect(chapters).toEqual([...chapters].sort());
  expect(SCENES.length).toBe(8 + 9 + 32);
});

test('no banned names anywhere in the copy', () => {
  const text = JSON.stringify([...chapter1, ...chapter2]);
  for (const w of ['Kirkland', 'MEA', 'MWA', 'BMA', 'One city. One database. Two labs.']) expect(text).not.toContain(w);
});

test('every scene has a presenter script', () => {
  for (const s of SCENES) expect(s.script?.length ?? 0, s.id).toBeGreaterThan(40);
});
