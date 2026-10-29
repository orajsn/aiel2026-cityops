import type { SceneDef } from '../engine/types';
import type { BeatProps } from '../overlay/concepts/Beat';
import type { RecapProps } from '../overlay/concepts/Recap';
import type { L2Props } from '../overlay/concepts/lab2/parts';
import '../overlay/concepts/lab2/register';

/**
 * Lab 2 · RAG to Agents (owner, 29 Oct): the Harbor Bridge deck's storyline, chapter by chapter, in the Lab 3 design
 * language. Story, Why, §0 Setup, §1 RAG, §2 Workflow, Agent, §3 Tools, §4 Query, §5 Agent, Trust, §6 Wrap, then the
 * recap. Concept slides are WidePanel pages that build over several clicks (one overlayGroup, letter-suffixed ids);
 * notebook slides show the picture with numbered steps, then Next walks the notebook in the drawer
 * (src/content/lab2Focus.ts). Ids that kept their idea kept their id (0.3 to 0.6, 2.1 to 2.9), so the owner's saved
 * camera angles still apply; the steps after a saved page hold that angle (sameAngleAs).
 *
 * Camera: Story at the whole bridge (where the Introduction and Lab 1 end), the ideas and the notebook on the sky
 * stage over the Ops Center, what the agent can see over the city, Trust in the control room, the recap at the rust.
 */

type World = Record<string, unknown>;

export function beat(chapter: 1 | 2, id: string, title: string, shot: string, props: BeatProps, world: World = {}): SceneDef {
  return { id, chapter, title, shot, world, overlay: 'Beat', overlayProps: props as unknown as Record<string, unknown> };
}

const OPS = 'City Operations Control Center';
const NB = 'rag_to_agents_lab.ipynb';

const sky = (act: string, highlight = true): World => ({ pins: 'all', sky: act, ...(highlight ? { highlight: [OPS] } : {}) });
const PLACES = {
  bridge: { shot: 'bridge', world: { bridge: true } as World },
  ops: { shot: 'ops', world: { ops: true } as World },
} as const;

interface Page {
  id: string;
  title: string;
  overlay: string;
  props: Omit<L2Props, 'focusId'>;
  shot: string;
  world: World;
  group?: string;
  sameAngleAs?: string;
}

const page = (p: Page): SceneDef => ({
  id: p.id,
  chapter: 1,
  title: p.title,
  shot: p.shot,
  world: p.world,
  overlay: p.overlay,
  overlayGroup: p.group,
  ...(p.sameAngleAs ? { sameAngleAs: p.sameAngleAs } : {}),
  overlayProps: { ...p.props, focusId: p.id } as unknown as Record<string, unknown>,
});

const K = {
  story: 'Story · one crack',
  why: 'Why · AI needs your data',
  setup: '§0 Setup · the workbench',
  rag: '§1 RAG · the filing cabinet',
  flow: '§2 Workflow · the fixed checklist',
  agent: 'Agent · the chief inspector',
  tools: '§3 Tools · tools, skills, MCP',
  query: '§4 Query · one query, four lenses',
  build: '§5 Agent · build the agent',
  trust: 'Trust · security and observability',
  wrap: '§6 Wrap',
};

const NEXT = {
  bench: '§0.2–0.6 Lab §0: the workbench',
  embed: '§1.2 The database turns the question into numbers',
  belt: '§2.2–2.7 The lab’s four-station workflow',
  tools: '§3.2 The inspector’s instruments: tools',
  brief: '§4.2 One brief from one SQL statement',
  graph: '§5.1 The agent is a state graph',
  wipe: '§5.3 Wipe only this lab’s notes',
  dash: '§2.8 A dashboard for this crack',
  wrap: '§6.1–6.3 What you built, and where next',
};

