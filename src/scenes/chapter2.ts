import type { SceneDef } from '../engine/types';
import type { CastProps } from '../overlay/concepts/Cast';
import type { CopilotChatProps } from '../overlay/concepts/CopilotChat';
import type { MemoryMapProps } from '../overlay/concepts/MemoryMap';
import type { GlassProps } from '../overlay/concepts/Glass';
import type { DisciplinesProps } from '../overlay/concepts/Disciplines';
import type { MemoryLoopProps } from '../overlay/concepts/MemoryLoop';
import type { HandsOnProps, ScopeProps } from '../overlay/concepts/HandsOn';
import type { Who } from '../world/Person';
import { beat } from './chapter1';
// bundled, not in public/: the dev server only serves public files it saw at start-up
import mercerPortrait from '../assets/portraits/mercer.png';
import vancePortrait from '../assets/portraits/vance.png';

/**
 * Chapter 2 · Agent Memory (Lab 3, notebook_student_ollama.ipynb). Rough pass: one scene per Storyboard row,
 * copy from the Storyboard tab. No hand-off cards (owner's call).
 */

const HB = 'Harbor Bridge';
const NB = 'notebook_student_ollama.ipynb';

/**
 * 2.0 · Back at the bridge (owner, 25 Oct: no recap; we come back because the problem is still there).
 * Only the rust lights up (no pier numbers on screen, owner 25 Oct). The cast and the question are the Lab 3 deck's slide 5.
 */
const b20: SceneDef = {
  id: '3.0',
  chapter: 2,
  title: 'Back at the bridge',
  shot: 'bridge',
  world: { bridge: true, markers: 'pier2' },
  overlay: 'Cast',
  overlayProps: {
    kicker: 'Lab 3 · Agent Memory',
    message: 'We are back at Harbor Bridge. !!The rust!! is still there.',
    heading: 'One bridge. Two inspectors.',
    people: [
      // owner, 25 Oct: just the names, no initials badge; a portrait of their own 3D character beside each
      { name: 'Mercer', portrait: mercerPortrait, when: 'First visit', text: 'Checks the rust and records what she sees.' },
      { name: 'Vance', portrait: vancePortrait, when: 'Next visit', text: 'Returns to the same rust to see what has changed.' },
    ],
    question: 'What should **Vance** know before he starts?',
  } satisfies CastProps as unknown as Record<string, unknown>,
};

/**
 * 3.1 · The agent that forgets, in three clicks at the rust (owner, 24 Oct): Day 1 Mercer tells
 * the copilot (the AI agent) what she found, the chat closes and her messages empty out, Day 2 Vance asks
 * at the same pier and the copilot has nothing. Shown as a chat window: the inspector on the right, the
 * copilot on the left (owner). Words from the Lab 3 deck, slides 5, 6 and 9. The camera closes in on 2.1a
 * and holds there.
 */
const MERCER_SAYS: { text: string; missing: string }[] = [
  { text: 'Rust on the pier, about 25% section loss.', missing: 'Same questions. Again.' },
  { text: 'My advice: repair within 60 days.', missing: 'Earlier advice is missing' },
  { text: 'Follow-up: work to plan.', missing: 'And the follow-up?' },
];

const chat = (id: string, title: string, shot: string, props: CopilotChatProps, inspect: { who: Who; leave?: boolean }): SceneDef => ({
  id,
  chapter: 2,
  title,
  shot,
  world: { bridge: true, inspect: { pier: 'pier2', ...inspect } },
  overlay: 'CopilotChat',
  overlayProps: props as unknown as Record<string, unknown>,
});

const b21a = chat('3.1a', 'The agent that forgets · Day 1', 'pier2-inspect', {
  kicker: 'Day 1 · the rust',
  message: 'Mercer tells the copilot what she found.',
  items: [
    { divider: 'Day 1 · Evelyn_H_Mercer' },
    ...MERCER_SAYS.map((m) => ({ from: 'person' as const, text: m.text })),
    { from: 'copilot', text: 'Noted.' },
  ],
}, { who: 'character-female-a' });

const b21b = chat('3.1b', 'The agent that forgets · the chat closes', 'pier2-close', {
  kicker: 'The chat closes',
  message: 'Nothing carried over.',
  items: [
    { divider: 'Day 1 · Evelyn_H_Mercer' },
    ...MERCER_SAYS.map((m) => ({ from: 'person' as const, text: m.text, state: 'emptying' as const })),
    { from: 'copilot', text: 'Noted.', state: 'emptying' },
    { divider: 'Mercer leaves · the session ends' },
  ],
}, { who: 'character-female-a', leave: true });

