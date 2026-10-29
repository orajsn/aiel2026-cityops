import { chapter1, LAB2_CHAPTERS } from '../../src/scenes/chapter1';
import { LAB2_FOCUS } from '../../src/content/lab2Focus';
import { SECTIONS } from '../../src/scenes/sections';
import { chapter2 } from '../../src/scenes/chapter2';
import { SCENES } from '../../src/scenes/index';
import { PARTS } from '../../src/scenes/sections';
import { WITH_LAB1, lab1 } from '../../src/scenes/lab1';
import { SHOTS } from '../../src/world/shots';
import { OVERLAYS } from '../../src/overlay/registry';

// Lab 2 follows the Harbor Bridge deck (owner, 29 Oct): eleven chapters, then the recap
const CH1_BEATS = [
  '0.4', '0.4a', '0.4b', // Story
  '2.0', '2.0a', '2.1', '2.1a', // Why
  '0.5', '0.5a', '0.3', '0.3a', '0.6', // §0 Setup
  '2.2', '2.2a', '2.2b', '2.2c', '2.2d', '2.3', '2.3a', '2.3b', '2.4', '2.4a', '2.4b', // §1 RAG
  '2.4c', '2.4d', '2.4e', '2.4f', '2.4g', '2.4h', // §2 Workflow
  '2.4i', '2.4j', '2.4k', '2.4l', // Agent
  '2.5', '2.5a', '2.5b', '2.5c', '2.5d', // §3 Tools
  '2.6', '2.6a', '2.6b', '2.6c', // §4 Query
  '2.7', '2.7a', '2.7b', '2.7c', '2.7d', '2.7e', '2.7f', '2.7g', '2.7h', '2.8', // §5 Agent
  '2.8a', '2.8b', '2.8c', '2.8d', '2.8e', // Trust
  '2.8f', // §6 Wrap
  '2.9', // the recap
];
const CH2_BEATS = ['3.0', '3.1a', '3.1b', '3.1c', '3.2a', '3.2b', '3.2p', '3.2q', '3.2r', '3.2c', '3.2e', '3.3a', '3.3b', '3.4a', '3.4b', '3.4c', '3.4d', '3.5b', '3.6', '3.7', '3.8a', '3.8b', '3.9', '3.10', '3.11', '3.12a', '3.12b', '3.13', '3.13a', '3.14', '3.14a', '3.15', '3.15b', '3.15c', '3.16', '3.16a', '3.17', '3.18'];

const beats = (ch: typeof chapter1) => ch.map((s) => s.id);

test('Lab 2 follows the deck chapter by chapter, Lab 3 the storyboard rows', () => {
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

test('SCENES runs the parts in show order: Introduction, Lab 1 (when in the show), Lab 2, Lab 3', () => {
  const order = PARTS.map((c) => SCENES.filter((s) => s.chapter === c).map((s) => s.id)).flat();
  expect(SCENES.map((s) => s.id)).toEqual(order);
  // Introduction 7 (the city, then the bridge's four clicks); Lab 2 the deck's 58 pages and the recap
  expect(SCENES.length).toBe(7 + (WITH_LAB1 ? lab1.length : 0) + CH1_BEATS.length + 38);
  expect(CH1_BEATS).toHaveLength(59);
});

test('no banned names anywhere in the copy', () => {
  const text = JSON.stringify([...chapter1, ...chapter2]);
  for (const w of ['Kirkland', 'MEA', 'MWA', 'BMA', 'One city. One database. Two labs.']) expect(text).not.toContain(w);
});

test('every scene has a presenter script', () => {
  for (const s of SCENES) expect(s.script?.length ?? 0, s.id).toBeGreaterThan(40);
});

test('Lab 2: the jump menu has the deck’s chapters in order, and one panel per group stays at one place', () => {
  expect(LAB2_CHAPTERS.map((c) => c.name)).toEqual([
    'Story · one crack', 'Why AI needs your data', 'The workbench', 'RAG: the filing cabinet', 'Workflow: the fixed checklist',
    'Agent: the chief inspector', 'Tools, skills, MCP', 'One query, four lenses', 'Build the agent', 'Trust: security and observability', 'Wrap-up', 'Closing Lab 2',
  ]);
  expect(SECTIONS.filter((s) => s.chapter === 1).flatMap((s) => s.pages)).toEqual(CH1_BEATS);
  const groups = new Map<string, typeof chapter1>();
  for (const s of chapter1) if (s.overlayGroup) groups.set(s.overlayGroup, [...(groups.get(s.overlayGroup) ?? []), s]);
  for (const [g, pages] of groups) {
    expect(new Set(pages.map((p) => p.shot)).size, g).toBe(1);
    expect(new Set(pages.map((p) => p.overlay)).size, g).toBe(1);
    // the steps build in order, 1, 2, 3
    expect(pages.map((p) => (p.overlayProps as { step: number }).step), g).toEqual(pages.map((_, i) => i + 1));
    // in a row in the show
    const at = chapter1.indexOf(pages[0]);
    expect(chapter1.slice(at, at + pages.length), g).toEqual(pages);
  }
});

test('Lab 2: every page has a takeaway, each chapter ends on a "Next in the notebook" band (but the recap)', () => {
  // 2.6a is the sky stage's own small caption (UnifiedQuery), not a Lab 2 panel
  for (const s of chapter1.filter((x) => x.id !== '2.9' && x.id !== '2.6a')) expect((s.overlayProps as { takeaway?: string }).takeaway?.length, s.id).toBeGreaterThan(20);
  for (const c of LAB2_CHAPTERS.slice(0, -1)) {
    const last = c.pages[c.pages.length - 1];
    expect((last.overlayProps as { next?: string }).next, last.id).toMatch(/^\S/);
  }
});

test('Lab 2: notebook pages name their cells, and each has its focus steps in the drawer', () => {
  for (const s of chapter1) {
    const nb = (s.overlayProps as { notebook?: string }).notebook;
    if (nb && /cells? \d/.test(nb) && !['2.4e', '2.7g'].includes(s.id)) expect(LAB2_FOCUS[s.id]?.length, s.id).toBeGreaterThan(0);
  }
  for (const id of Object.keys(LAB2_FOCUS)) expect(chapter1.some((s) => s.id === id), id).toBe(true);
});

test('Lab 2: no pier numbers, no model names, no "Ollama" on screen or in the script', async () => {
  const { SCRIPT } = await import('../../src/scenes/script');
  // the words on screen and in the script (the recap's place, pier2, is a camera name, not on screen)
  const text = JSON.stringify([chapter1.map((s) => [s.title, s.overlayProps]), CH1_BEATS.map((id) => SCRIPT[id])]);
  expect(text).not.toMatch(/\bpier\s*\d/i);
  expect(text).not.toMatch(/llama|ollama/i);
  expect(text).not.toMatch(/copilot|Kirkland|fictional/i);
});

test('Lab 2: the camera only uses the existing places; steps after a saved angle hold it', () => {
  for (const s of chapter1) expect(['bridge', 'sky', 'sky-model', 'city', 'ops', 'pier2'], s.id).toContain(s.shot);
  for (const s of chapter1.filter((x) => x.sameAngleAs)) {
    const lead = chapter1.find((x) => x.id === s.sameAngleAs)!;
    expect(lead.shot, s.id).toBe(s.shot);
  }
});