/* ---------------- Story · one crack (at the whole bridge) ---------------- */
const story: SceneDef[] = [
  page({ id: '0.4', title: 'A crack at Harbor Bridge', overlay: 'L2Story', group: 'l2-story', ...PLACES.bridge, props: { kicker: K.story, step: 1, message: 'A crack at **Harbor Bridge**.', takeaway: 'A hairline crack: **0.12 mm wide, 85 mm long**. Small numbers, real question.' } }),
  page({ id: '0.4a', title: 'What proves it?', overlay: 'L2Story', group: 'l2-story', ...PLACES.bridge, props: { kicker: K.story, step: 2, message: 'What should operations do, and **what proves it?**', takeaway: 'Before anyone recommends anything, **five kinds of evidence** need to land in one brief.' } }),
  page({ id: '0.4b', title: 'The route for today', overlay: 'L2Story', group: 'l2-story', ...PLACES.bridge, props: { kicker: K.story, step: 3, message: 'The route for today: **eleven stops**.', takeaway: 'Every chapter starts with **the idea**, then opens the matching **notebook** section.', next: NEXT.bench } }),
];

/* ---------------- Why · AI needs your data (the sky stage) ---------------- */
const why: SceneDef[] = [
  page({ id: '2.0', title: 'Why AI needs your data', overlay: 'L2Why', group: 'l2-why', shot: 'sky', world: sky('brain'), props: { kicker: K.why, step: 1, message: 'The AI apps that work use **the data you already have**.', takeaway: 'As agents take on real work, **the right data, security and observability** stop being optional.' } }),
  page({ id: '2.0a', title: 'Four levels of AI applications', overlay: 'L2Why', group: 'l2-why', shot: 'sky', world: sky('brain'), props: { kicker: K.why, step: 2, message: 'Four levels of AI applications: **who picks the next step?**', takeaway: 'Each rung up the ladder gives the system **more freedom**, and asks more of us in control and observation.', terms: [['Chatbot → Agent', 'Levels of autonomy']] } }),
  // the bare model keeps the owner's saved push-in (2.1); its second click holds the same angle
  page({ id: '2.1', title: 'A well-read engineer', overlay: 'L2Bare', group: 'l2-bare', shot: 'sky-model', world: { pins: 'all', sky: 'model' }, props: { kicker: K.why, step: 1, message: 'A well-read engineer who has **never seen this bridge**.', takeaway: 'The language model knows **the world up to a date**. It has never seen our bridge.', terms: [['Well-read engineer', 'Large language model (LLM)'], ['Textbooks up to a date', 'Training data, fixed cutoff']] } }),
  page({ id: '2.1a', title: 'It does not know this morning', overlay: 'L2Bare', group: 'l2-bare', shot: 'sky-model', world: { pins: 'all', sky: 'model' }, sameAngleAs: '2.1', props: { kicker: K.why, step: 2, message: 'It does not even know **what was inspected this morning**.', takeaway: 'Same model, same question. The only difference is the record it **looked up first**. Retraining is slower, costlier and still not fresh.', terms: [['Left: knows nothing about this morning', 'Training cutoff'], ['Right: look it up first', 'Retrieval (RAG)']], next: NEXT.bench } }),
];

