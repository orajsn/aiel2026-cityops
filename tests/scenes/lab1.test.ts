import { buildScenes } from '../../src/scenes/index';
import { lab1, LAB1_SCRIPT, LAB1_SECTIONS } from '../../src/scenes/lab1';
import { chapter0, lab2Opening } from '../../src/scenes/chapter0';
import { chapter1 } from '../../src/scenes/chapter1';
import { chapter2 } from '../../src/scenes/chapter2';
import { SHOTS } from '../../src/world/shots';
import { OVERLAYS } from '../../src/overlay/registry';

// owner, 29 Oct: Lab 1 goes in before Lab 2, and must be easy to take out again with Lab 2 and Lab 3 untouched
test('without Lab 1 the show is exactly the Introduction, Lab 2 (opening on the data pages) and Lab 3', () => {
  const ids = buildScenes(false).map((s) => s.id);
  expect(ids).toEqual([...chapter0, ...lab2Opening, ...chapter1, ...chapter2].map((s) => s.id));
  // the Introduction ends on the bridge, then Lab 2 starts with the data stream
  expect(ids.slice(chapter0.length - 1, chapter0.length + 1)).toEqual(['0.7c', '0.3']);
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
    expect(s.id).toMatch(/^1\.\d+a?$/);
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

// owner, 29 Oct (V2 from the real workshop guide): two new pages, Meet the app and Two ways to launch
test('Lab 1 runs in the V2 order, all at the bridge, each page with its own registered panel', () => {
  expect(lab1.map((s) => s.id)).toEqual(['1.0', '1.1', '1.2', '1.3', '1.3a', '1.4', '1.5', '1.6a', '1.6', '1.7', '1.8', '1.9']);
  expect(lab1.map((s) => s.overlay)).toEqual(['L1Opening', 'L1Damage', 'L1Scattered', 'L1Assistant', 'L1App', 'L1Specs', 'L1Suppliers', 'L1Launch', 'L1SitePhoto', 'L1Baseline', 'L1Routing', 'L1Guardrails']);
  expect(new Set(lab1.map((s) => s.shot))).toEqual(new Set(['bridge']));
  for (const s of lab1) expect(OVERLAYS[s.overlay!]).toBeDefined();
});

test('Lab 1 never shows a price or claims a measured saving, and talks about suppliers', () => {
  const text = JSON.stringify([lab1, LAB1_SCRIPT]);
  expect(text).not.toMatch(/\$\s*\d|\d\s*%|contractor/i);
});
