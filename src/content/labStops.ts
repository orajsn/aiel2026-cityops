import lab2 from './notebooks/lab2_rag_to_agents.json';
import lab3Student from './notebooks/lab3_student.json';

/**
 * The lab guide's stops: on these pages the audience goes to JupyterLab and runs cells. Each stop is a slice of a
 * notebook (cells copied as they are, never changed) with the cells to run marked in order. Cells are counted
 * from 0 in the .ipynb; the screen never shows those numbers (Jupyter shows none either until a cell runs),
 * it shows the cells themselves so people find them by their first line.
 *
 * Success lines (`expect`) are what the cell's ok() or print() writes, with "…" where the value is only known
 * after a real run. tests/overlay/JupyterDrawer.test.tsx checks each against the cell's own code.
 */
export interface NotebookCell {
  type: 'code' | 'markdown' | 'raw';
  source: string;
}
export interface Notebook {
  file: string;
  cells: NotebookCell[];
}
/** run: run it as it is · todo: fill in, then run · check: the checkpoint that proves the TODO · skip: optional, not now */
export type MarkRole = 'run' | 'todo' | 'check' | 'skip';
export interface CellMark {
  cell: number;
  role: MarkRole;
  todo?: number;
  /** the line the cell prints when it worked (its ok() or print), as the audience will see it */
  expect?: string;
  /** one short line for the audience */
  say?: string;
  /** what the cell does, in a few words, for the page's "what the cells do" list (HandsOn.tsx, CellBrief) */
  brief?: string;
}
export interface LabStop {
  notebook: Notebook;
  /** where in the notebook, in the notebook's own words */
  where: string;
  from: number;
  to: number;
  marks: CellMark[];
  minutes: string;
  /** the notebook marks the section optional */
  optional?: boolean;
}

export const LAB2 = lab2 as Notebook;
export const LAB3_STUDENT = lab3Student as Notebook;

/** the screen never names the notebooks' city (CLAUDE.md); everything else is shown as the notebook has it */
export const screenSafe = (text: string) => text.replace(/(mythical )?city of Kirkland/g, 'city').replace(/Kirkland/g, 'the city');

const run = (cell: number, expect?: string, say?: string): CellMark => ({ cell, role: 'run', expect, say });

