import type { SceneDef } from '../engine/types';
import { beat } from './chapter1';

/**
 * Chapter 2 · Agent Memory (Lab 3, notebook_student_ollama.ipynb). Rough pass: one scene per Storyboard row,
 * copy from the Storyboard tab. No hand-off cards (owner's call).
 */

const HB = 'Harbor Bridge';
const NB = 'notebook_student_ollama.ipynb';
const FICTION = 'fictional scenario' as const;

const b20 = beat(2, '2.0', 'Recap: the city', 'bridge-overview', {
  kicker: 'Lab 3 · three-minute recap',
  visual: { kind: 'list', items: ['The city (0.1)', 'The database (0.5)', 'The hero asset: Harbor Bridge (0.7)'] },
  message: 'Same city, same database, same bridge. Now, memory.',
}, { pins: 'all', graph: HB, bridge: true, markers: true });

const b21 = beat(2, '2.1', 'The agent that forgets', 'bridge-pier2', {
  kicker: 'No memory',
  visual: {
    kind: 'chat',
    lines: [
      { who: 'Day 1 · Evelyn_H_Mercer', text: 'Tells the copilot about Pier 2.', tone: 'teal' },
      { who: 'Day 5 · Jordan_Vance', text: 'Asks about Pier 2.', tone: 'teal' },
      { who: 'copilot', text: 'A generic answer. Memory: empty.', tone: 'grey' },
    ],
  },
  message: 'Every session is a first date.',
  notebook: `${NB} · motivation for Part 3 and the Day N cell`,
}, { bridge: true });

const b22 = beat(2, '2.2', 'The memory map', 'memory-room', {
  kicker: 'Kinds of memory',
  visual: {
    kind: 'cards',
    cols: 3,
    items: [
      { title: 'Short-term (the desk)', sub: 'context window · session · working memory · semantic cache', tone: 'grey' },
      { title: 'Long-term (the shelves)', sub: 'procedural · episodic · semantic', tone: 'teal' },
      { title: 'Shared shelf', sub: 'what every inspector can read', tone: 'teal' },
    ],
  },
  message: 'Several kinds of memory, doing different jobs, in one store.',
  notebook: 'CITY_MEMORY holds fact, preference, guideline and memory records',
}, { pins: 'all' });

const b23 = beat(2, '2.3', 'The glass', 'memory-room', {
  kicker: 'The context window',
  visual: { kind: 'list', items: ['Overflow', 'Noise', 'The lost “size 9” detail', 'The right fact at the wrong turn'] },
  message: 'The context window is the model’s whole world, and it is a curation problem.',
  notebook: 'the Part 6 context card is the cure',
}, { pins: 'all' });

const b24 = beat(2, '2.4', 'Three dials', 'memory-room', {
  kicker: 'What flows into the glass',
  visual: { kind: 'cards', cols: 3, items: [{ title: 'Memory engineering' }, { title: 'Context engineering' }, { title: 'Harness engineering' }] },
  message: 'Three disciplines, one job: the right tokens in, the wrong ones out.',
}, { pins: 'all' });

const b25 = beat(2, '2.5', 'The loop with memory', 'ops-center', {
  kicker: 'Read, act, write',
  visual: { kind: 'flow', steps: ['Read memory at the start of the turn', 'The Lab 2 loop: model ↔ tools', 'Write memory at the end of the turn', 'The database under it'], loop: true, hot: [0, 2] },
  message: 'One store, one memory manager, any harness.',
  notebook: `${NB} · Part 1, TODO 1`,
}, { pins: 'all', highlight: ['City Operations Control Center'] });

const b26 = beat(2, '2.6', 'One connection', 'ops-center', {
  kicker: 'The copilot plugs into the database',
  visual: { kind: 'cards', cols: 2, items: [{ title: 'Copilot', sub: 'one connection' }, { title: 'ALL_MINILM_L12_V2', sub: 'still there from this afternoon' }] },
  message: 'Same 384 numbers as this afternoon, computed inside the database, no API key.',
  notebook: `${NB} · TODO 2 (report_event), peek_sdk_tables`,
}, { pins: 'all', highlight: ['City Operations Control Center'] });

const b27 = beat(2, '2.7', 'The write path', 'memory-room', {
  kicker: 'CITY_MESSAGE → CITY_MEMORY',
  visual: {
    kind: 'cards',
    cols: 2,
    items: [
      { title: 'CITY_MESSAGE', sub: 'the whole message, filed', tone: 'grey' },
      { title: 'fact', tone: 'blue' },
      { title: 'preference', tone: 'green' },
      { title: 'guideline', tone: 'amber' },
      { title: 'memory', tone: 'grey' },
    ],
  },
  message: 'The agent does not store what you said. It stores what it learned.',
  notebook: `${NB} · Part 3, the extractor`,
}, { pins: 'all' });

const b28 = beat(2, '2.8', 'Scope is the key', 'memory-room', {
  kicker: 'Search by scope',
  visual: {
    kind: 'compare',
    left: { title: 'user_id=None', lines: ['the search beam returns empty'], tone: 'grey' },
    right: { title: 'user_id="inspector_demo"', lines: ['the cards light'], tone: 'teal' },
  },
  message: 'Records inherit the scope of the thread that wrote them.',
  notebook: `${NB} · TODO 3`,
}, { pins: 'all' });