const b21c = chat('3.1c', 'The agent that forgets · Day 2', 'pier2-close', {
  kicker: 'Day 2 · the same pier',
  message: 'The records may still exist. The next visit needs a way to find and use the relevant history.',
  items: [
    { divider: 'Day 1 · not kept' },
    ...MERCER_SAYS.map((m) => ({ from: 'person' as const, text: m.text, state: 'empty' as const, label: m.missing })),
    { divider: 'Day 2 · Jordan_Vance' },
    { from: 'person', text: 'What happened at this pier?' },
    { from: 'copilot', text: 'I have no earlier information. What do you see?' },
  ],
  notebook: `${NB} · motivation for Part 3 and the Day N cell`,
}, { who: 'character-male-d' });

/**
 * 3.2 · The memory map, in five clicks built exactly like the Lab 3 deck's slides 19 to 23 (owner, 25 Oct).
 * The camera stays at the rust with Vance there, since the map answers "what should Vance know?"; the five
 * pages share one panel, so each click only adds its part.
 */
const map = (id: string, step: MemoryMapProps['step'], message: string, notebook?: string): SceneDef => ({
  id,
  chapter: 2,
  title: 'The memory map',
  shot: 'pier2-close',
  world: { bridge: true, inspect: { pier: 'pier2', who: 'character-male-d' } },
  overlay: 'MemoryMap',
  overlayGroup: 'memory-map',
  overlayProps: { kicker: 'Kinds of memory', step, message, notebook } satisfies MemoryMapProps as unknown as Record<string, unknown>,
});

const b22a = map('3.2a', 1, '**Short-term memory**: what the agent holds right now.');
const b22b = map('3.2b', 2, '**Long-term memory**: what it keeps between visits.');
const b22c = map('3.2c', 3, 'Three kinds: **how to do the job**, **what happened**, **what is true**.');
const b22d = map('3.2d', 4, 'Each kind lives in its own layer.');
const b22e = map('3.2e', 5, 'And a **shared memory**, so the next inspector can use it too.', 'CITY_MEMORY holds fact, preference, guideline and memory records');

/**
 * 3.3 to 3.5 · the glass, three disciplines, the loop (owner, 25 Oct), from the Lab 3 deck's slides 24 to 34.
 * The camera still holds at the rust with Vance there: the story has not changed place, these pages explain
 * what he should have had. Multi-click pages share one panel (overlayGroup).
 */
const atRust = (id: string, title: string, overlay: string, props: object, group?: string): SceneDef => ({
  id,
  chapter: 2,
  title,
  shot: 'pier2-close',
  world: { bridge: true, inspect: { pier: 'pier2', who: 'character-male-d' } },
  overlay,
  overlayGroup: group,
  overlayProps: props as Record<string, unknown>,
});

const b23a = atRust('3.3a', 'The glass', 'Glass', { kicker: 'The context window', step: 1, message: 'The context window is **all the model sees**.' } satisfies GlassProps, 'glass');
const b23b = atRust('3.3b', 'The glass', 'Glass', { kicker: 'The context window', step: 2, message: 'The context window is a **curation problem**.', notebook: 'the Part 6 context card is the cure' } satisfies GlassProps, 'glass');
const b24 = atRust('3.4', 'Three disciplines', 'Disciplines', { kicker: 'Three disciplines, one goal', message: 'One job: the **right tokens in**, the wrong ones out.' } satisfies DisciplinesProps);
const b25a = atRust('3.5a', 'The loop with memory', 'MemoryLoop', { kicker: 'The agent loop, with memory wired in', step: 1, message: 'This afternoon’s loop, with memory **read at the start** and **written at the end**.', notebook: `${NB} · Part 1, TODO 1` } satisfies MemoryLoopProps, 'loop');
const b25b = atRust('3.5b', 'The loop with memory', 'MemoryLoop', { kicker: 'The agent loop, with memory wired in', step: 2, message: 'One store, one memory manager, **any harness**.' } satisfies MemoryLoopProps, 'loop');

/**
 * Lab 3 pages 15 to 19 (3.6-3.10), the notebook's Parts 1 to 5, in the Ops room (owner, 25 Oct; sketches agreed
 * in chat). The camera moves once, at 3.6, and holds; only the panel on the right changes.
 */
const atOps = (id: string, title: string, overlay: string, props: object, group?: string): SceneDef => ({
  id,
  chapter: 2,
  title,
  shot: 'ops',
  world: { ops: true },
  overlay,
  overlayGroup: group,
  overlayProps: props as Record<string, unknown>,
});