/* ---------- Lab 2 · RAG to Agents (rag_to_agents_lab.ipynb, no TODOs: every cell runs as it is) ---------- */
const L2: Record<string, LabStop> = {
  // page 1 · The bare model: set up first
  '2.1': {
    notebook: LAB2,
    where: 'Section 0: Prerequisites and readiness probe',
    from: 1,
    to: 18,
    minutes: 'about 5 min',
    marks: [
      run(4, 'Configuration complete: Bridge structural triage -> Harbor Bridge'),
      run(6, 'Helpers loaded: show_table, print_json, extract_json, show_trace, ok, _usage_of, _json_default'),
      run(8, 'Connected to Oracle as PRISM'),
      run(10, 'READY: … checks passed', 'The readiness probe: every row should say pass.'),
      run(12, 'OK, done!', 'What the agent can see: the asset, its chunks, its graph edges.'),
      run(14, 'Active scenario: Bridge structural triage -> Harbor Bridge'),
      run(17, 'Ollama reachable: model=…'),
    ],
  },
  // page 2 · Text becomes a point
  '2.2': {
    notebook: LAB2,
    where: 'Section 1: RAG, grounded · 1.2 to 1.5',
    from: 19,
    to: 27,
    minutes: 'about 3 min',
    marks: [
      run(21, 'The ALL_MINILM_L12_V2 embedding model is active, and has 384 dimensions.'),
      run(23, 'Retrieved 3 chunks; top distance = …'),
      run(26, 'Retrieval is complete.', 'The five reports the search found, nearest first.'),
    ],
  },
  // page 3 · Grounding
  '2.3': {
    notebook: LAB2,
    where: 'Section 1: RAG, grounded · 1.6 to 1.10',
    from: 28,
    to: 38,
    minutes: 'about 4 min',
    marks: [
      run(30, 'Answer complete.', 'RAG the raw way: retrieval, a prompt and one call.'),
      run(33, 'LangChain RAG chain ready: rag_prompt, rag_chain, rag_answer'),
      run(36, 'Question complete.', 'The grounded answer, with the sources it used.'),
    ],
  },
  // page 4 · One folder is not enough: the notebook's optional workflow section
  '2.4': {
    notebook: LAB2,
    where: 'OPTIONAL: Section 2: LLM-driven workflow',
    from: 40,
    to: 52,
    minutes: 'about 4 min',
    optional: true,
    marks: [
      run(43, 'Classifier ready: Triage, CLASSIFY_PROMPT, classify_incident()'),
      run(46, 'Drafter defined: Draft, DRAFT_PROMPT, draft_response()'),
      run(48, 'Workflow defined: format_report, run_workflow (4 nodes)'),
      run(50, 'Done!', 'The workflow on a real incident, with a per-step trace.'),
    ],
  },
  // page 5 · Tools and the skill
  '2.5': {
    notebook: LAB2,
    where: 'Section 3: Tools and skills',
    from: 53,
    to: 60,
    minutes: 'about 3 min',
    marks: [
      run(55, 'Core data tools ready: get_asset_overview, get_connected_assets, search_incidents_semantic'),
      run(57, 'get_recent_incidents ready'),
      run(60, 'Skill loaded: INCIDENT_TRIAGE_SKILL (… chars)', 'The skill: the SOP the agent follows.'),
    ],
  },
  // page 6 · One query, four shapes
  '2.6': {
    notebook: LAB2,
    where: 'Section 4: The marquee unified query',
    from: 61,
    to: 68,
    minutes: 'about 3 min',
    marks: [
      run(63, 'Unified query defined: UNIFIED_SQL, get_asset_incident_brief_raw()'),
      run(65, 'Done!', 'One query: relational, JSON, graph and vector, one brief back.'),
      run(68, 'get_asset_incident_brief @tool defined; sanity invoke succeeded'),
    ],
  },
  // page 7 · The agent loop
  // §5.1–5.7, run it yourself: on the memories page (2.7b), before the focus pages walk the cells one by one
  '2.7b': {
    notebook: LAB2,
    where: 'Section 5: Build the agent with LangGraph + Ollama · 5.1 to 5.7',
    from: 69,
    to: 79,
    minutes: 'about 6 min',
    marks: [
      run(71, 'Done!', 'Resets the demo state, so the agent starts clean.'),
      run(73, 'Agent compiled: … tools, sequential executor, …'),
      run(75, 'Agent system prompt assembled (… chars)'),
      run(77, 'First turn complete.', 'The agent’s first turn: it takes a minute or two.'),
      run(79, 'Agent run complete!', 'The answer, the trace of tool calls, and the quality checks.'),
    ],
  },
  // page 8 · A sticky note
  '2.8': {
    notebook: LAB2,
    where: 'Section 5 · 5.8 Peek at the long-term memory store',
    from: 80,
    to: 82,
    minutes: 'about 1 min',
    marks: [run(81, 'Done!', 'What the agent chose to remember, kept in the database.')],
  },
  // page 9 · Three questions: the end of Lab 2
  '2.9': {
    notebook: LAB2,
    where: 'Section 6: Cleanup and wrap-up',
    from: 83,
    to: 85,
    minutes: 'under 1 min',
    marks: [run(84, 'Oracle connections closed. End of workshop.')],
  },
};

/* ---------- Lab 3 · Agent Memory (notebook_student_ollama.ipynb, TODO 1 to 6) ---------- */
const scope: LabStop = {
  notebook: LAB3_STUDENT,
  where: 'Part 3 · Helper: view the memories · TODO 3',
  from: 35,
  to: 44,
  minutes: 'about 4 min',
  marks: [
    run(36, 'Helper ready: view_memories(user_id=, record_type=, thread_id=, newest_first=, limit=)'),
    run(38, 'Sampled narratives (asset, severity):', 'Four narratives go in; the language model extracts what is worth keeping.'),
    { cell: 39, role: 'todo', todo: 3, say: 'One line: replace None with the right user_id.' },
    { cell: 42, role: 'check', expect: 'TODO 3 passed - … memories extracted from 4 narratives' },
    run(44, undefined, 'Peek at the tables again, after four narratives.'),
  ],
};