/* ---------------- §0 Setup · the workbench ---------------- */
const setup: SceneDef[] = [
  // the database page stays in the recap subset, as it was
  { recapMode: true, ...page({ id: '0.5', title: 'The workbench', overlay: 'L2Bench', group: 'l2-bench', shot: 'sky', world: { sky: 'shapes' }, props: { kicker: K.setup, step: 1, message: 'The workbench: **database, model, notebook**.', takeaway: 'The records room, the engineer on call, and **one clipboard of settings**.', terms: [['Records room', 'Oracle AI Database 26ai'], ['Engineer on call', 'the language model, served locally'], ['Clipboard of settings', 'Configuration cell §0.4']], notebook: `${NB} · §0.2–0.6, cell 4` } }) },
  page({ id: '0.5a', title: 'Check the site first', overlay: 'L2Bench', group: 'l2-bench', shot: 'sky', world: { sky: 'shapes' }, props: { kicker: K.setup, step: 2, message: 'Check the site **before work starts**.', takeaway: 'Tables, views, the property graph, the embedding model and the vector index are **all there**.', notebook: `${NB} · §0.6–0.7, cells 8, 10` } }),
  // the city's data, over the city (the owner's saved angle on 0.3)
  page({ id: '0.3', title: 'What the agent can see', overlay: 'L2Sees', group: 'l2-sees', shot: 'city', world: { pins: 'all', dataStream: true, highlight: [OPS] }, props: { kicker: K.setup, step: 1, message: 'What the agent will be **allowed to see**.', takeaway: '**Look at the data first**, before any model touches it. Later tool calls become easy to audit.', notebook: `${NB} · §0.8, cell 12` } }),
  page({ id: '0.3a', title: 'Three known-good cases', overlay: 'L2Sees', group: 'l2-sees', shot: 'city', world: { pins: 'all', dataStream: true, highlight: [OPS] }, sameAngleAs: '0.3', props: { kicker: K.setup, step: 2, message: 'Three **known-good** cases.', takeaway: 'The same code can run the substation or pipeline case by **changing one setting**.', notebook: `${NB} · §0.9, cell 14` } }),
  page({ id: '0.6', title: 'Is the model awake?', overlay: 'L2Awake', shot: 'sky', world: sky('brain'), props: { kicker: K.setup, message: 'Is **the language model** awake?', takeaway: 'Ask the model to say **READY**. If it does, the rest of the notebook can use it.', notebook: `${NB} · §0.10, cell 17`, next: NEXT.embed } }),
];