const b29 = beat(2, '2.9', 'The system of record', 'ops-center', {
  kicker: 'CITY_INSPECTION_FINDING',
  visual: {
    kind: 'cards',
    cols: 3,
    items: [{ title: 'category' }, { title: 'severity' }, { title: 'grade' }, { title: 'recommendation' }, { title: 'embedding' }, { title: 'Mercer logs one', sub: 'deliberately', tone: 'red' }],
  },
  message: 'Memory is what the agent learns. Findings are what the city records.',
  notebook: `${NB} · Part 4, TODO 4`,
}, { pins: 'all', highlight: [HB] });

const b210 = beat(2, '2.10', 'Vector search with walls', 'city-wide', {
  kicker: 'Similarity + filters',
  visual: {
    kind: 'cards',
    cols: 2,
    items: [
      { title: 'VECTOR_DISTANCE', sub: 'the nearest findings light up' },
      { title: '(:bind IS NULL OR col = :bind)', sub: 'the walls' },
      { title: 'asset = Harbor Bridge', sub: 'wall 1', tone: 'red' },
      { title: 'category = corrosion', sub: 'wall 2', tone: 'red' },
    ],
  },
  message: 'Vector similarity and relational filters in one SQL statement.',
  notebook: `${NB} · TODO 5`,
}, { pins: 'all', highlight: [HB] });

const b211 = beat(2, '2.11', 'Private doors, shared hall', 'memory-room', {
  kicker: 'Three keys',
  visual: {
    kind: 'cards',
    cols: 3,
    items: [
      { title: 'user_id' },
      { title: 'agent_id' },
      { title: 'thread_id' },
      { title: 'Jordan_Vance → Evelyn_H_Mercer’s door', sub: 'bounces off', tone: 'grey' },
      { title: 'the shared hall', sub: 'finds the guideline', tone: 'amber' },
    ],
  },
  message: 'This is a SQL WHERE clause, not a Python filter.',
  notebook: `${NB} · Part 5`,
}, { pins: 'all' });

const b212 = beat(2, '2.12', 'The copilot turn', 'ops-center', {
  kicker: 'The context card',
  visual: {
    kind: 'code',
    lines: ['<summary> … </summary>', '<topics> … </topics>', '<relevant_information> … </relevant_information>', '<recent_messages> … </recent_messages>'],
  },
  message: 'This is the prompt the model actually receives.',
  notebook: `${NB} · Part 6, TODO 6`,
}, { pins: 'all', highlight: ['City Operations Control Center'] });

const b213 = beat(2, '2.13', 'Day 1: Mercer at Pier 2', 'bridge-pier2', {
  kicker: 'Day 1',
  tag: FICTION,
  visual: {
    kind: 'chat',
    lines: [
      { who: 'Evelyn_H_Mercer · Pier 2', text: '~25% section loss, rust bleed.', tone: 'teal' },
      { who: 'finding logged', text: 'corrosion · medium · grade C · repair within 60 days', tone: 'red' },
      { who: 'shared shelf · user_id="Harbor Bridge"', text: 'her guideline lands here', tone: 'amber' },
    ],
  },
  message: 'This is what the next inspector inherits.',
  notebook: `${NB} · Day 1, three cells`,
}, { bridge: true, markers: true });

const b214 = beat(2, '2.14', 'Day N: Vance at the same pier', 'bridge-pier2', {
  kicker: 'Day N · never met Mercer',
  tag: FICTION,
  visual: {
    kind: 'chat',
    lines: [
      { who: 'Jordan_Vance · Pier 2', text: 'Asks at the same pier.', tone: 'teal' },
      { who: 'beam 1 · the logged finding', text: 'score 0.289 · grade C', tone: 'red' },
      { who: 'beam 2 · the pooled guideline', text: 'from the shared shelf', tone: 'amber' },
      { who: 'his private thread', text: 'stays his own', tone: 'grey' },
    ],
  },
  message: 'No human handoff. The finding and the distilled memory carried it.',
  notebook: `${NB} · Day N`,
}, { bridge: true, markers: true });

const b215 = beat(2, '2.15', 'With and without memory', 'bridge-pier2', {
  kicker: 'Same question twice',
  visual: {
    kind: 'compare',
    left: { title: 'Without memory', lines: ['A generic answer.'], tone: 'grey' },
    right: { title: 'With memory', lines: ['Pier 2 · ~25%', 'grade C · 60 days', 'Evelyn_H_Mercer · Day 1'], tone: 'teal' },
  },
  message: 'Same model. Same question. Only the memory differs.',
  notebook: 'the four-row comparison from the deck',
}, { bridge: true, markers: true });

const b216 = beat(2, '2.16', 'Where both labs meet', 'bridge-pier2', {
  kicker: 'Pier 2',
  visual: {
    kind: 'compare',
    left: { title: 'Lab 2 · the rule', lines: ['SOP: section loss > 25%'], tone: 'teal' },
    right: { title: 'Lab 3 · the history', lines: ['finding: ~25% section loss'], tone: 'red' },
  },
  message: 'This afternoon the agent had the rule. Now it has the history. Together they make the call.',
}, { bridge: true, markers: true });

const b217 = beat(2, '2.17', 'Takeaways', 'bridge-overview', {
  kicker: 'Three takeaways',
  visual: { kind: 'list', ordered: true, items: ['Memory is the foundation.', 'Scope is governance.', 'One converged database.', 'Quiz: 5 min, 80% to pass, badge (QR code here)'] },
  message: 'The rule from this afternoon, the history from today. The same database held both.',
}, { pins: 'all', graph: HB, bridge: true });

export const chapter2: SceneDef[] = [
  b20,
  b21,
  b22,
  b23,
  b24,
  b25,
  b26,
  b27,
  b28,
  b29,
  b210,
  b211,
  b212,
  b213,
  b214,
  b215,
  b216,
  b217,
];
