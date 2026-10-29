/**
 * The lab guide's notes for the Jupyter drawer (owner, 28 Oct, from the Thai block-by-block guide to
 * rag_to_agents_lab.ipynb, in English for the audience). On a page with a guide the drawer steps through the
 * notebook's blocks, landing on each section's heading with a short note (what it does, why, what to look for),
 * and through a long cell's parts, highlighting the lines each part is about. Pages without a guide step
 * through their cells to run, as before.
 *
 * A part names the line it starts on (`from`); it runs up to the next part's start, or the cell's end.
 * tests/overlay/LabGuide.test.tsx checks every block is a cell of its page's stop and every part starts on a real line.
 */
export interface GuidePart {
  /** "A · Memory": the letter and a few words */
  label: string;
  note: string;
  /** the line the part starts on */
  from: RegExp;
}

export interface GuideBlock {
  /** the notebook's code cell; the step lands on the text just above it, when there is some */
  cell: number;
  /** "5.4 Memory, tools and the graph": Lab 2's section number, then a short name; Lab 3's sections have no numbers */
  title: string;
  note: string;
  /** what the room should see when it runs */
  lookFor?: string;
  parts?: GuidePart[];
}

/** pages 3.8a and 3.8b share one stop (Part 3: view_memories and TODO 3) */
const SCOPE_GUIDE: GuideBlock[] = [
  { cell: 36, title: 'view_memories()', note: 'A read-only view of CITY_MEMORY: every row, whatever its scope. Only for looking: the AI agent reads memory scoped, not like this.' },
  { cell: 38, title: 'Sample 4 reports', note: 'Picks 4 maintenance reports, a mix of severities and assets: the same 4 every run.' },
  { cell: 39, title: 'TODO 3 · the scope', note: 'Each report goes through report_event, then a search. Set user_id to "inspector_demo", the scope they were written with. Left as None, the search finds nothing.' },
  { cell: 42, title: 'Check TODO 3', note: 'Confirms the 4 reports became searchable memories.' },
  { cell: 44, title: 'Look again', note: 'The same view, after 4 reports: 4 messages, and typed memories, only ever the SDK’s four types: fact, preference, guideline, memory.' },
];

