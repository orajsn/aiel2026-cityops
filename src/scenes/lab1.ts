import type { SceneDef } from '../engine/types';
import type { Section } from './sections';
import '../overlay/concepts/lab1/register';

/**
 * Lab 1 · AI Economics (owner, 29 Oct; V2 from the real workshop guide): the Harbor Bridge repair project. The project
 * manager gathers the facts the engineer needs with an AI assistant on OCI Enterprise AI, which participants run as
 * Seer Construction Intelligence in Hands-on 1 to 5: unstructured RAG, the semantic store, the app (3A Build or
 * 3B Launch), model routing and guardrails. Played after the Introduction and before Lab 2.
 *
 * To cut it out of the show, set WITH_LAB1 to false: the Introduction, Lab 2 and Lab 3 stay exactly as they are.
 * Everything Lab 1 has lives here, in src/overlay/concepts/lab1/ and in tests/overlay/Lab1*.
 */
export const WITH_LAB1 = true;

/** the camera holds on the whole bridge, where the Introduction ends: the story stays at Harbor Bridge, no move */
const atBridge = (id: string, title: string, overlay: string, props: object): SceneDef => ({
  id,
  chapter: 3,
  title,
  shot: 'bridge',
  world: { bridge: true },
  heldView: true,
  overlay,
  overlayProps: props as Record<string, unknown>,
});

export const lab1: SceneDef[] = [
  atBridge('1.0', 'Today’s assistant', 'L1Opening', { kicker: 'Lab 1 · Today', message: 'Today: an AI assistant for the **Harbor Bridge repair project**.' }),
  atBridge('1.1', 'The bridge needs repair', 'L1Damage', { kicker: 'The bridge needs repair', message: 'The inspection found **damage**. The engineer needs the facts to plan the repair.' }),
  atBridge('1.2', 'The data is in different places', 'L1Scattered', { kicker: 'The bridge needs repair', message: 'Three questions, and the answers are **in three different places**.' }),
  atBridge('1.3', 'One assistant', 'L1Assistant', { kicker: 'One assistant', message: 'One question goes in through **OCI Enterprise AI** and comes back with its sources.' }),
  atBridge('1.3a', 'Meet the app', 'L1App', { kicker: 'Meet the app', message: 'You will run **Seer Construction Intelligence**. Each switch is one hands-on step.' }),
  atBridge('1.4', 'What the specifications require', 'L1Specs', { kicker: 'Hands-on 1 · Unstructured RAG', message: 'Put the specification in a vector store, and the answers **cite it**.' }),
  atBridge('1.5', 'Which supplier is ready', 'L1Suppliers', { kicker: 'Hands-on 2 · Semantic Store', message: 'Ask in plain words. Get **governed data**, for this project only.' }),
  atBridge('1.6a', 'Two ways to launch', 'L1Launch', { kicker: 'Hands-on 3 · Two ways to launch', message: 'Two paths to **the same app**. Choose one.' }),
  atBridge('1.6', 'A photo from the site', 'L1SitePhoto', { kicker: 'Hands-on 3 · Test the app with a photo', message: 'A photo shows **what is visible**. It cannot prove what is safe.' }),
  atBridge('1.7', 'Does every question need the big model?', 'L1Baseline', { kicker: 'Hands-on 4 · First, the baseline', message: 'Today, **every request** goes to the multimodal model.' }),
  atBridge('1.8', 'Model routing', 'L1Routing', { kicker: 'Hands-on 4 · Model routing', message: 'Text goes to the **lower-cost model**. Photos stay on the multimodal one.' }),
  atBridge('1.9', 'Guardrails', 'L1Guardrails', { kicker: 'Hands-on 5 · Guardrails', message: 'Check every prompt **before** the model sees it.' }),
  // 1.10 · the Lab 1 recap (owner approved Flow110V2, 29 Oct): what we built, then NEXT, the crack
  atBridge('1.10', 'Lab 1 recap', 'L1Recap', {
    kicker: 'Lab 1 · What we built',
    message: 'An assistant that is **useful, affordable and safe**.',
    points: [
      { title: 'One assistant, with sources', text: 'Documents, database and site photos, answered with where each fact came from.' },
      { title: 'The right model for each question', text: 'Lower-cost for text, multimodal for photos.' },
      { title: 'Guardrails that fail closed', text: 'When in doubt it refuses; the engineer still approves.' },
    ],
    next: '**Lab 2 · RAG to Agents:** the crack. The assistant becomes an **agent**.',
  }),
];

