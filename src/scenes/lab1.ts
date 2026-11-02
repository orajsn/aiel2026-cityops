import type { SceneDef } from '../engine/types';
import type { Section } from './sections';
import '../overlay/concepts/lab1/register';

/**
 * Lab 1 · AI Economics (owner, 29 Oct; V2 from the real workshop guide): the Harbor Bridge repair project. The project
 * manager gathers the facts the engineer needs with an AI assistant on OCI Enterprise AI, which participants run as
 * Seer Construction Intelligence in Hands-on 1 to 5: unstructured RAG, the semantic store, the app (launched
 * on OCI), model routing and guardrails. Played after the Introduction and before Lab 2.
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

/**
 * 1.0 to 1.2 work like Lab 3's opening pages (owner, 2 Nov): the camera closes in on the crack, a real character stands
 * there with the label, and one panel on the right carries the message and steps. One camera for the three pages.
 */
const atCrack = (id: string, title: string, props: object, who: string): SceneDef => ({
  id,
  ...(id === '1.0' ? {} : { sameAngleAs: '1.0' }),
  chapter: 3,
  title,
  shot: 'pier3',
  world: { bridge: true, inspect: { pier: 'pier3', who } },
  overlay: id === '1.0' ? 'L1Crack' : id === '1.1' ? 'L1Plan' : 'L1Capture',
  overlayProps: props as Record<string, unknown>,
});

export const lab1: SceneDef[] = [
  atCrack('1.0', 'A crack starts a project', { kicker: 'Lab 1 · The bridge needs repair', message: 'A crack. A question. **A repair project.**' }, 'character-male-b'),
  atCrack('1.1', 'Plan the repair', { kicker: 'Lab 1 · Plan the repair', message: 'Turn the observation **into a project.**' }, 'character-male-b'),
  atCrack('1.2', 'Capture the steel delivery', { kicker: 'Lab 1 · Capture the delivery', message: 'The technician adds **evidence from the site.**' }, 'character-male-e'),
  atBridge('1.3', 'One assistant', 'L1Assistant', { kicker: 'One assistant', message: 'One question goes in through **OCI Enterprise AI** and comes back with its sources.' }),
  atBridge('1.3a', 'Meet the app', 'L1App', { kicker: 'Meet the app', message: 'You will run **Seer Construction Intelligence**. Each switch is one hands-on step.' }),
  atBridge('1.4', 'What the specifications require', 'L1Specs', { kicker: 'Hands-on 1 · Unstructured RAG', message: 'Put the specification in a vector store, and the answers **cite it**.' }),
  atBridge('1.5', 'Which supplier is ready', 'L1Suppliers', { kicker: 'Hands-on 2 · Semantic Store', message: 'Ask in plain words. Get **governed data**, for this project only.' }),
  atBridge('1.6a', 'Launch the app', 'L1Launch', { kicker: 'Hands-on 3 · Launch the app', message: 'Launch the packaged app **on OCI**. No key is stored.' }),
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
  '1.0': 'The project manager walks the deck of Harbor Bridge and notices a crack near a pier, hairline, about 0.12 millimetres. It is recorded as an issue and a repair project starts. Evidence comes first: the engineer assesses the damage before anything is approved.',
  '1.1': 'Now the project manager turns the observation into a project: define the scope, specify the materials, schedule the delivery, and send it to the engineer for review. To plan well, the project needs specifications, supplier records and evidence from the site.',
  '1.2': 'The technician adds evidence from the site. One photo of the steel delivery joins the project documents and data. Three kinds of evidence: a specification, which is a document; supplier records, which are database records; and a delivery photo, which is an image.',
  '1.3': 'The assistant in one picture. A question comes in through the app. Guardrails check it, routing picks the model, then it looks up the specification and the supplier data. The answer comes back with its sources, and the engineer decides. Each piece is one hands-on step.',
  '1.3a': 'This is the app you will run: Seer Construction Intelligence. Ask a question or pick a sample under Try a prompt. The runtime bar shows which model answered. On the right, Runtime configuration: each switch is one hands-on step, from searching the specification to the guardrails.',
  '1.4': 'Hands-on 1. The specification PDF waits in Object Storage. A data sync connector reads it into a vector store, which cuts it into chunks and embeddings. The assistant searches it with file_search, and every answer cites the specification.',
  '1.5': 'Hands-on 2. The project manager asks which supplier to use. The semantic store knows what the tables mean, NL2SQL writes the query, the app checks it stays inside this project, and the ADB MCP Server fetches the answer: status, fit score, risk level and why.',
  '1.6a': 'Hands-on 3 launches the packaged app on OCI Container Instances from Cloud Shell. OCI hands it short-lived credentials through a resource principal, so no key sits in the image. The app opens with the same three stores from Hands-on 1 and 2.',
  '1.6': 'Now a photo from the site: a structural-steel delivery. The assistant says what it can see, and keeps that apart from what it is only assuming. A photo cannot prove the grade, the certificate or that the steel is safe; that comes from governed data and the engineer.',
  '1.7': 'Before we change anything, we record a baseline. Right now every request, text or photo, goes to the same multimodal model, and the runtime bar says so each time. Note the model and the rough response time. Then ask: do text questions need a model that can see?',
  '1.8': 'Hands-on 4. One check decides the model: does the request carry an image? Text-only goes to the lower-cost model, photos stay on the multimodal one, and the runtime bar shows which answered. Response time is not cost, so we compare models, not claim a saving.',
  '1.9': 'Hands-on 5. Before any prompt reaches the model, OCI ApplyGuardrails checks it for prompt injection. A normal question passes. The attack is blocked, and no supplier is approved. And if the check cannot run at all, the request stops: it fails closed.',
  '1.10': 'That is Lab 1: one assistant over the documents, the database and the site photos, with its sources; the right model for each question; and guardrails that fail closed, with the engineer still approving. Next, Lab 2 takes the crack, and turns the assistant into an agent.',
};