/* ---------------- §1 RAG · the filing cabinet ---------------- */
const RAG2 = { shot: 'sky', world: sky('embed'), sameAngleAs: '2.2' };
const RAG3 = { shot: 'sky', world: sky('embed'), sameAngleAs: '2.3' };
const rag: SceneDef[] = [
  page({ id: '2.2', title: 'Look it up before answering', overlay: 'L2Rag', group: 'l2-rag', ...RAG2, sameAngleAs: undefined, props: { kicker: K.rag, step: 1, message: 'Look it up before answering: **RAG**.', takeaway: 'RAG fetches **the right evidence** before answering. Retrieval quality decides answer quality.', terms: [['Filing cabinet', 'Vector index over document chunks'], ['Pulling the right folder', 'Retrieval'], ['Answering from the folder', 'Grounded generation']] } }),
  page({ id: '2.2a', title: 'Not every file', overlay: 'L2Rag', group: 'l2-rag', ...RAG2, props: { kicker: K.rag, step: 2, message: 'Handing over **every file** is not the answer.', takeaway: 'You do not need all the data. You need **the right data at the right moment**.', terms: [['Every bridge file at once', 'Naive prompt stuffing'], ['Labelled folders', 'Chunking'], ['The 5 most relevant', 'Top-k retrieval']] } }),
  page({ id: '2.2b', title: 'Retrieval quality is everything', overlay: 'L2Rag', group: 'l2-rag', ...RAG2, props: { kicker: K.rag, step: 3, message: 'Retrieval quality is **everything**.', takeaway: 'Most bad RAG answers start with **the wrong folder**, not the wrong model.', next: NEXT.embed } }),
  page({ id: '2.2c', title: 'The question becomes numbers', overlay: 'L2Embed', ...RAG2, props: { kicker: K.rag, message: 'The database turns the question **into numbers**.', takeaway: 'The question becomes **384 numbers**, computed inside Oracle, with no outside service.', terms: [['A label for each folder', 'Embedding vector · VECTOR_EMBEDDING']], notebook: `${NB} · §1.2, cell 21` } }),
  page({ id: '2.2d', title: 'The five closest folders', overlay: 'L2Nearest', ...RAG2, props: { kicker: K.rag, message: 'Take the five folders **closest in meaning**.', takeaway: 'No bridge filter here, so **the two closest folders belong to other bridges**.', terms: [['Closest folders', 'Cosine distance · top-k']], notebook: `${NB} · §1.3, cell 23 · §1.5, cell 26` } }),
  page({ id: '2.3', title: 'Answer only from the folder', overlay: 'L2Rule', ...RAG3, sameAngleAs: undefined, props: { kicker: K.rag, message: 'The rule: answer **only from what you were given**.', takeaway: 'Two lines of the system prompt do **the grounding**, and one of them is a small defense against prompt injection.', terms: [['Folder text is data', 'Prompt-injection defense']], notebook: `${NB} · §1.6, cell 30` } }),
  page({ id: '2.3a', title: 'RAG plumbing', overlay: 'L2Plumbing', ...RAG3, props: { kicker: K.rag, message: 'RAG plumbing: **by hand, then LangChain**.', takeaway: 'Fetch the folders, write the brief, phone the engineer. LangChain writes the same thing as **one pipe**.', notebook: `${NB} · §1.7–1.8, cells 30, 33` } }),
  page({ id: '2.3b', title: 'An answer you can check', overlay: 'L2Check', ...RAG3, props: { kicker: K.rag, message: 'A grounded answer **you can check**.', takeaway: 'Each claim in the answer **points back to a retrieved row**. If one did not, you would see it.', notebook: `${NB} · §1.9, cell 36` } }),
  page({ id: '2.4', title: 'A question is not a job', overlay: 'L2Job', group: 'l2-job', ...RAG3, world: sky('overflow'), props: { kicker: K.rag, step: 1, message: 'A question is **not a job**.', takeaway: 'A lookup is **one retrieval and one LLM call**.', terms: [['A lookup', 'One retrieval + one LLM call']] } }),
  page({ id: '2.4a', title: 'A job hides three jobs', overlay: 'L2Job', group: 'l2-job', ...RAG3, world: sky('overflow'), props: { kicker: K.rag, step: 2, message: 'A real question **hides three jobs**.', takeaway: 'Compare over time, cross-check a second source, then **make a judgment**: more than one lookup.', terms: [['A lookup', 'One retrieval + one LLM call'], ['A job', 'Workflow or agent']] } }),
  page({ id: '2.4b', title: 'Something has to coordinate', overlay: 'L2Job', group: 'l2-job', ...RAG3, world: sky('overflow'), props: { kicker: K.rag, step: 3, message: 'Something has to **coordinate it all**.', takeaway: 'RAG can contribute pieces. **A workflow or an agent** coordinates them.', terms: [['A lookup', 'One retrieval + one LLM call'], ['A job', 'Workflow or agent']], next: NEXT.belt } }),
];

