import type { SceneDef } from '../engine/types';
import type { BeatProps } from '../overlay/concepts/Beat';

/**
 * Chapter 1 · RAG to Agents (Lab 2, rag_to_agents_lab.ipynb). Rough pass: one scene per Storyboard row,
 * copy taken from the Storyboard tab. No hand-off cards (owner's call): the presenter sends people to the notebook.
 */

type World = Record<string, unknown>;

export function beat(chapter: 1 | 2, id: string, title: string, shot: string, props: BeatProps, world: World = {}): SceneDef {
  return { id, chapter, title, shot, world, overlay: 'Beat', overlayProps: props as unknown as Record<string, unknown> };
}

const HB = 'Harbor Bridge';

const b11 = beat(1, '1.1', 'The bare model', 'sky', {
  kicker: 'Ops Center · the bare LLM',
  notebook: 'rag_to_agents_lab.ipynb · Section 0 setup, then the bare LLM question',
  visual: { kind: 'none' },
  message: 'A model knows the world. It does not know your city.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'model' });

const b12 = beat(1, '1.2', 'Text becomes a point', 'sky', {
  kicker: 'Embeddings · ALL_MINILM_L12_V2',
  notebook: 'rag_to_agents_lab.ipynb · Section 1.2 to 1.5, VECTOR_EMBEDDING(ALL_MINILM_L12_V2)',
  visual: { kind: 'none' },
  message: 'Similar meaning lands close together.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'embed' });

const b13 = beat(1, '1.3', 'Grounding', 'sky', {
  kicker: 'RAG · the envelope',
  notebook: 'rag_to_agents_lab.ipynb · Section 1.7 to 1.9, raw RAG and LangChain',
  visual: { kind: 'none' },
  message: 'Give the model the evidence and it stops guessing.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'envelope' });

const b14 = beat(1, '1.4', 'One envelope is not enough', 'sky', {
  kicker: 'The maturity ladder',
  notebook: 'rag_to_agents_lab.ipynb · Section 2 (optional trace)',
  visual: { kind: 'none' },
  message: 'RAG answers one question. Operations ask three at once.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'overflow' });

const b15 = beat(1, '1.5', 'The toolbelt', 'sky', {
  kicker: 'The toolbelt',
  notebook: 'rag_to_agents_lab.ipynb · Section 3, tools and INCIDENT_TRIAGE_SKILL',
  visual: { kind: 'none' },
  message: 'The model only sees each card’s name and description. Docstrings are prompt engineering.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'tools' });

const b16 = beat(1, '1.6', 'One query, four shapes', 'sky', {
  kicker: 'UNIFIED_SQL',
  notebook: 'rag_to_agents_lab.ipynb · Section 4, UNIFIED_SQL',
  visual: { kind: 'none' },
  message: 'No ETL, no sync, one transaction.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'unified' });

const b17 = beat(1, '1.7', 'The agent loop', 'bridge', {
  kicker: 'Agent · the Pier 3 report arrives',
  notebook: 'rag_to_agents_lab.ipynb · Section 5, the agent and the Pier 3 report',
  visual: { kind: 'flow', steps: ['recall', 'get_asset_incident_brief', 'remember', 'final'], loop: true, hot: [1] },
  message: 'The agent chooses its tools. The procedure keeps it honest.',
}, { bridge: true, markers: true });

const b18 = beat(1, '1.8', 'A sticky note', 'sky', {
  kicker: 'store_incident',
  notebook: 'rag_to_agents_lab.ipynb · Section 5.8 and 6.1',
  visual: { kind: 'none' },
  message: 'A memory, but a thin one.',
}, { pins: 'all', highlight: ['City Operations Control Center'], sky: 'note' });

const b19 = beat(1, '1.9', 'Three questions', 'pier2', {
  kicker: 'Closing Lab 2',
  notebook: 'rag_to_agents_lab.ipynb · Section 6 close',
  visual: {
    kind: 'list',
    items: ['RAG: what does the record say?', 'Workflow: triage predictably.', 'Agent: reason and tell me what to do.'],
  },
  message: 'At three o’clock we give it a real memory.',
}, { bridge: true, markers: true });

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