const b26 = atOps('3.6', 'One connection', 'OneConnection', { kicker: 'Lab 3 · Part 1', message: 'The copilot needs **one connection**: the database.', notebook: `${NB} · Part 1 and TODO 1` } satisfies HandsOnProps);
const b27 = atOps('3.7', 'The write path', 'WritePath', { kicker: 'Lab 3 · Part 3', message: 'The agent does not store what you said. It stores **what it learned**.', notebook: `${NB} · Part 3, TODO 2 (report_event), peek_sdk_tables` } satisfies HandsOnProps);
const b28a = atOps('3.8a', 'Scope is the key', 'Scope', { kicker: 'Lab 3 · Part 3, TODO 3', step: 1, message: 'Search the memories with **no user id**: nothing comes back.', notebook: `${NB} · TODO 3` } satisfies ScopeProps, 'scope');
const b28b = atOps('3.8b', 'Scope is the key', 'Scope', { kicker: 'Lab 3 · Part 3, TODO 3', step: 2, message: 'Records inherit the **scope** of the thread that wrote them.', notebook: `${NB} · TODO 3` } satisfies ScopeProps, 'scope');
const b29 = atOps('3.9', 'The system of record', 'SystemOfRecord', { kicker: 'Lab 3 · Part 4', message: 'Memory is what the agent learns. Findings are what **the city records**.', notebook: `${NB} · Part 4, TODO 4` } satisfies HandsOnProps);
const b210 = atOps('3.10', 'Vector search with walls', 'VectorWalls', { kicker: 'Lab 3 · Part 4, TODO 5', message: 'Vector similarity and relational filters in **one SQL statement**.', notebook: `${NB} · TODO 5` } satisfies HandsOnProps);

const b211 = beat(2, '3.11', 'Private doors, shared hall', 'ops', {
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

const b212 = beat(2, '3.12', 'The copilot turn', 'ops', {
  kicker: 'The context card',
  visual: {
    kind: 'code',
    lines: ['<summary> … </summary>', '<topics> … </topics>', '<relevant_information> … </relevant_information>', '<recent_messages> … </recent_messages>'],
  },
  message: 'This is the prompt the model actually receives.',
  notebook: `${NB} · Part 6, TODO 6`,
}, { ops: true });

const b213 = beat(2, '3.13', 'Day 1: Mercer at the rust', 'pier2-inspect', {
  kicker: 'Day 1',
  visual: {
    kind: 'chat',
    lines: [
      { who: 'Evelyn_H_Mercer · the rust', text: '~25% section loss, rust bleed.', tone: 'teal' },
      { who: 'finding logged', text: 'corrosion · medium · grade C · repair within 60 days', tone: 'red' },
      { who: 'shared shelf · user_id="Harbor Bridge"', text: 'her guideline lands here', tone: 'amber' },
    ],
  },
  message: 'This is what the next inspector inherits.',
  notebook: `${NB} · Day 1, three cells`,
}, { bridge: true, inspect: { pier: 'pier2', who: 'character-female-a' } });

const b214 = beat(2, '3.14', 'Day 2: Vance at the same pier', 'pier2-inspect', {
  kicker: 'Day 2 · never met Mercer',
  visual: {
    kind: 'chat',
    lines: [
      { who: 'Jordan_Vance · the same rust', text: 'Asks about the same rust.', tone: 'teal' },
      { who: 'beam 1 · the logged finding', text: 'score 0.289 · grade C', tone: 'red' },
      { who: 'beam 2 · the pooled guideline', text: 'from the shared shelf', tone: 'amber' },
      { who: 'his private thread', text: 'stays his own', tone: 'grey' },
    ],
  },
  message: 'No human handoff. The finding and the distilled memory carried it.',
  notebook: `${NB} · Day N`,
}, { bridge: true, inspect: { pier: 'pier2', who: 'character-male-d' } });

const b215 = beat(2, '3.15', 'With and without memory', 'pier2', {
  kicker: 'Same question twice',
  visual: {
    kind: 'compare',
    left: { title: 'Without memory', lines: ['A generic answer.'], tone: 'grey' },
    right: { title: 'With memory', lines: ['the rust · ~25%', 'grade C · 60 days', 'Evelyn_H_Mercer · Day 1'], tone: 'teal' },
  },
  message: 'Same model. Same question. Only the memory differs.',
  notebook: 'the four-row comparison from the deck',
}, { bridge: true, markers: true });

const b216 = beat(2, '3.16', 'Where both labs meet', 'pier2', {
  kicker: 'The rust',
  visual: {
    kind: 'compare',
    left: { title: 'Lab 2 · the rule', lines: ['SOP: section loss > 25%'], tone: 'teal' },
    right: { title: 'Lab 3 · the history', lines: ['finding: ~25% section loss'], tone: 'red' },
  },
  message: 'This afternoon the agent had the rule. Now it has the history. Together they make the call.',
}, { bridge: true, markers: true });

const b217 = beat(2, '3.17', 'Takeaways', 'bridge', {
  kicker: 'Three takeaways',
  visual: { kind: 'list', ordered: true, items: ['Memory is the foundation.', 'Scope is governance.', 'One converged database.', 'Quiz: 5 min, 80% to pass, badge (QR code here)'] },
  message: 'The rule from this afternoon, the history from today. The same database held both.',
}, { pins: 'all', graph: HB, bridge: true });

export const chapter2: SceneDef[] = [
  b20,
  b21a,
  b21b,
  b21c,
  b22a,
  b22b,
  b22c,
  b22d,
  b22e,
  b23a,
  b23b,
  b24,
  b25a,
  b25b,
  b26,
  b27,
  b28a,
  b28b,
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
