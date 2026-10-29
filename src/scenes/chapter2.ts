import type { SceneDef } from '../engine/types';
import type { CastProps } from '../overlay/concepts/Cast';
import type { ChatNote, CopilotChatProps } from '../overlay/concepts/CopilotChat';
import type { MemoryMapProps } from '../overlay/concepts/MemoryMap';
import type { LikeAPersonProps } from '../overlay/concepts/LikeAPerson';
import type { GlassProps } from '../overlay/concepts/Glass';
import type { DisciplineProps, WhoFixesWhatProps } from '../overlay/concepts/Engineering';
import type { DeskCabinetProps, ThreeKindsProps, SharedShelfProps } from '../overlay/concepts/MemoryKinds';
import type { MemoryLoopProps } from '../overlay/concepts/MemoryLoop';
import type { HandsOnProps, ScopeProps } from '../overlay/concepts/HandsOn';
import type { CopilotTurnProps } from '../overlay/concepts/HandsOn2';
import type { BothLabsProps, EndingProps, WithWithoutProps } from '../overlay/concepts/Ending';
import type { RecapProps } from '../overlay/concepts/Recap';
import type { AllLabsProps } from '../overlay/concepts/AllLabs';
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
  // the notebook's words for her finding (reviewer, 27 Oct), without the pier number (owner, 25 Oct: no pier numbers on screen)
  { text: 'Corrosion on the bearing assemblies, with about 25% section loss at the bearing plate edges.', missing: 'Same questions. Again.' },
  { text: 'My advice: repair within 60 days.', missing: 'Earlier advice is missing' },
  { text: 'Follow-up: work to plan.', missing: 'And the follow-up?' },
];

const chat = (id: string, title: string, shot: string, props: CopilotChatProps & { after?: ChatNote[] }, inspect: { who: Who; leave?: boolean }): SceneDef => ({
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
  message: 'Mercer talks to the AI agent first, then calls **log_finding** to record the official finding.',
  items: [
    { divider: 'Day 1 · Mercer' },
    ...MERCER_SAYS.map((m) => ({ from: 'person' as const, text: m.text })),
    { from: 'copilot', text: 'Noted.' },
  ],
}, { who: 'character-female-a' });

const b21b = chat('3.1b', 'The agent that forgets · the chat closes', 'pier2-close', {
  kicker: 'The chat closes',
  message: 'Before adding memory: **nothing carried over.**',
  items: [
    { divider: 'Day 1 · Mercer' },
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
    { divider: 'Day 2 · Vance' },
    { from: 'person', text: 'What happened at this pier?' },
    { from: 'copilot', text: 'I have no earlier information. What do you see?' },
  ],
  notebook: `${NB} · motivation for Part 3 and the Day N cell`,
}, { who: 'character-male-d' });

/**
 * 3.2 · Kinds of memory (owner, 28 Oct: the V2 mocks, each page teaching in plain words). The camera stays at the
 * rust with Vance there, since these pages answer "what should Vance know?". Short-term is the desk, long-term the
 * cabinet (one panel across both clicks); then the human analogy (a real table), why there are three kinds, and the
 * shared shelf. The full memory map waits for the end of the lab (3.15c), where the notebook shows what was built.
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

const b22a = atRust('3.2a', 'Short-term memory', 'DeskCabinet', { kicker: 'Kinds of memory', step: 1, message: '**Short-term memory** is the desk: what the agent holds right now.' } satisfies DeskCabinetProps, 'desk');
const b22b = atRust('3.2b', 'Long-term memory', 'DeskCabinet', { kicker: 'Kinds of memory', step: 2, message: '**Long-term memory** is the cabinet: what it keeps between visits.' } satisfies DeskCabinetProps, 'desk');
// one click per kind (owner, 29 Oct), the table staying put
const person = (id: string, focus: 0 | 1 | 2) => atRust(id, 'Like a person', 'LikeAPerson', { kicker: 'Kinds of memory', focus, message: 'Long-term memory comes in three kinds. **You already have all three.**' } satisfies LikeAPersonProps, 'person');
const b22p = person('3.2p', 0);
const b22q = person('3.2q', 1);
const b22r = person('3.2r', 2);
const b22c = atRust('3.2c', 'One report, three cards', 'ThreeKinds', { kicker: 'Kinds of memory', message: 'One thing Mercer says holds **three kinds of knowledge**.' } satisfies ThreeKindsProps);
const b22e = atRust('3.2e', 'Private drawer, shared shelf', 'SharedShelf', { kicker: 'Private and shared', message: 'What Mercer keeps for herself, and **what she leaves for the next inspector**.', notebook: 'CITY_MEMORY holds fact, preference, guideline and memory records' } satisfies SharedShelfProps);

/**
 * 3.3 and 3.4 · the glass, then the three jobs that fill it well (owner, 28 Oct: V2 mocks). Still at the rust with
 * Vance there: the story has not changed place. One page per job, each with an everyday picture and the Harbor
 * Bridge story in three steps, then the recap grid; this afternoon's loop now lives in the harness page.
 */
