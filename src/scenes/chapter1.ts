import type { SceneDef } from '../engine/types';
import type { BeatProps } from '../overlay/concepts/Beat';
import type { RecapProps } from '../overlay/concepts/Recap';

/**
 * Chapter 1 · RAG to Agents (Lab 2, rag_to_agents_lab.ipynb). Rough pass: one scene per Storyboard row,
 * copy taken from the Storyboard tab. No hand-off cards (owner's call): the presenter sends people to the notebook.
 */

type World = Record<string, unknown>;

export function beat(chapter: 1 | 2, id: string, title: string, shot: string, props: BeatProps, world: World = {}): SceneDef {
  return { id, chapter, title, shot, world, overlay: 'Beat', overlayProps: props as unknown as Record<string, unknown> };
}

const HB = 'Harbor Bridge';

const b11 = beat(1, '2.1', 'The bare model', 'sky-model', {
  kicker: 'Ops Center · the bare LLM',
  notebook: 'rag_to_agents_lab.ipynb · Section 0 setup, then the bare LLM question',
  visual: { kind: 'none' },
  message: 'A model knows **the world**. It does not know !!your city!!.',
}, { pins: 'all', sky: 'model' }); // no Ops Center name: this close it would sit under the script bar

const b12 = beat(1, '2.2', 'Text becomes a point', 'sky', {
  kicker: 'Embeddings · ALL_MINILM_L12_V2',
  notebook: 'rag_to_agents_lab.ipynb · Section 1.2 to 1.5, VECTOR_EMBEDDING(ALL_MINILM_L12_V2)',
  visual: { kind: 'none' },
  message: '**Similar meaning** lands close together.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'embed' });

const b13 = beat(1, '2.3', 'Grounding', 'sky', {
  kicker: 'RAG · the references',
  notebook: 'rag_to_agents_lab.ipynb · Section 1.7 to 1.9, raw RAG and LangChain',
  visual: { kind: 'none' },
  message: 'Give the model **the evidence** and it stops guessing.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'envelope' });

const b14: SceneDef = {
  id: '2.4',
  chapter: 1,
  title: 'One folder is not enough',
  shot: 'sky',
  world: { pins: 'all', sky: 'overflow' },
  overlay: 'Overflow',
  overlayProps: { message: '**One folder answers one question.** Operations ask **three at once**.' },
};

const b15: SceneDef = {
  id: '2.5',
  chapter: 1,
  title: 'Tools and the skill',
  shot: 'sky',
  world: { pins: 'all', sky: 'tools' },
  overlay: 'Toolbelt',
  overlayProps: { message: '**Tools** are what the agent can do. **The skill** is how you want it done.' },
};

const b16: SceneDef = {
  id: '2.6',
  chapter: 1,
  title: 'One query, four shapes',
  shot: 'sky',
  world: { pins: 'all', sky: 'unified' },
  overlay: 'UnifiedQuery',
  overlayProps: { message: '**One call, four data models, one transaction.** No ETL, no sync jobs, no stale copies.' },
};

const b17 = beat(1, '2.7', 'The agent loop', 'bridge', {
  kicker: 'Agent · the crack report arrives',
  notebook: 'rag_to_agents_lab.ipynb · Section 5, the agent and the crack report',
  visual: { kind: 'flow', steps: ['recall', 'get_asset_incident_brief', 'remember', 'final'], loop: true, hot: [1] },
  message: 'The agent **chooses its tools**. The procedure **keeps it honest**.',
}, { bridge: true, markers: true });

const b18 = beat(1, '2.8', 'A sticky note', 'sky', {
  kicker: 'store_incident',
  notebook: 'rag_to_agents_lab.ipynb · Section 5.8 and 6.1',
  visual: { kind: 'none' },
  message: 'A memory, but **a thin one**.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'note' });

// 2.9 · the Lab 2 recap (owner approved Flow29V3, 29 Oct): what we built, then NEXT, the rust (a drawing, not a photo)
const b19: SceneDef = {
  id: '2.9',
  chapter: 1,
  title: 'Lab 2 recap',
  shot: 'pier2',
  world: { bridge: true, markers: true },
  overlay: 'Lab2Recap',
  overlayProps: {
    kicker: 'Lab 2 · What we built',
    message: 'From a model that guesses to **an agent that decides**.',
    notebook: 'rag_to_agents_lab.ipynb · Section 6 close',
    points: [
      { title: 'Ground the answer', text: 'Give the model the evidence (RAG) and it stops guessing.' },
      { title: 'Tools and the skill', text: 'The AI agent chooses its tools; the skill keeps it honest.' },
      { title: 'One query, four shapes', text: 'One SQL statement, one transaction, no copies to sync.' },
    ],
    next: '**Lab 3 · Agent Memory:** the rust is still waiting. The AI agent learns to **remember**, so the next inspector knows what the last one found.',
  } satisfies RecapProps as unknown as Record<string, unknown>,
};

export const chapter1: SceneDef[] = [
  b11,
  b12,
  b13,
  b14,
  b15,
  b16,
  b17,
  b18,
  b19,
];