/* ---------------- §2 Workflow · the fixed checklist ---------------- */
const FLOW = { shot: 'sky', world: sky('brain') };
const flow: SceneDef[] = [
  page({ id: '2.4c', title: 'Who chooses the next step?', overlay: 'L2Pen', group: 'l2-pen', ...FLOW, props: { kicker: K.flow, step: 1, message: 'Who chooses **the next step?**', takeaway: 'The real difference between the three is **who decides what happens next**. In a workflow, each step is decided in advance.', terms: [['Fixed inspection checklist', 'LLM-driven workflow'], ['Supervisor signs off', 'Human-in-the-loop gate (not in the lab)']] } }),
  page({ id: '2.4d', title: 'Anatomy of a workflow', overlay: 'L2Pen', group: 'l2-pen', ...FLOW, props: { kicker: K.flow, step: 2, message: 'Anatomy of an **LLM-driven workflow**.', takeaway: 'Every exit is **designed in advance**: success, human review, replan, or abort.', terms: [['Every exit planned', 'Success · review · replan · abort']], next: NEXT.belt } }),
  page({ id: '2.4e', title: 'A four-station conveyor belt', overlay: 'L2Conveyor', ...FLOW, props: { kicker: K.flow, message: 'A **four-station** conveyor belt.', takeaway: 'Drafting took about **25 of the 32 seconds**: the model writes one token at a time. The trace shows what ran.', terms: [['Cost per word read and written', 'Tokens: tok_in, tok_out'], ['Everything visible', 'Trace · audit log']], notebook: `${NB} · §2.2–2.7, cell 50` } }),
  page({ id: '2.4f', title: 'Station one: rate the severity', overlay: 'L2Station1', ...FLOW, props: { kicker: K.flow, message: 'Station one: **rate the severity**.', takeaway: 'Pydantic checks the answer’s **shape**, not whether the rating is right.', notebook: `${NB} · §2.3, cell 43 · §2.7, cell 50` } }),
  page({ id: '2.4g', title: 'Station three: draft the plan', overlay: 'L2Station3', ...FLOW, props: { kicker: K.flow, message: 'Station three: **draft the plan**.', takeaway: 'The drafter fills **a fixed form**: recommendation, rationale, next steps.', notebook: `${NB} · §2.5, cell 46` } }),
  page({ id: '2.4h', title: 'The order lives in the code', overlay: 'L2Order', ...FLOW, props: { kicker: K.flow, message: 'The order **lives in the code**.', takeaway: 'Four calls, always in this order. **Deterministic means the path**, not the words.', notebook: `${NB} · §2.6, cell 48 · §2.7, cell 50`, next: NEXT.tools } }),
];

/* ---------------- Agent · the chief inspector ---------------- */
const agent: SceneDef[] = [
  page({ id: '2.4i', title: 'When the problem keeps changing', overlay: 'L2Chief', group: 'l2-chief', ...FLOW, props: { kicker: K.agent, step: 1, message: 'When the problem **keeps changing**.', takeaway: 'A fixed checklist **cannot grow new branches** by itself.', terms: [['Chief inspector', 'Agent']] } }),
  page({ id: '2.4j', title: 'The loop it runs', overlay: 'L2Chief', group: 'l2-chief', ...FLOW, props: { kicker: K.agent, step: 2, message: 'The chief inspector runs **a loop**.', takeaway: 'Look, pick a tool, read the result, **decide again**.', terms: [['Chief inspector', 'Agent'], ['Look, pick, read, decide', 'Agent loop']] } }),
  page({ id: '2.4k', title: 'What the chief inspector does', overlay: 'L2Chief', group: 'l2-chief', ...FLOW, props: { kicker: K.agent, step: 3, message: 'Then it **signs the recommendation**.', takeaway: 'The on-site chief inspector looks, picks a tool, reads the result, decides again, and **signs the recommendation**.', terms: [['Chief inspector', 'Agent'], ['Look, pick, read, decide', 'Agent loop']] } }),
  page({ id: '2.4l', title: 'Three ways agents are used', overlay: 'L2Ways', ...FLOW, props: { kicker: K.agent, message: 'Three ways **agents are used**.', takeaway: 'Each mode changes the loop and how much memory it needs. **A framework runs the loop** so you do not maintain it yourself: in the lab, LangGraph.', terms: [['Plumbing', 'Tool schemas · retries · state · tracing'], ['The site crew', 'Agent framework (lab: LangGraph)']], next: NEXT.tools } }),
];

