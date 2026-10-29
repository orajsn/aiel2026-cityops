import { FIGURES, LAB1_HANDS_ON, SEER_GUIDE, figureUrl, handsOnPart, handsOnTitle, handsOnTaskCount } from '../../src/content/lab1HandsOn';
import { buildScenes } from '../../src/scenes';
import raw from '../../src/content/seerGuide.json';

const steps = (id: string, route: '3a' | '3b') => handsOnPart(LAB1_HANDS_ON[id], route).tasks.reduce((n, t) => n + t.steps.length, 0);
const lab = (id: string) => SEER_GUIDE.find((l) => l.id === id)!;
const labSteps = (id: string, tasks?: number[]) => lab(id).tasks.filter((_, i) => !tasks || tasks.includes(i + 1)).reduce((n, t) => n + t.steps.length, 0);

test('the whole guide is there: 8 labs, 163 steps, 47 figures', () => {
  expect(SEER_GUIDE.map((l) => l.id)).toEqual(['lab1', 'lab2', 'lab3a', 'lab3b', 'lab4-3a', 'lab4-3b', 'lab5-3a', 'lab5-3b']);
  expect(SEER_GUIDE.reduce((n, l) => n + l.tasks.reduce((m, t) => m + t.steps.length, 0), 0)).toBe(163);
  expect(Object.keys(FIGURES)).toHaveLength(47);
  expect(SEER_GUIDE).toEqual(raw);
});

test('every page shows its part of the guide, step for step', () => {
  expect(Object.keys(LAB1_HANDS_ON).sort()).toEqual(['1.3a', '1.4', '1.5', '1.6', '1.6a', '1.7', '1.8', '1.9']);
  for (const r of ['3a', '3b'] as const) {
    expect(steps('1.3a', r)).toBe(labSteps('lab1', [1]));
    expect(steps('1.4', r)).toBe(labSteps('lab1', [2, 3, 4, 5]));
    expect(steps('1.5', r)).toBe(labSteps('lab2'));
  }
  expect(steps('1.6a', '3a')).toBe(labSteps('lab3a', [1, 2, 3, 4, 5, 6]));
  expect(steps('1.6a', '3b')).toBe(labSteps('lab3b', [1, 2, 3, 4]));
  expect(steps('1.6', '3a')).toBe(labSteps('lab3a', [7, 8, 9]));
  expect(steps('1.6', '3b')).toBe(labSteps('lab3b', [5]));
  expect(steps('1.7', '3a')).toBe(labSteps('lab4-3a', [1]));
  expect(steps('1.7', '3b')).toBe(labSteps('lab4-3b', [1]));
  expect(steps('1.8', '3a')).toBe(labSteps('lab4-3a', [2, 3, 4]));
  expect(steps('1.8', '3b')).toBe(labSteps('lab4-3b', [2, 3, 4]));
  expect(steps('1.9', '3a')).toBe(labSteps('lab5-3a'));
  expect(steps('1.9', '3b')).toBe(labSteps('lab5-3b'));
  // every task of every lab is on exactly one page of its path
  const seen = new Set<string>();
  for (const e of Object.values(LAB1_HANDS_ON)) for (const r of ['3a', '3b'] as const) for (const t of handsOnPart(e, r).tasks) seen.add(t.id);
  expect(seen.size).toBe(SEER_GUIDE.reduce((n, l) => n + l.tasks.length, 0));
  expect(handsOnTaskCount('1.6a', '3a')).toBe(6);
  expect(handsOnTaskCount('1.6a', '3b')).toBe(4);
  expect(handsOnTaskCount('1.0')).toBe(0);
});

test('every referenced screenshot exists and is bundled', () => {
  const refs = SEER_GUIDE.flatMap((l) => l.tasks.flatMap((t) => t.steps.flatMap((s) => s.images)));
  expect(new Set(refs).size).toBe(47);
  const files = Object.keys(import.meta.glob('../../src/assets/seer/*.webp')).map((k) => k.split('/').pop());
  expect(files).toHaveLength(47);
  for (const id of refs) {
    expect(FIGURES[id], id).toBeTruthy();
    expect(figureUrl(id), id).toBeTruthy();
    expect(files, id).toContain(FIGURES[id].file);
  }
});

test('headings say Hands-on, with the guide title', () => {
  expect(handsOnTitle(LAB1_HANDS_ON['1.4'], lab('lab1'))).toBe('Hands-on 1 · Unstructured RAG');
  expect(handsOnTitle(LAB1_HANDS_ON['1.5'], lab('lab2'))).toBe('Hands-on 2 · Semantic Store');
  expect(handsOnTitle(LAB1_HANDS_ON['1.6a'], lab('lab3b'))).toBe('Hands-on 3 · Launch the Sample Application');
  expect(handsOnTitle(LAB1_HANDS_ON['1.9'], lab('lab5-3a'))).toBe('Hands-on 5 · Security Guardrails (3A Build)');
});

test('no "copilot", no model or vendor names, no banned names', () => {
  const all = JSON.stringify(SEER_GUIDE) + JSON.stringify(LAB1_HANDS_ON);
  expect(all).not.toMatch(/copilot/i);
  expect(all).not.toMatch(/\b(gpt|openai|llama|cohere|gemini|grok|claude|anthropic|mistral|xai)\b/i);
  expect(all).not.toMatch(/Kirkland|\bMEA\b|\bMWA\b|\bBMA\b|fictional/i);
});

test('with Lab 1 out of the show, no page has a hands-on drawer', () => {
  const ids = buildScenes(false).map((s) => s.id);
  expect(ids.filter((id) => id in LAB1_HANDS_ON)).toEqual([]);
});
