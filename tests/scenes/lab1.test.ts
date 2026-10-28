import { buildScenes } from '../../src/scenes/index';
import { lab1, LAB1_SCRIPT, LAB1_SECTIONS } from '../../src/scenes/lab1';
import { chapter0 } from '../../src/scenes/chapter0';
import { chapter1 } from '../../src/scenes/chapter1';
import { chapter2 } from '../../src/scenes/chapter2';
import { SHOTS } from '../../src/world/shots';

// owner, 29 Oct: Lab 1 goes in before Lab 2, and must be easy to take out again with Lab 2 and Lab 3 untouched
test('without Lab 1 the show is exactly the Introduction, Lab 2 and Lab 3, as before', () => {
  const ids = buildScenes(false).map((s) => s.id);
  expect(ids).toEqual([...chapter0, ...chapter1, ...chapter2].map((s) => s.id));
  expect(ids.some((id) => id.startsWith('1.'))).toBe(false);
});

test('with Lab 1, its pages sit between the Introduction and Lab 2, and nothing else moves', () => {
  const ids = buildScenes(true).map((s) => s.id);
  const without = buildScenes(false).map((s) => s.id);
  expect(ids.slice(0, chapter0.length)).toEqual(without.slice(0, chapter0.length));
  expect(ids.slice(chapter0.length, chapter0.length + lab1.length)).toEqual(lab1.map((s) => s.id));
  expect(ids.slice(chapter0.length + lab1.length)).toEqual(without.slice(chapter0.length));
});

test('Lab 1 pages: ids 1.x, part 3, at the whole-bridge view where the Introduction ends, each with a script line', () => {
  for (const s of lab1) {
    expect(s.id).toMatch(/^1\.\d$/);
    expect(s.chapter).toBe(3);
    expect(s.shot).toBe(chapter0[chapter0.length - 1].shot);
    expect(SHOTS[s.shot]).toBeDefined();
    expect(LAB1_SCRIPT[s.id]?.length).toBeGreaterThan(40);
  }
  expect(LAB1_SECTIONS.flatMap((sec) => sec.pages)).toEqual(lab1.map((s) => s.id));
});

test('Lab 1 names its exercises Hands-on 1 to 5, never Lab 2 or Lab 3, and never a model by name', () => {
  const text = JSON.stringify([lab1, LAB1_SCRIPT]);
  expect(text).not.toMatch(/Lab [23]\b/);
  expect(text).not.toMatch(/fictional|Kirkland|\bMEA\b|\bMWA\b|\bBMA\b|GPT|Llama|Gemini|Claude|Cohere/i);
});