/* ---------------- §3 Tools · tools, skills, MCP ---------------- */
const TOOLS = { shot: 'sky', world: sky('tools', false) };
const tools: SceneDef[] = [
  page({ id: '2.5', title: 'Tools: the hands', overlay: 'L2Toolkit', group: 'l2-toolkit', ...TOOLS, props: { kicker: K.tools, step: 1, message: '**Tools** are the hands.', takeaway: 'The language model asks for a call; **the framework runs it**.', terms: [['Hands', 'Tools · callable functions']] } }),
  page({ id: '2.5a', title: 'Skills: the procedure', overlay: 'L2Toolkit', group: 'l2-toolkit', ...TOOLS, props: { kicker: K.tools, step: 2, message: 'A **skill** is the procedure.', takeaway: 'The manual’s table of contents is always in the truck; **the chapter comes out when the job needs it**.', terms: [['Hands', 'Tools · callable functions'], ['SOP', 'Skills · progressive disclosure']] } }),
  page({ id: '2.5b', title: 'MCP: the standard plug', overlay: 'L2Toolkit', group: 'l2-toolkit', ...TOOLS, props: { kicker: K.tools, step: 3, message: 'Hands, a procedure, **a standard plug**.', takeaway: 'An agent is **only as good as what it can reach**. MCP is a standard plug.', terms: [['Hands', 'Tools · callable functions'], ['SOP', 'Skills · progressive disclosure'], ['Standard plug', 'MCP (design option)']], next: NEXT.tools } }),
  page({ id: '2.5c', title: 'The inspector’s instruments', overlay: 'L2Instruments', ...TOOLS, props: { kicker: K.tools, message: 'The inspector’s instruments: **tools**.', takeaway: 'The language model chooses which instrument to use; **the framework actually uses it**.', terms: [['Instruments', 'Tools (@tool)'], ['The label on each instrument', 'Docstring'], ['A toolbox with only approved instruments', 'Allowlist']], notebook: `${NB} · §3.2, cell 57 · §5.4, cell 73` } }),
  page({ id: '2.5d', title: 'The inspection manual', overlay: 'L2Manual', ...TOOLS, props: { kicker: K.tools, message: 'The inspection manual: **skill / SOP**.', takeaway: 'A skill is the inspection manual: **the order of checks**, the evidence needed, and when to escalate.', terms: [['Inspection manual', 'Skill / SOP in the system prompt']], notebook: `${NB} · §3.3, cell 60`, next: NEXT.brief } }),
];

/* ---------------- §4 Query · one query, four lenses ---------------- */
const QUERY = { shot: 'sky', world: sky('unified', false) };
const query: SceneDef[] = [
  page({ id: '2.6', title: 'Why one query', overlay: 'L2OneQuery', group: 'l2-query', ...QUERY, props: { kicker: K.query, step: 1, message: 'Four systems mean **four copies to keep in sync**.', takeaway: 'Rows, JSON, graph and vectors in four places: **ETL, sync jobs, stale copies**.' } }),
  page({ id: '2.6a', title: 'One database, four lenses', overlay: 'L2OneQuery', group: 'l2-query', ...QUERY, props: { kicker: K.query, step: 2, message: 'Why **one query**.', takeaway: 'No ETL between systems, no sync jobs, no stale copies: **one consistency boundary**.', terms: [['Four lenses on one record', 'Relational · JSON · SQL/PGQ graph · vector']] } }),
  page({ id: '2.6b', title: 'One brief from one statement', overlay: 'L2Brief', ...QUERY, props: { kicker: K.query, message: 'One brief from **one SQL statement**.', takeaway: 'Relational row, JSON specs, graph neighbours and vector evidence: **one statement, one transaction**.', terms: [['Four lenses', 'Relational · JSON · SQL/PGQ graph · vector']], notebook: `${NB} · §4.2–4.4, cells 63, 65` } }),
  page({ id: '2.6c', title: 'The agent’s main instrument', overlay: 'L2Main', ...QUERY, props: { kicker: K.query, message: 'The query becomes **the agent’s main instrument**.', takeaway: 'The docstring tells the model when to reach for it: **when it needs the whole picture**.', notebook: `${NB} · §4.5, cell 68`, next: NEXT.graph } }),
];