const L3: Record<string, LabStop> = {
  // page 15 · One connection
  '3.6': {
    notebook: LAB3_STUDENT,
    where: 'Part 1: Oracle Setup · Part 2: The Embedder and SDK',
    from: 4,
    to: 20,
    minutes: 'about 5 min',
    marks: [
      { ...run(6, 'Helpers loaded: ok, show_table, print_json'), brief: 'Load the helpers' },
      { ...run(7, 'Config ready: db=prism@aidbfree:1521/FREEPDB1  |  onnx=ALL_MINILM_L12_V2  |  llm=…  |  narratives=4'), brief: 'Set the database and both models' },
      { ...run(8, undefined, 'No output: it only defines connect_to_oracle().'), brief: 'Define connect_to_oracle()' },
      { ...run(9, 'Connected - using user prism'), brief: 'Connect to Oracle' },
      { cell: 12, role: 'skip', say: 'Skip on your first run. Only to start over.' },
      { cell: 15, role: 'todo', todo: 1, say: 'Fill in embed(): two lines. Stuck? Open the answer below it.', brief: 'TODO 1: embed(), text to a vector' },
      { cell: 18, role: 'check', expect: 'TODO 1 passed - embedder returns float32 (n, 384) arrays', brief: 'Check TODO 1: 384 numbers per text' },
      { ...run(20, 'OracleAgentMemory ready. Tables under prefix CITY_*'), brief: 'Start the memory SDK: CITY_* tables' },
    ],
  },
  // page 16 · The write path
  '3.7': {
    notebook: LAB3_STUDENT,
    where: 'Part 3: City Asset Registry + Auto-Extraction · TODO 2',
    from: 21,
    to: 34,
    minutes: 'about 5 min',
    marks: [
      { ...run(23, 'Loaded … maintenance logs, … inspection reports.'), brief: 'Load the logs and inspection reports' },
      { ...run(24, 'Asset class distribution: …'), brief: 'Sort the assets into classes' },
      { ...run(25, 'Inserted 26 rows into CITY_ASSET.'), brief: 'Create CITY_ASSET: 26 assets' },
      { ...run(26, undefined, 'Prints the Harbor Bridge row.'), brief: 'Look up Harbor Bridge’s row' },
      { cell: 29, role: 'todo', todo: 2, say: 'Two lines: build the content string, then call add_messages_async.', brief: 'TODO 2: report_event saves a report' },
      { cell: 32, role: 'check', expect: 'TODO 2 passed - added message(s): …', brief: 'Check TODO 2 on one real log' },
      { ...run(34, undefined, 'Shows what got persisted: CITY_MESSAGE and CITY_MEMORY rows.'), brief: 'See what landed in both tables' },
    ],
  },
  // pages 17 and 18 · Scope is the key (one stop, both pages)
  '3.8a': scope,
  '3.8b': scope,
  // page 19 · The system of record
  '3.9': {
    notebook: LAB3_STUDENT,
    where: 'Part 4: Inspection Findings + Similar-Finding Search · TODO 4',
    from: 45,
    to: 53,
    minutes: 'about 4 min',
    marks: [
      run(47, 'CITY_INSPECTION_FINDING created with VECTOR(384) embedding column.'),
      run(48, 'Inserted 15 findings into CITY_INSPECTION_FINDING.'),
      { cell: 50, role: 'todo', todo: 4, say: 'One line: embed the description and wrap it in array.array(\'f\', ...).' },
      { cell: 53, role: 'check', expect: 'TODO 4 passed - finding_id=…' },
    ],
  },
  // page 20 · Vector search with walls
  '3.10': {
    notebook: LAB3_STUDENT,
    where: 'Part 4 · TODO 5: similar-finding search',
    from: 54,
    to: 58,
    minutes: 'about 4 min',
    marks: [
      { cell: 55, role: 'todo', todo: 5, say: 'Write the SQL string: about seven lines.' },
      { cell: 58, role: 'check', expect: 'TODO 5 passed - broad=…, asset-filtered=…, category-filtered=…' },
    ],
  },
  // page 21 · Private doors, shared hall
  '3.11': {
    notebook: LAB3_STUDENT,
    where: 'Part 5: Scoping - Inspector vs City',
    from: 59,
    to: 64,
    minutes: 'about 2 min',
    marks: [
      run(61, 'Mercer wrote one personal memory and one city-wide memory.'),
      run(62, undefined, 'Vance searches: 0 hits behind Mercer’s door, at least 1 in the shared hall.'),
      run(63, 'Multi-tenancy verified: Vance sees city-wide guidelines but NOT Mercer\'s personal notes.'),
    ],
  },
  // page 22 · The copilot turn
  '3.12a': {
    notebook: LAB3_STUDENT,
    where: 'Part 6: The CityOps Copilot - End-to-End',
    from: 65,
    to: 67,
    minutes: 'under 1 min',
    marks: [run(67, undefined, 'No output: it sets up the system prompt and the chat call.')],
  },
  // page 23 · The context card
  '3.12b': {
    notebook: LAB3_STUDENT,
    where: 'Part 6 · get_context_card · TODO 6',
    from: 68,
    to: 74,
    minutes: 'about 5 min',
    marks: [
      run(69, 'Raw context-card output - this is the XML the agent LLM will see:'),
      { cell: 71, role: 'todo', todo: 6, say: 'Two lines: (a) the context card, (b) similar past findings.' },
      { cell: 74, role: 'check', expect: 'TODO 6 passed - copilot ran end-to-end' },
    ],
  },
  // page 24 · Day 1: Mercer at the rust
  '3.13': {
    notebook: LAB3_STUDENT,
    where: 'The Cross-Inspector Handoff Scenario · Day 1',
    from: 75,
    to: 83,
    minutes: 'about 4 min',
    marks: [
      run(77, 'DAY 1, step 1: Mercer calls call_copilot for diagnostic help'),
      run(79, 'Logged finding … - now searchable by future call_copilot invocations.'),
      run(80, undefined, 'The memory log after Mercer’s Day-1 visit.'),
      run(82, undefined, 'Did Mercer’s turn leave a guideline?'),
      run(83, 'DAY 1 (afternoon): Mercer follow-up note'),
    ],
  },
  // page 25 · Day 2: Vance at the same rust
  '3.14': {
    notebook: LAB3_STUDENT,
    where: 'The Cross-Inspector Handoff Scenario · Day N',
    from: 84,
    to: 86,
    minutes: 'about 2 min',
    marks: [
      run(85, 'DAY N: Inspector Vance on Harbor Bridge (never met Mercer)'),
      run(86, undefined, 'The memory log after Vance: both inspectors’ records, nothing overwritten.'),
    ],
  },
  // page 26 · With and without memory
  '3.15': {
    notebook: LAB3_STUDENT,
    where: 'Compare: Vance With And Without Memory',
    from: 87,
    to: 88,
    minutes: 'about 2 min',
    marks: [run(88, 'WITHOUT MEMORY (stateless LLM):', 'The same question, without memory and with it.')],
  },
};