export const LAB_GUIDE: Record<string, GuideBlock[]> = {
  // Lab 2 · rag_to_agents_lab.ipynb, from the owner's Thai block-by-block guide
  // page 2.1 · Section 0: prerequisites and the readiness probe
  '2.1': [
    { cell: 4, title: '0.4 Configuration', note: 'The lab’s one settings panel: which database, which model, and which incident to try (by default, the crack on Harbor Bridge). Change a value here, and run the cells that use it again.' },
    { cell: 6, title: '0.5 Imports and helpers', note: 'Basic tools for the notebook: show a table, tidy JSON, show the agent’s trace. extract_json pulls the JSON out of a model’s answer, even when it adds words around it. No AI yet.' },
    { cell: 8, title: '0.6 Connect to Oracle', note: 'Connects, then reads the version and the user, to prove we reached the right database.' },
    { cell: 10, title: '0.7 Readiness probe', note: 'Connecting is not enough: it checks the tables, the sample data, the graph, the embedding model and the vector index are all there, lists every problem at once, then says READY.' },
    { cell: 12, title: '0.8 What the agent can see', note: 'Before the AI reads anything, we look ourselves: the asset’s record, sample reports, and its links to other assets. Together, the evidence the AI will get.' },
    { cell: 14, title: '0.9 Known-good scenarios', note: 'The ready-made incidents to try, and which one is active. No AI here: it only shows the choice.' },
    { cell: 17, title: '0.10 Connect to Ollama', note: 'Asks the model to reply READY, to prove Ollama answers. It tests the connection, not how well the model reasons.' },
  ],
  // page 2.2 · Section 1.2 to 1.5: embeddings and the retriever
  '2.2': [
    { cell: 21, title: '1.2 Embed a query', note: 'Turns a sentence into numbers that stand for its meaning, inside Oracle. What you see is the vector’s size, not an answer.' },
    {
      cell: 23,
      title: '1.3 The retriever',
      note: 'retrieve_context takes a question and returns the passages closest in meaning. It only searches: no model yet. Four parts:',
      parts: [
        { label: 'A · Three inputs', note: 'question: what to look for. k: how many passages to bring back. asset_filter: optionally, only one asset.', from: /^def retrieve_context/ },
        { label: 'B · Compare meanings', note: 'VECTOR_DISTANCE compares the question’s vector with each passage’s. With cosine distance, smaller means closer.', from: /VECTOR_DISTANCE\(embedding/ },
        { label: 'C · One asset, if asked', note: 'When asset_filter is set, a WHERE clause keeps only that asset’s passages.', from: /WHERE asset_name = :asset/ },
        { label: 'D · The closest k', note: 'ORDER BY distance, then FETCH FIRST :k ROWS ONLY: the k nearest passages, nearest first.', from: /ORDER BY distance/ },
      ],
    },
    { cell: 26, title: '1.5 Check what came back', note: 'Check the evidence before any AI sees it: the asset, the source, the severity and the text itself, not only the score. Wrong evidence in, wrong answer out.' },
  ],
  // page 2.3 · Section 1.7 to 1.9: grounding the model
  '2.3': [
    { cell: 30, title: '1.7 RAG, the raw way', note: 'Every piece in plain sight: search, put the passages into the prompt, send it to Ollama, get the answer. The prompt says: use only these facts, say so when they are not enough, and treat the passages as data, not instructions.' },
    { cell: 33, title: '1.8 The same, with LangChain', note: 'rag_prompt | llm | StrOutputParser(): each | passes the result on to the next step. The framework tidies the code; it does not make the search any more correct.' },
    { cell: 36, title: '1.9 Ask a grounded question', note: 'The whole path at once: the answer, with the passages it used. Try it: pick one claim in the answer and find it in the sources.' },
  ],
  // page 2.4 · Section 2 (optional): the workflow
  '2.4': [
    { cell: 43, title: '2.3 The classifier', note: 'The model reads the incident and rates it routine, warning or critical, with a reason. Pydantic checks the answer has the right shape, and asks again if not: it checks the shape, not whether the rating is right.' },
    { cell: 46, title: '2.5 The drafter', note: 'With the rating and the evidence, the model drafts three things: a recommendation, its rationale, and next steps. It reuses retrieve_context: no new search code.' },
    { cell: 48, title: '2.6 Formatter and pipeline', note: 'run_workflow runs the steps in a fixed order, Classify → Retrieve → Draft → Format, and times each one. The formatter is plain Python: not every step needs a model.' },
    { cell: 50, title: '2.7 Run the workflow', note: 'One incident through the whole pipeline: the report, and a trace of each step’s time and tokens. The path is fixed: the model never picks a tool.' },
  ],
  // page 2.5 · Section 3: tools and the skill
  '2.5': [
    { cell: 55, title: '3.2 The data tools', note: '@tool turns a Python function into a tool the model can choose: it sees the name, the inputs and the docstring. The model asks; Python runs it. Here: get_asset_overview, get_connected_assets, search_incidents_semantic.' },
    { cell: 57, title: '3.2 Recent incidents', note: 'get_recent_incidents looks back by time: what happened lately. Semantic search looks by meaning: what was like this.' },
    { cell: 60, title: '3.3 The skill', note: 'INCIDENT_TRIAGE_SKILL is the agent’s procedure: recall memory, pull the brief, search more if needed, remember, then answer. Its escalation rule is the lab’s example policy, not an engineering standard.' },
  ],
  // page 2.6 · Section 4: the unified query
  '2.6': [
    {
      cell: 63,
      title: '4.3 The unified query',
      note: 'One SQL statement gathers the asset, its specifications, its links and the related reports, and returns one JSON brief. Four parts:',
      parts: [
        { label: 'A · asset', note: 'The asset and its specifications: relational rows and JSON, from one helper view.', from: /^\s*asset AS \(/ },
        { label: 'B · directed_edges, neighbors', note: 'Its links, in and out, through the property graph (SQL/PGQ).', from: /^\s*directed_edges AS \(/ },
        { label: 'C · evidence', note: 'The passages closest in meaning to the focus, for this asset: vector search with a relational filter.', from: /^\s*evidence AS \(/ },
        { label: 'D · JSON_OBJECT', note: 'All of it folded into one JSON result: relational, JSON, graph and vector, in one call.', from: /^SELECT JSON_OBJECT\(/ },
      ],
    },
    { cell: 65, title: '4.4 Run it', note: 'Fetch the brief without the agent first, to check the data side on its own: asset, specifications, graph_context, ranked_evidence.' },
    { cell: 68, title: '4.5 Wrap it as a tool', note: 'get_asset_incident_brief: the developer wrote the SQL; the model only names the asset and the focus. It never writes SQL itself.' },
  ],
  // page 2.7 · The agent loop: Section 5.3 to 5.7 (5.8 is page 2.8)
  '2.7b': [
    {
      cell: 71,
      title: '5.3 Reset',
      note: 'Memory is really stored, so an earlier run can leave notes behind. This clears the lab’s conversation state and memory notes, so the agent starts clean. The city data is not touched.',
    },
    {
      cell: 73,
      title: '5.4 Memory, tools and the graph',
      note: 'The longest cell: the agent’s memory, its tools and its graph, in eight parts.',
      parts: [
        {
          label: 'A · Two kinds of memory',
          note: 'Both live in Oracle. OracleSaver keeps each conversation’s state; OracleStore keeps notes the agent can search later, across conversations. OracleEmbeddings turns notes and queries into vectors inside the database.',
          from: /^# --- Long-term memory: OracleStore/,
        },
        {
          label: 'B · Tidy the inputs',
          note: 'The model may send a name with extra words after it, or a number written as text. canonical_asset_name and _normalize_tool_args tidy these before a tool runs.',
          from: /^def canonical_asset_name/,
        },
        {
          label: 'C · Memory tools',
          note: 'remember writes a note. recall reads this asset’s notes. recall_similar finds similar notes, on any asset.',
          from: /^def remember\(/,
        },
        {
          label: 'D · The allowed tools',
          note: 'AGENT_TOOLS is the toolbox: the model can only ask for tools on this list. They read data and write memory; none of them can close a bridge or order a repair.',
          from: /^AGENT_TOOLS = \[/,
        },
        {
          label: 'E · What the agent carries',
          note: 'AgentState: the messages so far, how many times the agent has been reminded to remember, and whether Python had to save the note itself.',
          from: /^# --- Agent state/,
        },
        {
          label: 'F · Think, then act',
          note: 'model_node decides: answer, or ask for a tool. tool_node_sequential runs the tools for real, one at a time, because they share one database cursor.',
          from: /^# --- Nodes/,
        },
        {
          label: 'G · The safety net',
          note: 'If the model answers without calling remember, enforce_remember_node reminds it, up to two times. After that, Python writes the note itself.',
          from: /^def enforce_remember_node/,
        },
        {
          label: 'H · The graph',
          note: 'StateGraph wires it together: model → tools → back to model. Ready to answer? It ends once remember was called; otherwise the safety net runs first. Compiled with both memories.',
          from: /^# --- Edges/,
        },
      ],
    },
    {
      cell: 75,
      title: '5.5 The system prompt',
      note: 'AGENT_SYSTEM puts the procedure, the safety rules and the answer format into one prompt. The answer comes back in three parts: recommendation, rationale, next_steps.',
    },
    {
      cell: 77,
      title: '5.6 Run the agent',
      note: 'run_agent sends the crack report in and keeps a trace of every tool call. render_agent_answer shows the answer; validate_agent_run checks its shape and which tools appear in the trace.',
    },
    {
      cell: 79,
      title: '5.7 The answer and the trace',
      note: 'Read the answer and the trace together: which tools the agent really used, and what came back. The quality checks are a first pass, not proof the advice is right.',
    },
  ],
  // page 2.8 · Section 5.8: the long-term memory
  '2.8': [
    { cell: 81, title: '5.8 Look in the long-term memory', note: 'store.search shows what was really saved, and whether it would help next time: the difference between an AI saying it remembers, and a record you can check.' },
  ],
  // page 2.9 · Section 6: cleanup
  '2.9': [{ cell: 84, title: '6.1 Close the connections', note: 'Closes the database connections. The data and the memories stay saved.' }],

  // Lab 3 · notebook_student_ollama.ipynb: drafted from the notebook in the same style (its sections have no numbers)
  // page 3.6 · Part 1: Oracle setup · Part 2: the embedder and the SDK
  '3.6': [
    { cell: 6, title: 'Helpers', note: 'Display helpers, the same as this afternoon’s lab: ok, show_table, print_json.' },
    { cell: 7, title: 'Configuration', note: 'The lab’s settings: the database, the embedding model ALL_MINILM_L12_V2, the language model on Ollama, and how many reports to sample.' },
    { cell: 8, title: 'connect_to_oracle()', note: 'Defines the connection; nothing runs yet. Oracle’s JSON type comes back as Python dicts and lists.' },
    { cell: 9, title: 'Connect', note: 'Opens the connection the whole lab uses.' },
    { cell: 12, title: 'Optional reset', note: 'Skip it on a first run. It wipes every CITY_* table, only to start over.' },
    { cell: 15, title: 'TODO 1 · embed()', note: 'The memory SDK needs an embedder. Fill in embed(), two lines, so text becomes a vector inside Oracle: ONNX, no outside service.' },
    { cell: 18, title: 'Check TODO 1', note: 'Runs the embedder: every text comes back as 384 numbers.' },
    { cell: 20, title: 'Start the memory SDK', note: 'OracleAgentMemory sets up its tables under the prefix CITY_*: threads, messages and memories.' },
  ],
  // page 3.7 · Part 3: the asset registry and auto-extraction · TODO 2
  '3.7': [
    { cell: 23, title: 'Load the data', note: 'Loads the maintenance logs and inspection reports the lab ships with, and finds the assets they mention.' },
    { cell: 24, title: 'Sort the assets', note: 'Puts each asset in a class from its name: bridge, substation, pipeline and so on.' },
    { cell: 25, title: 'CITY_ASSET', note: 'Creates the asset registry, a plain SQL table outside the SDK, and inserts the 26 assets.' },
    { cell: 26, title: 'Look one up', note: 'get_asset reads one row: here, Harbor Bridge.' },
    { cell: 29, title: 'TODO 2 · report_event', note: 'Two lines: build the content string, naming the asset and the inspector, then add_messages_async. Saving a message also starts the extractor.' },
    { cell: 32, title: 'Check TODO 2', note: 'Sends one real log through report_event and checks a message was saved.' },
    { cell: 34, title: 'See what landed', note: 'peek_sdk_tables shows both sides: the report word for word in CITY_MESSAGE, and the typed memories the extractor wrote in CITY_MEMORY.' },
  ],
  // pages 3.8a and 3.8b · Part 3: view_memories and TODO 3 (one stop, both pages)
  '3.8a': SCOPE_GUIDE,
  '3.8b': SCOPE_GUIDE,
  // page 3.9 · Part 4: inspection findings · TODO 4
  '3.9': [
    { cell: 47, title: 'CITY_INSPECTION_FINDING', note: 'Findings are records, not memories: their own SQL table, with category, severity and grade, and a VECTOR(384) column with an HNSW index.' },
    { cell: 48, title: 'Load the findings', note: 'Findings are already structured, so no language model here: each one is embedded and inserted.' },
    { cell: 50, title: 'TODO 4 · log_finding', note: 'One line: the finding’s vector, as array.array(\'f\', …). A plain Python list would be read as a batch of values and fail.' },
    { cell: 53, title: 'Check TODO 4', note: 'Logs a test finding and checks it landed, vector and all.' },
  ],
  // page 3.10 · Part 4: similar-finding search · TODO 5
  '3.10': [
    { cell: 55, title: 'TODO 5 · find_similar_findings', note: 'Vector similarity and relational filters in one SQL statement: the nearest in meaning, but only this asset and this category.' },
    { cell: 58, title: 'Check TODO 5', note: 'A broad search, then with the walls: only Harbor Bridge, only corrosion.' },
  ],
  // page 3.11 · Part 5: scoping, inspector and city
  '3.11': [
    { cell: 61, title: 'A private note', note: 'Mercer writes a personal note, scoped to her as the user: nobody else sees it.' },
    { cell: 62, title: 'Who sees what', note: 'Vance searches at his own scope: no trace of Mercer’s note. At city scope he finds the shared guideline for Harbor Bridge.' },
    { cell: 63, title: 'Prove it', note: 'Assertions: the scoping is enforced in the database’s SQL, not by a Python filter.' },
  ],
  // page 3.12a · Part 6: the AI agent
  '3.12a': [{ cell: 67, title: 'The system prompt', note: 'The AI agent’s system prompt, which says what it gets each turn, and the helper that calls the language model on Ollama.' }],
  // page 3.12b · Part 6: get_context_card and TODO 6
  '3.12b': [
    { cell: 69, title: 'What the context card holds', note: 'Look at a context card before using it: a summary, the topics, the relevant memories, and the recent messages.' },
    {
      cell: 71,
      title: 'TODO 6 · call_copilot',
      note: 'One AI agent turn, end to end. Two lines to write, (a) and (b); the rest is built. Seven parts:',
      parts: [
        { label: 'A · Vance’s own thread', note: 'Each inspector gets a private thread per asset; every thread of one asset shares its memory.', from: /# Pre-built: resolve this inspector's PRIVATE/ },
        { label: 'B · The asset’s record', note: 'Reads the asset from CITY_ASSET.', from: /# Pre-built: asset record from CITY_ASSET/ },
        { label: 'C · TODO 6 (a): the context card', note: 'One line: this thread’s context card, from get_context_card_async.', from: /# TODO 6 \(a\)/ },
        { label: 'D · TODO 6 (b): similar findings', note: 'One line: find_similar_findings for this report and this asset.', from: /# TODO 6 \(b\)/ },
        { label: 'E · Findings into words', note: 'The similar findings become text for the prompt.', from: /# Pre-built: format similar findings/ },
        { label: 'F · The asset’s shared memory', note: 'Facts and guidelines other inspectors left on this asset.', from: /# Pre-built: asset-pooled memory/ },
        { label: 'G · Prompt, model, save', note: 'Everything goes into one prompt; the model answers; both messages are saved, and the extractor writes new memories.', from: /# Pre-built: assemble prompt/ },
      ],
    },
    { cell: 74, title: 'Check TODO 6', note: 'One full turn on a test asset, kept apart from the real ones.' },
  ],
  // page 3.13 · Day 1: Mercer at the rust
  '3.13': [
    { cell: 77, title: 'Day 1 · Mercer asks', note: 'Mercer tells the AI agent what she sees and asks what to do: call_copilot. No earlier findings yet, so the answer is a fresh diagnosis.' },
    { cell: 79, title: 'Day 1 · the official finding', note: 'Now she is sure, so she records it with log_finding: corrosion, medium, grade C, repair within 60 days.' },
    { cell: 80, title: 'The memory after Day 1', note: 'What her turns left in CITY_MEMORY, pooled under Harbor Bridge.' },
    { cell: 82, title: 'Did she leave a guideline?', note: 'A look inside her thread for a guideline.' },
    { cell: 83, title: 'Day 1, afternoon', note: 'Mercer adds a follow-up: do the bearing repair together with the deck resurfacing.' },
  ],
  // page 3.14 · Day N: Vance at the same rust
  '3.14': [
    { cell: 85, title: 'Day N · Vance asks', note: 'A different inspector, the same asset. Vance only calls call_copilot: no handoff, yet Mercer’s finding and memory reach him.' },
    { cell: 86, title: 'The memory after Vance', note: 'The memory only grows: Mercer’s records and Vance’s, side by side under Harbor Bridge.' },
  ],
  // page 3.15 · with and without memory
  '3.15': [{ cell: 88, title: 'Without memory', note: 'The same question, to the same model, with no memory at all: compare its answer with the one Vance got.' }],
};

/** one step of a guided drawer: a block, or one of its parts */
export interface GuideStep {
  block: GuideBlock;
  part?: GuidePart;
}

/** the steps of a page's guide in order: each block, then its parts; empty when the page has no guide */
export function guideSteps(stopId: string): GuideStep[] {
  return (LAB_GUIDE[stopId] ?? []).flatMap((block) => [{ block }, ...(block.parts ?? []).map((part) => ({ block, part }))]);
}

/** the lines a part covers (0-based, end exclusive): from its own start to the next part's, or the cell's end */
export function partLines(lines: string[], part: GuidePart, parts: GuidePart[] = []): { start: number; end: number } {
  const startOf = (p: GuidePart) => lines.findIndex((l) => p.from.test(l));
  const start = startOf(part);
  const later = parts
    .map(startOf)
    .filter((s) => s > start)
    .sort((a, b) => a - b);
  return { start, end: later[0] ?? lines.length };
}