const b23a = atRust('3.3a', 'The glass', 'Glass', { kicker: 'The context window, “the glass”', step: 1, message: 'The language model reads **only what is in the glass**, this turn.' } satisfies GlassProps, 'glass');
const b23b = atRust('3.3b', 'Four things go wrong', 'Glass', { kicker: 'The context window', step: 2, message: 'The glass is all the model sees, and **four things go wrong** when we fill it.', notebook: 'the Part 6 context card is the cure' } satisfies GlassProps, 'glass');
const b24a = atRust('3.4a', 'Memory engineering', 'Discipline', { kicker: '① Memory engineering', which: 'memory', message: 'Decide what to keep, and **file it where it won’t get lost**.' } satisfies DisciplineProps);
const b24b = atRust('3.4b', 'Context engineering', 'Discipline', { kicker: '② Context engineering', which: 'context', message: 'For each question, **pour in only what this question needs**.' } satisfies DisciplineProps);
const b24c = atRust('3.4c', 'Harness engineering', 'Discipline', { kicker: '③ Harness engineering', which: 'harness', message: 'Make it happen **every turn, automatically**.', notebook: `${NB} · Part 1, TODO 1` } satisfies DisciplineProps);
const b24d = atRust('3.4d', 'Who fixes what', 'WhoFixesWhat', { kicker: 'Three disciplines, four problems', message: 'That is why **Vance gets Mercer’s finding**.' } satisfies WhoFixesWhatProps);
const b25b = atRust('3.5b', 'One store, any harness', 'MemoryLoop', { kicker: 'The agent loop, with memory wired in', message: 'One store, one memory manager, **any harness**.' } satisfies MemoryLoopProps);

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

const b26 = atOps('3.6', 'One connection', 'OneConnection', { kicker: 'Lab 3 · Part 1-2', message: 'The AI agent needs **one connection**: the database.', notebook: `${NB} · Parts 1-2 and TODO 1`, stop: '3.6' } satisfies HandsOnProps);
const b27 = atOps('3.7', 'The write path', 'WritePath', { kicker: 'Lab 3 · Part 3', message: 'The agent does not store what you said. It stores **what it learned**.', notebook: `${NB} · Part 3, TODO 2 (report_event), peek_sdk_tables`, stop: '3.7' } satisfies HandsOnProps);
const b28a = atOps('3.8a', 'Scope is the key', 'Scope', { kicker: 'Lab 3 · Part 3, TODO 3', step: 1, message: 'Search the memories with **no user id**: nothing comes back.', notebook: `${NB} · TODO 3` } satisfies ScopeProps, 'scope');
const b28b = atOps('3.8b', 'Scope is the key', 'Scope', { kicker: 'Lab 3 · Part 3, TODO 3', step: 2, message: 'Records inherit the **scope** of the thread that wrote them.', notebook: `${NB} · TODO 3` } satisfies ScopeProps, 'scope');
const b29 = atOps('3.9', 'The system of record', 'SystemOfRecord', { kicker: 'Lab 3 · Part 4', message: 'Memory is what the agent learns. Findings are what **the city records**.', notebook: `${NB} · Part 4, TODO 4` } satisfies HandsOnProps);
const b210 = atOps('3.10', 'Vector search with walls', 'VectorWalls', { kicker: 'Lab 3 · Part 4, TODO 5', message: 'Vector similarity and relational filters in **one SQL statement**.', notebook: `${NB} · TODO 5` } satisfies HandsOnProps);

/**
 * Lab 3 pages 21 to 29 (3.11-3.17), sketches agreed in chat (owner, 25 Oct). 21-23 stay in the Ops room; 24-27 go
 * back to the rust, Day 1 and Day 2 in the chat window from page 2; 28 over the bridge; 29 the takeaways.
 */
const b211 = atOps('3.11', 'Private doors, shared hall', 'DoorsAndHall', { kicker: 'Lab 3 · Part 5', message: 'This is a **SQL WHERE clause**, not a Python filter.', notebook: `${NB} · Part 5` } satisfies HandsOnProps);
const b212a = atOps('3.12a', 'The AI agent turn', 'CopilotTurn', { kicker: 'Lab 3 · Part 6, TODO 6', step: 1, message: 'One copilot turn, **eight steps**.', notebook: `${NB} · Part 6, TODO 6` } satisfies CopilotTurnProps, 'turn');
const b212b = atOps('3.12b', 'The context card', 'CopilotTurn', { kicker: 'Lab 3 · Part 6, TODO 6', step: 2, message: 'This is **the prompt the model actually receives**.', notebook: `${NB} · Part 6, the context card` } satisfies CopilotTurnProps, 'turn');