/* ---------------- §5 Agent · build the agent ---------------- */
const BUILD = { shot: 'sky', world: sky('brain') };
const build: SceneDef[] = [
  page({ id: '2.7', title: 'The agent is a state graph', overlay: 'L2Graph', ...BUILD, props: { kicker: K.build, message: 'The agent is **a state graph**.', takeaway: 'Yes: run the tool and loop back to the model. No: finish. **That cycle is the whole agent.**', terms: [['The inspector’s loop', 'LangGraph StateGraph: model ⇄ tools']], notebook: `${NB} · §5.1 · §5.4, cell 73` } }),
  page({ id: '2.7a', title: 'Two memories', overlay: 'L2Memories', group: 'l2-memories', ...BUILD, props: { kicker: K.build, step: 1, message: 'Two memories, **one database**.', takeaway: 'One notebook for this visit, **one permanent logbook** with an index, both on one database.', terms: [['Visit notebook', 'Short-term memory · checkpointer'], ['Bridge logbook', 'Long-term memory · store']] } }),
  page({ id: '2.7b', title: 'Memory needs a lifecycle', overlay: 'L2Memories', group: 'l2-memories', ...BUILD, props: { kicker: K.build, step: 2, message: 'Memory needs **a lifecycle**.', takeaway: 'Without a lifecycle, an agent will happily act on **stale facts**.', terms: [['Visit notebook', 'Short-term memory · checkpointer'], ['Bridge logbook', 'Long-term memory · store']], next: NEXT.wipe } }),
  page({ id: '2.7c', title: 'Wipe only this lab’s notes', overlay: 'L2Wipe', ...BUILD, props: { kicker: K.build, message: 'Wipe **only this lab’s** notes.', takeaway: 'Clear this visit’s notebook and this lab’s logbook pages. **The city records are not touched.**', notebook: `${NB} · §5.3, cell 71` } }),
  page({ id: '2.7d', title: 'Two memories, one connection', overlay: 'L2StoreSaver', ...BUILD, props: { kicker: K.build, message: 'Two memories, **one database connection**.', takeaway: 'Notes are **embedded inside the database** when written, and found again by meaning.', notebook: `${NB} · §5.4, cell 73` } }),
  page({ id: '2.7e', title: 'Bind the allowlist', overlay: 'L2Allowlist', ...BUILD, props: { kicker: K.build, message: 'Bind **the allowlist**.', takeaway: 'The model is told about these **eight instruments only**. There is no ninth.', notebook: `${NB} · §5.4, cell 73 (tools)` } }),
  page({ id: '2.7f', title: 'The system prompt', overlay: 'L2Layers', ...BUILD, props: { kicker: K.build, message: 'The system prompt: **three layers**.', takeaway: 'The manual, a safety rule, and the report template, **stacked into one brief**.', notebook: `${NB} · §5.5, cell 75` } }),
  page({ id: '2.7g', title: 'What the agent did', overlay: 'L2FirstRun', group: 'l2-run', ...BUILD, props: { kicker: K.build, step: 1, message: 'What the agent **actually did** (saved run).', takeaway: 'Five tool calls, then the answer. **remember came before the final JSON**, as the prompt requires.', notebook: `${NB} · §5.5, cell 75 · §5.6, cell 77` } }),
  page({ id: '2.7h', title: 'The trace and the checks', overlay: 'L2FirstRun', group: 'l2-run', ...BUILD, props: { kicker: K.build, step: 2, message: 'The trace and **the quality checks**.', takeaway: 'The trace shows what the agent did. **The checks catch what it got wrong.**', notebook: `${NB} · §5.6, cell 77 · §5.7, cell 79` } }),
  page({ id: '2.8', title: 'The key you save under', overlay: 'L2Drawer', ...BUILD, props: { kicker: K.build, message: 'The key you save under **decides what you find**.', takeaway: 'Memory is a retrieval problem: **the key you save under** decides whether you find it again.', terms: [['Filed in the wrong drawer', 'Memory namespace key: asset_name']], notebook: `${NB} · §5.8, cell 81`, next: NEXT.dash } }),
];

