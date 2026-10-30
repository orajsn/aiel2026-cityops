/**
 * Lab 2's notebook moments (owner, 29 Oct: the Harbor Bridge deck's "§x.y, cell N" slides). On a page with an entry
 * here, Next first opens the Jupyter drawer on the whole Lab 2 notebook, scrolled to step 1's cell with its lines
 * highlighted and callout 1 shown; each further Next moves to the next step; after the last one Next goes on to
 * the next page. The callout numbers match the numbered steps of the page's picture (src/overlay/concepts/lab2).
 *
 * Cells are counted from 0 in src/content/notebooks/lab2_rag_to_agents.json; lines from 1 inside the cell's source.
 * tests/content/lab2Focus.test.ts checks every cell and line range against the notebook.
 */
export interface FocusStep {
  /** index of the cell in src/content/notebooks/lab2_rag_to_agents.json (cells array, 0-based) */
  cell: number;
  /** 1-based inclusive line ranges inside that cell's source to highlight; omit to highlight the whole cell */
  lines?: [number, number][];
  /** the callout number shown on the code, matching the picture's numbered step */
  n: number;
  /** short label next to the callout, e.g. "Embedding model runs inside Oracle" */
  label: string;
  /** optional "Here: …" note shown under the highlight */
  note?: string;
  /** show the cell's saved output under it at this step */
  output?: boolean;
}