export const LAB_STOPS: Record<string, LabStop> = { ...L2, ...L3 };

export interface StopCell {
  index: number;
  cell: NotebookCell;
  mark?: CellMark;
  /** 1, 2, 3… for the cells to run, in order; none for skipped cells and text */
  run?: number;
}

export function stopCells(stop: LabStop): StopCell[] {
  let n = 0;
  const out: StopCell[] = [];
  for (let i = stop.from; i <= stop.to; i++) {
    const cell = stop.notebook.cells[i];
    if (!cell) continue;
    const mark = stop.marks.find((m) => m.cell === i);
    out.push({ index: i, cell: { ...cell, source: screenSafe(cell.source) }, mark, run: mark && mark.role !== 'skip' ? ++n : undefined });
  }
  return out;
}

/**
 * The lines of a TODO cell where people type: its own "# TODO n" comment (a mention of another TODO is not one) and the placeholder lines right under it
 * (comments, `pass`, `name = None`), or a line that carries "<-- TODO n" itself. Ready-made code is left alone.
 */
export function todoLines(lines: string[], todo: number): Set<number> {
  const mine = new RegExp(`#.*\\bTODO ${todo}\\b`);
  const out = new Set<number>();
  let open = false;
  // inside a placeholder string to write into (sql = """ … YOUR SQL HERE … """)
  let inString = false;
  lines.forEach((line, i) => {
    if (mine.test(line)) {
      out.add(i);
      open = /^\s*#/.test(line);
      return;
    }
    if (inString) {
      out.add(i);
      if (/("""|''')/.test(line)) inString = open = false;
      return;
    }
    if (!open) return;
    if (/^\s*#\s*Pre-built/i.test(line)) open = false;
    else if (/^\s*\w+\s*=\s*[fr]?("""|''')\s*$/.test(line)) {
      out.add(i);
      inString = true;
    } else if (/^\s*#/.test(line) || /^\s*pass\s*$/.test(line) || /^\s*\w+\s*=\s*(None|\[\]|\{\}|"")\s*(#.*)?$/.test(line)) out.add(i);
    else if (line.trim()) open = false;
  });
  return out;
}
