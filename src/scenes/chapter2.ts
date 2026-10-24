import type { SceneDef } from '../engine/types';
import type { ForgetSlotsProps } from '../overlay/concepts/ForgetSlots';
import type { Who } from '../world/Person';
import { beat } from './chapter1';

/**
 * Chapter 2 · Agent Memory (Lab 3, notebook_student_ollama.ipynb). Rough pass: one scene per Storyboard row,
 * copy from the Storyboard tab. No hand-off cards (owner's call).
 */

const HB = 'Harbor Bridge';
const NB = 'notebook_student_ollama.ipynb';

const b20 = beat(2, '2.0', 'Recap: the city', 'bridge', {
  kicker: 'Lab 3 · three-minute recap',
  visual: { kind: 'list', items: ['The city (0.1)', 'The database (0.5)', 'The hero asset: Harbor Bridge (0.7)'] },
  message: 'Same city, same database, same bridge. Now, memory.',
}, { pins: 'all', graph: HB, bridge: true, markers: true });

/**
 * 2.1 · The agent that forgets, in three clicks at the Pier 2 corrosion (owner, 24 Oct): Day 1 Mercer leaves
 * three notes with the copilot, the chat closes and the notes empty out, Day 2 Vance finds three empty slots.
 * Words from the Lab 3 deck, slides 5, 6 and 9. The camera closes in on 2.1a and holds there.
 */
const FORGET_SLOTS: ForgetSlotsProps['slots'] = [
  { title: 'What she found', text: 'rust, ~25% loss', missing: 'Same questions. Again.' },
  { title: 'Her advice', text: 'repair in 60 days', missing: 'Earlier advice is missing' },
  { title: 'Follow-up', text: 'work to plan', missing: 'And the follow-up?' },
];

const forget = (id: string, title: string, shot: string, props: Omit<ForgetSlotsProps, 'slots'>, inspect: { who: Who; leave?: boolean }): SceneDef => ({
  id,
  chapter: 2,
  title,
  shot,
  world: { bridge: true, inspect: { pier: 'pier2', ...inspect } },
  overlay: 'ForgetSlots',
  overlayProps: { ...props, slots: FORGET_SLOTS } as unknown as Record<string, unknown>,
});

const b21a = forget('2.1a', 'The agent that forgets · Day 1', 'pier2-inspect', {
  kicker: 'Day 1 · Pier 2',
  message: 'Mercer tells the copilot what she found.',
  state: 'filled',
  chat: [{ who: 'Evelyn_H_Mercer', text: 'Rust at Pier 2. My finding, my advice, the follow-up.', tone: 'teal' }],
  footnote: 'copilot · “Noted.”',
}, { who: 'character-female-a' });

const b21b = forget('2.1b', 'The agent that forgets · the chat closes', 'pier2-close', {
  kicker: 'The chat closes',
  message: 'Nothing carried over.',
  state: 'emptying',
  footnote: 'Mercer leaves. The session ends.',
}, { who: 'character-female-a', leave: true });

const b21c = forget('2.1c', 'The agent that forgets · Day 2', 'pier2-close', {
  kicker: 'Day 2 · the same pier',
  message: 'The records may still exist. The next visit needs a way to find and use the relevant history.',
  state: 'missing',
  chat: [
    { who: 'Jordan_Vance', text: 'What happened at this pier?', tone: 'teal' },
    { who: 'copilot', text: 'I have no earlier information. What do you see?', tone: 'grey' },
  ],
  notebook: `${NB} · motivation for Part 3 and the Day N cell`,
}, { who: 'character-male-d' });

const b22 = beat(2, '2.2', 'The memory map', 'ops', {
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
}, { ops: true });

const b23 = beat(2, '2.3', 'The glass', 'ops', {
  kicker: 'The context window',
  visual: { kind: 'list', items: ['Overflow', 'Noise', 'The lost “size 9” detail', 'The right fact at the wrong turn'] },
  message: 'The context window is the model’s whole world, and it is a curation problem.',
  notebook: 'the Part 6 context card is the cure',
}, { ops: true });

const b24 = beat(2, '2.4', 'Three dials', 'ops', {
  kicker: 'What flows into the glass',
  visual: { kind: 'cards', cols: 3, items: [{ title: 'Memory engineering' }, { title: 'Context engineering' }, { title: 'Harness engineering' }] },
  message: 'Three disciplines, one job: the right tokens in, the wrong ones out.',
}, { ops: true });

const b25 = beat(2, '2.5', 'The loop with memory', 'ops', {
  kicker: 'Read, act, write',
  visual: { kind: 'flow', steps: ['Read memory at the start of the turn', 'The Lab 2 loop: model ↔ tools', 'Write memory at the end of the turn', 'The database under it'], loop: true, hot: [0, 2] },
  message: 'One store, one memory manager, any harness.',
  notebook: `${NB} · Part 1, TODO 1`,
}, { ops: true });