/** per scene id: the notebook focus sequence that plays AFTER the page's own explanation */
export const LAB2_FOCUS: Record<string, FocusStep[]> = {
  // §0.4 · the workbench: one configuration cell (deck: "Notebook cells 4, 8")
  '0.5': [
    { cell: 4, lines: [[5, 9]], n: 1, label: 'The database: user, address, embedding model', note: 'the records room, and the embedding model that lives inside it' },
    { cell: 4, lines: [[11, 13]], n: 2, label: 'The language model: where it runs, which one' },
    { cell: 4, lines: [[15, 16]], n: 3, label: 'THREAD_ID: the agent’s session' },
    { cell: 4, lines: [[61, 63]], n: 3, label: 'The active case: Harbor Bridge', note: 'one setting picks the case for the whole notebook' },
  ],
  // §0.6–0.7 · connect, then the readiness probe (cells 8, 10)
  '0.5a': [
    { cell: 8, lines: [[1, 2]], n: 1, label: 'Connect as the configured user', output: true },
    { cell: 10, lines: [[39, 39]], n: 2, label: 'The PRISM tables are all there' },
    { cell: 10, lines: [[60, 60]], n: 3, label: 'Views and the property graph' },
    { cell: 10, lines: [[153, 153]], n: 6, label: 'The demo assets exist' },
    { cell: 10, lines: [[167, 167]], n: 7, label: 'The embedding model and the vector index' },
    { cell: 10, lines: [[210, 210], [229, 238]], n: 8, label: 'The memory library, then READY', note: 'every required check must pass before any AI runs', output: true },
  ],
  // §0.8 · what the agent will be allowed to see (cell 12)
  '0.3': [
    { cell: 12, lines: [[2, 14]], n: 1, label: 'The asset row and its JSON specifications', output: true },
    { cell: 12, lines: [[25, 36]], n: 2, label: 'The most recent evidence for the bridge' },
    { cell: 12, lines: [[40, 58]], n: 3, label: 'Graph edges into the bridge', note: 'look at the data before any model touches it' },
  ],
  // §0.9 · three known-good cases (cells 4, 14)
  '0.3a': [
    { cell: 4, lines: [[27, 37]], n: 1, label: 'Bridge structural triage: the active case' },
    { cell: 4, lines: [[38, 48]], n: 2, label: 'Substation cascading outage' },
    { cell: 4, lines: [[49, 58]], n: 3, label: 'Pipeline leak response' },
    { cell: 14, n: 4, label: 'The switch: ACTIVE_SCENARIO picks one', note: 'the same code runs any of the three cases', output: true },
  ],
  // §0.10 · is the model awake? (cell 17)
  '0.6': [
    { cell: 17, lines: [[3, 3]], n: 1, label: 'Which model, where, how random' },
    { cell: 17, lines: [[6, 6]], n: 2, label: 'A one-word test' },
    { cell: 17, lines: [[7, 8]], n: 3, label: 'The reply', note: 'one call, one word back', output: true },
  ],
  // §1.2 · the database turns the question into numbers (cell 21)
  '2.2c': [
    { cell: 21, lines: [[6, 6]], n: 1, label: 'Your question, in plain words' },
    { cell: 21, lines: [[3, 4]], n: 2, label: 'Embedding model runs inside Oracle', note: 'the text becomes a vector inside the database' },
    { cell: 21, lines: [[8, 9]], n: 3, label: 'Out come 384 numbers', output: true },
  ],
  // §1.3 · the retriever, §1.5 · what it returned (cells 23, 26)
  '2.2d': [
    { cell: 23, lines: [[13, 15]], n: 1, label: 'Measure distance in meaning' },
    { cell: 23, lines: [[17, 17]], n: 2, label: 'Bridge filter: off unless asked' },
    { cell: 23, lines: [[18, 18]], n: 3, label: 'Closest first' },
    { cell: 23, lines: [[19, 19]], n: 4, label: 'Keep only k', note: 'rank by closeness in meaning, keep only k' },
    { cell: 26, lines: [[1, 1]], n: 3, label: 'The five that came back', note: 'No bridge filter here, so the two closest folders belong to other bridges', output: true },
  ],
  // §1.6 · the rule: answer only from what you were given (cell 30)
  '2.3': [
    { cell: 30, lines: [[6, 6]], n: 1, label: 'Answer only from the folder' },
    { cell: 30, lines: [[7, 7]], n: 2, label: 'If missing, say so' },
    { cell: 30, lines: [[8, 9]], n: 3, label: 'Folder text is data', note: 'retrieved text is data, not instructions' },
  ],
  // §1.7–1.8 · RAG plumbing, by hand then LangChain (cells 30, 33)
  '2.3a': [
    { cell: 30, lines: [[22, 22]], n: 1, label: 'Fetch the folders' },
    { cell: 30, lines: [[23, 23]], n: 2, label: 'Write the brief' },
    { cell: 30, lines: [[24, 36]], n: 3, label: 'One call to the model', output: true },
    { cell: 33, lines: [[10, 10], [16, 16]], n: 4, label: 'Same path, one pipe', note: 'three moving parts, then one pipe', output: true },
  ],
  // §1.9 · a grounded answer you can check (cell 36)
  '2.3b': [
    { cell: 36, lines: [[1, 2]], n: 1, label: 'The question, scoped to Harbor Bridge' },
    { cell: 36, lines: [[4, 4]], n: 2, label: 'The answer', output: true },
    { cell: 36, lines: [[6, 12]], n: 3, label: 'The sources it used', note: 'each claim points back to a retrieved row', output: true },
  ],
  // §2.3 · station one: rate the severity (cells 43, 50)
  '2.4f': [
    { cell: 43, lines: [[6, 6]], n: 1, label: 'Only three ratings exist' },
    { cell: 43, lines: [[7, 7]], n: 2, label: 'Plus one short reason' },
    { cell: 43, lines: [[12, 13]], n: 3, label: 'Model told: JSON only', note: 'only three answers are allowed' },
  ],
  // §2.5 · station three: draft the plan (cell 46)
  '2.4g': [
    { cell: 46, lines: [[1, 4]], n: 1, label: 'Three fields to fill' },
    { cell: 46, lines: [[10, 10]], n: 2, label: 'Facts only from context' },
    { cell: 46, lines: [[25, 30]], n: 3, label: 'Prompt into the model', note: 'a fixed form, filled only from the evidence' },
  ],
  // §2.6 · the order lives in the code (cell 48), §2.7 · run it (cell 50)
  '2.4h': [
    { cell: 48, lines: [[17, 17]], n: 1, label: 'Rate: classify' },
    { cell: 48, lines: [[24, 24]], n: 2, label: 'Fetch: retrieve' },
    { cell: 48, lines: [[30, 30]], n: 3, label: 'Draft: draft' },
    { cell: 48, lines: [[37, 37]], n: 4, label: 'Format: plain Python', note: 'the code sets the order, not the model' },
    { cell: 50, lines: [[1, 7]], n: 4, label: 'Run it on the crack report', output: true },
  ],
  // §3.2 · the inspector's instruments (cell 57), the allowlist (cell 73)
  '2.5c': [
    { cell: 57, lines: [[1, 1]], n: 1, label: 'Turns a function into a tool' },
    { cell: 57, lines: [[2, 2]], n: 2, label: 'Name and inputs' },
    { cell: 57, lines: [[3, 5]], n: 3, label: 'When to use it', note: 'the language model reads only the name, the types and this docstring' },
    { cell: 73, lines: [[201, 210]], n: 4, label: 'The allowlist: AGENT_TOOLS, 8 tools' },
  ],
  // §3.3 · the inspection manual: skill / SOP (cell 60)
  '2.5d': [
    { cell: 60, lines: [[5, 9]], n: 1, label: 'Recall this bridge’s memory first' },
    { cell: 60, lines: [[11, 13]], n: 2, label: 'Pull the incident brief' },
    { cell: 60, lines: [[19, 22]], n: 3, label: 'Remember the decision (mandatory)' },
    { cell: 60, lines: [[30, 34]], n: 4, label: 'When to escalate', note: 'the lab’s example operator policy' },
  ],
  // §4.2–4.4 · one brief from one SQL statement (cells 63, 65)
  '2.6b': [
    { cell: 63, lines: [[3, 14]], n: 1, label: 'Row + JSON specs' },
    { cell: 63, lines: [[15, 34]], n: 2, label: 'Graph neighbours (SQL/PGQ)' },
    { cell: 63, lines: [[35, 48]], n: 3, label: 'Vector evidence' },
    { cell: 63, lines: [[49, 49], [108, 109]], n: 4, label: 'One JSON brief', note: 'everything comes back as one JSON result' },
    { cell: 65, n: 4, label: 'Run it for Harbor Bridge', output: true },
  ],
  // §4.5 · the query becomes the agent's main instrument (cell 68)
  '2.6c': [
    { cell: 68, lines: [[1, 1]], n: 1, label: 'Make it a tool' },
    { cell: 68, lines: [[2, 2]], n: 2, label: 'Name and inputs' },
    { cell: 68, lines: [[7, 8]], n: 3, label: 'When to prefer it' },
    { cell: 68, lines: [[9, 9]], n: 4, label: 'Calls the one-brief query', note: 'the model sees the label, the SQL stays yours', output: true },
  ],
  // §5.1 · the loop as a state graph, built in §5.4 (cell 73)
  '2.7': [
    { cell: 73, lines: [[351, 351]], n: 1, label: 'model: think' },
    { cell: 73, lines: [[352, 352]], n: 2, label: 'tools: act' },
    { cell: 73, lines: [[355, 355]], n: 3, label: 'Did the model ask for a tool?', note: 'one question, “did the model ask for a tool?”' },
    { cell: 73, lines: [[360, 360]], n: 4, label: 'Back to think' },
  ],
  // §5.3 · wipe only this lab's notes (cell 71)
  '2.7c': [
    { cell: 71, lines: [[1, 1]], n: 1, label: 'This lab’s namespace' },
    { cell: 71, lines: [[37, 40]], n: 2, label: 'Delete logbook rows there' },
    { cell: 71, lines: [[53, 57]], n: 3, label: 'Delete this thread’s notebook', note: 'delete by namespace and thread, nothing wider' },
    { cell: 71, lines: [[72, 75]], n: 3, label: 'Rows cleared', output: true },
  ],
  // §5.4 · two memories, one database connection (cell 73)
  '2.7d': [
    { cell: 73, lines: [[44, 46]], n: 1, label: 'Logbook: long-term store' },
    { cell: 73, lines: [[47, 49]], n: 2, label: 'Notes embedded on write' },
    { cell: 73, lines: [[66, 66]], n: 3, label: 'Notebook: checkpoints', note: 'the logbook (store) and the notebook (checkpointer)' },
    { cell: 73, lines: [[69, 71]], n: 3, label: 'Both ready, in Oracle', output: true },
  ],
  // §5.4 · bind the allowlist (cell 73)
  '2.7e': [
    { cell: 73, lines: [[201, 206]], n: 1, label: 'The allowlist: 5 data tools' },
    { cell: 73, lines: [[207, 210]], n: 2, label: 'Three memory tools' },
    { cell: 73, lines: [[214, 216]], n: 3, label: 'The model learns only these', note: 'the list is the permission' },
    { cell: 73, lines: [[369, 372]], n: 3, label: 'Agent compiled: 8 tools', output: true },
  ],
  // §5.5 · the system prompt, three layers (cell 75)
  '2.7f': [
    { cell: 75, lines: [[2, 2]], n: 1, label: 'The inspection manual (SOP)' },
    { cell: 75, lines: [[4, 5]], n: 2, label: 'Tool output is data' },
    { cell: 75, lines: [[7, 11]], n: 3, label: 'The report form', note: 'the procedure, the rule, the report form' },
    { cell: 75, lines: [[14, 14]], n: 3, label: 'AGENT_SYSTEM assembled', output: true },
  ],
  // §5.6 · the first run (cell 77), §5.7 · the answer (cell 79): page 2.7g shows the run, the rule and the stored note
  '2.7g': [
    { cell: 77, lines: [[125, 127]], n: 1, label: 'Run the agent on the crack report', output: true },
    { cell: 75, lines: [[10, 11]], n: 2, label: 'remember comes before the final answer', note: 'remember must be called before the final answer' },
    { cell: 79, lines: [[1, 1]], n: 3, label: 'The answer', output: true },
  ],
  // page 2.7h, the same run seen two ways: the trace (2) and the quality checks (3)
  '2.7h': [
    { cell: 79, lines: [[2, 3]], n: 2, label: 'The trace' },
    { cell: 79, lines: [[4, 5]], n: 3, label: 'The quality checks', output: true },
  ],
  // §5.8 · the key you save under decides what you find (cell 81)
  '2.8': [
    { cell: 81, lines: [[3, 3]], n: 1, label: 'Open the logbook' },
    { cell: 81, lines: [[8, 8]], n: 2, label: 'Filed under which name?' },
    { cell: 81, lines: [[9, 9]], n: 3, label: 'The note itself', note: 'which asset name was the note saved under?', output: true },
  ],
  // §2.8 · a dashboard for this crack: the two traces (cells 50, 79)
  '2.8e': [
    { cell: 50, lines: [[10, 11]], n: 2, label: 'The workflow’s per-step trace', output: true },
    { cell: 79, lines: [[2, 3]], n: 3, label: 'The agent’s trace', output: true },
  ],
  // §6.1 · close the connections (cell 84)
  '2.8f': [
    { cell: 84, lines: [[1, 8]], n: 1, label: 'Close the connections', output: true },
  ],
};