// 3.13 and 3.14 as teaching panels that build in two steps (owner, 29 Oct: like the first teaching part)
const b213 = atRust('3.13', 'Day 1: Mercer at the rust', 'Day1', { kicker: 'Day 1 · the rust', step: 1, message: 'Mercer reports the rust to **the AI agent**.', notebook: `${NB} · Day 1, three cells` }, 'day1');
const b213a = atRust('3.13a', 'What the next inspector inherits', 'Day1', { kicker: 'Day 1 · the rust', step: 2, message: 'This is what the next inspector **inherits**.', notebook: `${NB} · Day 1, three cells` }, 'day1');
const b214 = atRust('3.14', 'Day 2: Vance at the same rust', 'Day2', { kicker: 'Day 2 · the same rust', step: 1, message: 'Vance asks. The agent **looks it up first**.', notebook: `${NB} · Day N` }, 'day2');
const b214a = atRust('3.14a', 'The answer, with its sources', 'Day2', { kicker: 'Day 2 · the same rust', step: 2, message: 'No human handoff. **The finding and the memory carried it.**', notebook: `${NB} · Day N` }, 'day2');

const b215 = atRust('3.15', 'With and without memory', 'WithWithout', {
  kicker: 'Same question, asked twice',
  message: 'Same model. Same question. **Only the memory differs.**',
  question: 'What happened at this pier?',
  without: 'I have no earlier information. What do you see?',
  withMemory: 'Mercer logged corrosion on Day 1: ~25% section loss, grade C, repair within 60 days.',
  notebook: `${NB} · the comparison cell`,
} satisfies WithWithoutProps);
const b215b = atRust('3.15b', 'The four failures, solved', 'FailuresSolved', { kicker: 'Back to the glass', message: 'The four failures from the glass, **solved**.' } satisfies EndingProps);
// 3.15c · the full memory map, moved from the start of the lab (owner, 28 Oct): after the hands-on its layers mean something (notebook cell 90)
const b215c = atRust('3.15c', 'What you built', 'MemoryMap', { kicker: 'Kinds of memory', step: 5, message: 'The full memory map: **what you actually built** today.', notebook: `${NB} · Memory types - what you actually built` } satisfies MemoryMapProps);

const b216 = atRust('3.16', 'Where both labs meet', 'LabsMeet', { kicker: 'Where both labs meet', step: 1, message: 'This afternoon the agent had **the rule**. Now it has **the history**.' }, 'meet');
const b216a = atRust('3.16a', 'Together they make the call', 'LabsMeet', { kicker: 'Where both labs meet', step: 2, message: 'Together they **make the call**.' }, 'meet');

// 3.17 · the Lab 3 recap (owner approved Flow317V2, 29 Oct); the quiz moved to 3.18
const b217: SceneDef = {
  id: '3.17',
  chapter: 2,
  title: 'Lab 3 recap',
  shot: 'bridge',
  world: { bridge: true, markers: 'pier2' },
  overlay: 'Lab3Recap',
  overlayProps: {
    kicker: 'Lab 3 · What we built',
    message: 'An agent that **remembers**, and hands over.',
    points: [
      { title: 'Memory is the foundation', text: 'Not a feature: the agent is only as good as what it can recall.' },
      { title: 'Context is curation', text: 'The context window is a curation problem: fill it with what this question needs.' },
      { title: 'One converged store', text: 'One converged store beats four services kept in sync.' },
    ],
    next: '**All three labs on one page:** what we built today, from an assistant to an agent that remembers.',
  } satisfies RecapProps as unknown as Record<string, unknown>,
};

// 3.18 · takeaways of all three labs, the last page of the show (owner approved Flow318V3, 29 Oct); the quiz is the one red thing
const b218: SceneDef = {
  id: '3.18',
  chapter: 2,
  title: 'Takeaways · all three labs',
  shot: 'bridge',
  world: { bridge: true },
  overlay: 'AllLabs',
  overlayProps: {
    kicker: 'Takeaways · all three labs',
    message: 'From an assistant, to an agent, to **an agent that remembers**.',
    steps: [
      { tag: 'Lab 1 · AI Economics', title: 'An assistant', line: 'the right data, the right model, guardrails', where: 'on the bridge: the repair plan' },
      { tag: 'Lab 2 · RAG to Agents', title: 'An agent', line: 'decides what to look up across four shapes, says what to do', where: 'on the bridge: the crack' },
      { tag: 'Lab 3 · Agent Memory', title: 'An agent that remembers', line: 'what Mercer learns on Day 1, Vance knows on Day 2', where: 'on the bridge: the rust' },
    ],
    foundation: 'One Oracle AI Database under all three',
    quiz: ['5 minutes', '80% to pass', 'a badge'],
  } satisfies AllLabsProps as unknown as Record<string, unknown>,
};

export const chapter2: SceneDef[] = [
  b20,
  b21a,
  b21b,
  b21c,
  b22a,
  b22b,
  b22p,
  b22q,
  b22r,
  b22c,
  b22e,
  b23a,
  b23b,
  b24a,
  b24b,
  b24c,
  b24d,
  b25b,
  b26,
  b27,
  b28a,
  b28b,
  b29,
  b210,
  b211,
  b212a,
  b212b,
  b213,
  b213a,
  b214,
  b214a,
  b215,
  b215b,
  b215c,
  b216,
  b216a,
  b217,
  b218,
];