/* ---------------- Trust · security and observability (the control room) ---------------- */
const trust: SceneDef[] = [
  page({ id: '2.8a', title: 'A fake warning sign', overlay: 'L2Risks', group: 'l2-risks', ...PLACES.ops, props: { kicker: K.trust, step: 1, message: 'Three risks, told with the bridge: **a fake warning sign**.', takeaway: 'Orders hidden in content can be **stored now and triggered later**.', terms: [['A fake warning sign', 'Prompt injection']] } }),
  page({ id: '2.8b', title: 'Keys to every gate', overlay: 'L2Risks', group: 'l2-risks', ...PLACES.ops, props: { kicker: K.trust, step: 2, message: 'Three risks, told with the bridge: **keys to every gate**.', takeaway: 'Too many permissions, and **attackers borrow them**.', terms: [['A fake warning sign', 'Prompt injection'], ['Keys to every gate', 'Excessive agency']] } }),
  page({ id: '2.8c', title: 'An unverified tool', overlay: 'L2Risks', group: 'l2-risks', ...PLACES.ops, props: { kicker: K.trust, step: 3, message: 'Three risks, told with the bridge: **an unverified tool**.', takeaway: 'The lab does not demonstrate these attacks. Three real guardrails are useful, and **not a complete security boundary**.', terms: [['A fake warning sign', 'Prompt injection'], ['Keys to every gate', 'Excessive agency'], ['An unverified tool', 'Malicious component']] } }),
  page({ id: '2.8d', title: 'Observability', overlay: 'L2Observe', ...PLACES.ops, props: { kicker: K.trust, message: 'The site’s CCTV and time log: **observability**.', takeaway: 'Without the camera and the time log, you cannot tell whether the agent is **slow, expensive, or wrong**.', terms: [['CCTV and time log', 'Observability'], ['Agents rarely crash', 'Behavioral drift']], next: NEXT.dash } }),
  page({ id: '2.8e', title: 'A dashboard for this crack', overlay: 'L2Dashboard', ...PLACES.ops, props: { kicker: K.trust, message: 'A dashboard **for this crack**.', takeaway: 'Real numbers from the saved run, plus a drift line that is **a concept, not data**.', terms: [['Cost per word read and written', 'Tokens: tok_in, tok_out'], ['Time per station', 'Latency per step']], notebook: `${NB} · §2.8 · cells 50, 79`, next: NEXT.wrap } }),
];

/* ---------------- §6 Wrap ---------------- */
const wrap: SceneDef[] = [
  page({ id: '2.8f', title: 'Pick the tool that fits', overlay: 'L2Pick', ...PLACES.ops, props: { kicker: K.wrap, message: 'Pick the tool that **fits the job**.', takeaway: 'Do not reach for an agent because agents are interesting. Reach for it **when the route must be chosen**.', terms: [['Simplest tool that works', 'RAG → Workflow → Agent']], notebook: `${NB} · §6.1, cell 84`, next: NEXT.wrap } }),
];

// 2.9 · the Lab 2 recap (owner approved Flow29V3, 29 Oct): what we built, then NEXT, the rust (a drawing, not a photo)
const recap: SceneDef = {
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

/** Lab 2's chapters in show order (the jump menu's sections, sections.ts) */
export const LAB2_CHAPTERS: { name: string; pages: SceneDef[] }[] = [
  { name: 'Story · one crack', pages: story },
  { name: 'Why AI needs your data', pages: why },
  { name: '§0 The workbench', pages: setup },
  { name: '§1 RAG: the filing cabinet', pages: rag },
  { name: '§2 Workflow: the fixed checklist', pages: flow },
  { name: 'Agent: the chief inspector', pages: agent },
  { name: '§3 Tools, skills, MCP', pages: tools },
  { name: '§4 One query, four lenses', pages: query },
  { name: '§5 Build the agent', pages: build },
  { name: 'Trust: security and observability', pages: trust },
  { name: '§6 Wrap-up', pages: wrap },
  { name: 'Closing Lab 2', pages: [recap] },
];

export const chapter1: SceneDef[] = LAB2_CHAPTERS.flatMap((c) => c.pages);