export const LAB1_SECTIONS: Section[] = [
  { chapter: 3, name: 'The repair and its data', pages: ['1.0', '1.1', '1.2', '1.3', '1.3a'] },
  { chapter: 3, name: 'One assistant, step by step', pages: ['1.4', '1.5', '1.6a', '1.6'] },
  { chapter: 3, name: 'The right model, the right rules', pages: ['1.7', '1.8', '1.9'] },
  { chapter: 3, name: 'Closing Lab 1', pages: ['1.10'] },
];

/** what the presenter says on each Lab 1 page (the V2 drafts' captions, in English) */
export const LAB1_SCRIPT: Record<string, string> = {
  '1.0': 'Today we build an AI assistant for the Harbor Bridge repair project. It searches the specification, looks up the suppliers, and reads a site photo, using the right model for each question, behind guardrails. You will run it yourself as Seer Construction Intelligence, in five hands-on steps.',
  '1.1': 'The inspection of Harbor Bridge found damage: cracks, spalling concrete and exposed reinforcing steel. Before the engineer can plan the repair, the project manager has to gather the facts: what the specification requires, which supplier can deliver, and what the site photos show.',
  '1.2': 'The answers exist, but in three different places. The specification is a long PDF, the supplier data sits in database tables, and the delivery photos come from the site. Today someone reads, queries and looks, one by one. What if one question, in one app, could reach all three?',
  '1.3': 'The assistant in one picture. A question comes in through the app. Guardrails check it, routing picks the model, then it looks up the specification and the supplier data. The answer comes back with its sources, and the engineer decides. Each piece is one hands-on step.',
  '1.3a': 'This is the app you will run: Seer Construction Intelligence. Ask a question or pick a sample under Try a prompt. The runtime bar shows which model answered. On the right, Runtime configuration: each switch is one hands-on step, from searching the specification to the guardrails.',
  '1.4': 'Hands-on 1. The specification PDF waits in Object Storage. A data sync connector reads it into a vector store, which cuts it into chunks and embeddings. The assistant searches it with file_search, and every answer cites the specification.',
  '1.5': 'Hands-on 2. The project manager asks which supplier to use. The semantic store knows what the tables mean, NL2SQL writes the query, the app checks it stays inside this project, and the ADB MCP Server fetches the answer: status, fit score, risk level and why.',
  '1.6a': 'Hands-on 3 has two paths, and you pick one. Build runs the app on your own computer with your API key. Launch puts the packaged app on OCI Container Instances, where OCI hands it short-lived credentials, so no key sits in the image. Both reach the same app.',
  '1.6': 'Now a photo from the site: a structural-steel delivery. The assistant says what it can see, and keeps that apart from what it is only assuming. A photo cannot prove the grade, the certificate or that the steel is safe; that comes from governed data and the engineer.',
  '1.7': 'Before we change anything, we record a baseline. Right now every request, text or photo, goes to the same multimodal model, and the runtime bar says so each time. Note the model and the rough response time. Then ask: do text questions need a model that can see?',
  '1.8': 'Hands-on 4. One check decides the model: does the request carry an image? Text-only goes to the lower-cost model, photos stay on the multimodal one, and the runtime bar shows which answered. Response time is not cost, so we compare models, not claim a saving.',
  '1.9': 'Hands-on 5. Before any prompt reaches the model, OCI ApplyGuardrails checks it for prompt injection. A normal question passes. The attack is blocked, and no supplier is approved. And if the check cannot run at all, the request stops: it fails closed.',
  '1.10': 'That is Lab 1: one assistant over the documents, the database and the site photos, with its sources; the right model for each question; and guardrails that fail closed, with the engineer still approving. Next, Lab 2 takes the crack, and turns the assistant into an agent.',
};