const b26 = beat(2, '2.6', 'One connection', 'ops', {
  kicker: 'The copilot plugs into the database',
  visual: { kind: 'cards', cols: 2, items: [{ title: 'Copilot', sub: 'one connection' }, { title: 'ALL_MINILM_L12_V2', sub: 'still there from this afternoon' }] },
  message: 'Same 384 numbers as this afternoon, computed inside the database, no API key.',
  notebook: `${NB} · TODO 2 (report_event), peek_sdk_tables`,
}, { ops: true });

const b27 = beat(2, '2.7', 'The write path', 'ops', {
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
}, { ops: true });

const b28 = beat(2, '2.8', 'Scope is the key', 'ops', {
  kicker: 'Search by scope',
  visual: {
    kind: 'compare',
    left: { title: 'user_id=None', lines: ['the search beam returns empty'], tone: 'grey' },
    right: { title: 'user_id="inspector_demo"', lines: ['the cards light'], tone: 'teal' },
  },
  message: 'Records inherit the scope of the thread that wrote them.',
  notebook: `${NB} · TODO 3`,
}, { ops: true });

const b29 = beat(2, '2.9', 'The system of record', 'ops', {
  kicker: 'CITY_INSPECTION_FINDING',
  visual: {
    kind: 'cards',
    cols: 3,
    items: [{ title: 'category' }, { title: 'severity' }, { title: 'grade' }, { title: 'recommendation' }, { title: 'embedding' }, { title: 'Mercer logs one', sub: 'deliberately', tone: 'red' }],
  },
  message: 'Memory is what the agent learns. Findings are what the city records.',
  notebook: `${NB} · Part 4, TODO 4`,
}, { ops: true });

const b210 = beat(2, '2.10', 'Vector search with walls', 'city', {
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

const b211 = beat(2, '2.11', 'Private doors, shared hall', 'ops', {
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
}, { ops: true });

const b212 = beat(2, '2.12', 'The copilot turn', 'ops', {
  kicker: 'The context card',
  visual: {
    kind: 'code',
    lines: ['<summary> … </summary>', '<topics> … </topics>', '<relevant_information> … </relevant_information>', '<recent_messages> … </recent_messages>'],
  },
  message: 'This is the prompt the model actually receives.',
  notebook: `${NB} · Part 6, TODO 6`,
}, { ops: true });

const b213 = beat(2, '2.13', 'Day 1: Mercer at Pier 2', 'pier2-inspect', {
  kicker: 'Day 1',
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
}, { bridge: true, inspect: { pier: 'pier2', who: 'character-female-a' } });

const b214 = beat(2, '2.14', 'Day 2: Vance at the same pier', 'pier2-inspect', {
  kicker: 'Day 2 · never met Mercer',
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
}, { bridge: true, inspect: { pier: 'pier2', who: 'character-male-d' } });

const b215 = beat(2, '2.15', 'With and without memory', 'pier2', {
  kicker: 'Same question twice',
  visual: {
    kind: 'compare',
    left: { title: 'Without memory', lines: ['A generic answer.'], tone: 'grey' },
    right: { title: 'With memory', lines: ['Pier 2 · ~25%', 'grade C · 60 days', 'Evelyn_H_Mercer · Day 1'], tone: 'teal' },
  },
  message: 'Same model. Same question. Only the memory differs.',
  notebook: 'the four-row comparison from the deck',
}, { bridge: true, markers: true });

const b216 = beat(2, '2.16', 'Where both labs meet', 'pier2', {
  kicker: 'Pier 2',
  visual: {
    kind: 'compare',
    left: { title: 'Lab 2 · the rule', lines: ['SOP: section loss > 25%'], tone: 'teal' },
    right: { title: 'Lab 3 · the history', lines: ['finding: ~25% section loss'], tone: 'red' },
  },
  message: 'This afternoon the agent had the rule. Now it has the history. Together they make the call.',
}, { bridge: true, markers: true });

const b217 = beat(2, '2.17', 'Takeaways', 'bridge', {
  kicker: 'Three takeaways',
  visual: { kind: 'list', ordered: true, items: ['Memory is the foundation.', 'Scope is governance.', 'One converged database.', 'Quiz: 5 min, 80% to pass, badge (QR code here)'] },
  message: 'The rule from this afternoon, the history from today. The same database held both.',
}, { pins: 'all', graph: HB, bridge: true });

export const chapter2: SceneDef[] = [
  b20,
  b21a,
  b21b,
  b21c,
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
