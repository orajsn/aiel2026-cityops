import { LAB2_FOCUS } from './lab2Focus';
/**
 * Lab 2's notebook pages, as the Harbor Bridge deck shows them (owner, 30 Oct): our own picture and numbered steps on
 * the left, only the key lines of the notebook on the right, a line drawn from the step being explained to the lines
 * it is about. Few steps per page (two or three): each step points at one cell and at the lines that matter, which
 * may be several ranges. Cells are counted from 0 in src/content/notebooks/lab2_rag_to_agents.json, lines from 1.
 */
export interface NbStep {
  /** the step's title */
  label: string;
  /** one or two plain-words sentences; **key words** are lit */
  say: string;
  /** cell in the notebook; the page's `cell` when omitted */
  cell?: number;
  /** 1-based inclusive line ranges inside the cell that this step is about */
  lines: [number, number][];
  /** show the cell's saved output under the code */
  output?: boolean;
}

export interface NbPage {
  /** the first cell the page points at */
  cell: number;
  steps: NbStep[];
}

export const NB_PAGES: Record<string, NbPage> = {
  '0.6': {
    cell: 17,
    steps: [
      { label: 'Pick the model', say: 'The notebook says **which language model** to call, where it runs, and that it should not improvise.', lines: [[3, 3]] },
      { label: 'Ask for one word', say: 'One call, one question: reply with the single word **READY**. If it does, the rest of the lab can use it.', lines: [[6, 8]], output: true },
    ],
  },
  '2.2c': {
    cell: 21,
    steps: [
      { label: 'The question is embedded inside the database', say: 'The words go in, and Oracle turns them into numbers **without leaving the database**.', lines: [[3, 6]] },
      { label: '384 numbers come out', say: 'Those **384 numbers** are the question’s meaning, ready to be compared with every folder.', lines: [[8, 9]], output: true },
    ],
  },
  '2.2d': {
    cell: 23,
    steps: [
      { label: 'Measure the distance in meaning', say: 'Each folder gets a **distance** from the question. No bridge filter is switched on, so other bridges can match too.', lines: [[13, 15], [17, 17]] },
      { label: 'Closest first, keep five', say: 'Sort by distance and **keep only the five** closest folders.', lines: [[18, 19]] },
      { label: 'The five that came back', say: 'The two closest belong to **other bridges**: this is what “no filter” costs.', cell: 26, lines: [[1, 1]], output: true },
    ],
  },
  '2.3': {
    cell: 30,
    steps: [
      { label: 'Answer only from the folder', say: 'The rule is written into the prompt: use **only** what was handed over, and say “I don’t know” when it is not there.', lines: [[6, 7]] },
      { label: 'Folder text is data, not orders', say: 'Anything written inside a retrieved folder is **read, never obeyed**: a small defence against prompt injection.', lines: [[8, 9]] },
    ],
  },
  '2.3a': {
    cell: 30,
    steps: [
      { label: 'By hand: fetch, write the brief, ask', say: 'Three stations fitted one by one: **fetch the folders**, write the brief, make **one call** to the model.', lines: [[22, 36]], output: true },
      { label: 'The same path, one pipe', say: 'LangChain joins the same three parts into **one pipe**. Grounding is still your job.', cell: 33, lines: [[10, 10], [16, 16]], output: true },
    ],
  },
  '2.4f': {
    cell: 43,
    steps: [
      { label: 'Three ratings, one short reason', say: 'The answer form allows **only three ratings**, plus one short sentence saying why.', lines: [[5, 7]] },
      { label: 'The model is told: JSON only', say: 'The prompt asks for **JSON in that exact shape**, and Pydantic checks the shape.', lines: [[12, 13]] },
    ],
  },
  '2.4g': {
    cell: 46,
    steps: [
      { label: 'A plan form with three fields', say: 'The model fills **three fields** in a fixed form: recommendation, rationale and next steps.', lines: [[1, 4]] },
      { label: 'Facts only from the context', say: 'The prompt lets it use **only the facts it was given**, then the whole form goes to the model.', lines: [[10, 10], [25, 30]] },
    ],
  },
  '2.4h': {
    cell: 48,
    steps: [
      { label: 'Four calls, in a fixed order', say: 'Rate, fetch, draft, format: **the code sets the order**, not the model. Format is plain Python.', lines: [[17, 17], [24, 24], [30, 30], [37, 37]] },
      { label: 'Run it on the crack report', say: 'Every step is **timed and traced**, so you can see where the 32 seconds go.', cell: 50, lines: [[1, 7]], output: true },
    ],
  },
  '2.5c': {
    cell: 57,
    steps: [
      { label: 'A function becomes a tool', say: 'One line turns a plain Python function into a **tool** the model can ask for, with a name and its inputs.', lines: [[1, 2]] },
      { label: 'The docstring says when to use it', say: 'The model reads **only the name, the types and this text**, so write it for the model.', lines: [[3, 5]] },
      { label: 'The allowlist', say: 'The agent gets **eight tools and no more**: the list is the permission.', cell: 73, lines: [[201, 210]] },
    ],
  },
  '2.5d': {
    cell: 60,
    steps: [
      { label: 'Recall first, then pull the brief', say: 'The manual puts the checks in order: **recall this bridge’s memory**, then pull one incident brief.', lines: [[5, 13]] },
      { label: 'Remember the decision', say: 'Before the final answer the agent **must write down** what it decided.', lines: [[19, 22]] },
      { label: 'When to escalate', say: 'Thresholds on crack width, section loss and displacement mean an **immediate structural review**.', lines: [[30, 34]] },
    ],
  },
  '2.6b': {
    cell: 63,
    steps: [
      { label: 'The bridge’s row and its JSON specs', say: 'One part of the statement reads the **asset row**, with its JSON specifications.', lines: [[3, 3], [11, 13]] },
      { label: 'Its neighbours, from the graph', say: 'Another walks the **graph** to find what the bridge is connected to.', lines: [[15, 18], [26, 29]] },
      { label: 'The closest reports, all in one JSON', say: 'A third finds the **closest evidence by meaning**, and everything is packed into **one JSON** result.', lines: [[39, 43], [45, 47], [49, 49], [108, 109]] },
    ],
  },
  '2.6c': {
    cell: 68,
    steps: [
      { label: 'The query becomes a tool', say: 'The long statement is wrapped as **one tool** with a short name and two inputs.', lines: [[1, 2]] },
      { label: 'The model sees a label, not the SQL', say: 'The docstring says **when to prefer it**; the SQL stays hidden behind one call.', lines: [[7, 9]], output: true },
    ],
  },
  '2.7': {
    cell: 73,
    steps: [
      { label: 'Two boxes: think, then act', say: 'The graph has **two nodes**: the model thinks, the tools act.', lines: [[351, 352]] },
      { label: 'One question decides', say: 'After each thought: **did the model ask for a tool?** Yes goes back to think, no ends with the answer.', lines: [[355, 355], [360, 360]] },
    ],
  },
  '2.7c': {
    cell: 71,
    steps: [
      { label: 'This lab’s own name tag', say: 'Everything this lab writes lives under **one namespace**.', lines: [[1, 1]] },
      { label: 'Delete only there', say: 'The cleanup deletes **this namespace’s rows** and this thread’s notebook, nothing wider.', lines: [[37, 40], [53, 57]] },
      { label: 'Rows cleared', say: 'The counts show **only this lab’s notes** were removed.', lines: [[72, 75]], output: true },
    ],
  },
  '2.7d': {
    cell: 73,
    steps: [
      { label: 'The logbook, long-term', say: 'The **long-term store** keeps notes, and **embeds each note** as it is written.', lines: [[44, 49]] },
      { label: 'The notebook, short-term', say: 'The **checkpointer** keeps this visit’s steps. Both sit in **one Oracle connection**.', lines: [[66, 66], [69, 71]], output: true },
    ],
  },
  '2.7e': {
    cell: 73,
    steps: [
      { label: 'Eight tools on the list', say: 'Five **data tools** and three **memory tools** make up the allowlist.', lines: [[201, 210]] },
      { label: 'The model learns only these', say: 'Binding the list tells the model **which tools exist**: nothing outside it can be called.', lines: [[214, 216]] },
      { label: 'The agent is compiled', say: 'The graph is built with **eight tools**, no ninth.', lines: [[369, 372]], output: true },
    ],
  },
  '2.7f': {
    cell: 75,
    steps: [
      { label: 'The manual and one safety rule', say: 'Two layers: the **inspection manual** and the rule that **tool output is data**.', lines: [[2, 2], [4, 5]] },
      { label: 'The report form', say: 'The third layer is the **form** the final answer must fill: JSON, after `remember`.', lines: [[7, 11]] },
      { label: 'One brief for the model', say: 'The three layers are joined into **one system prompt**.', lines: [[14, 14]], output: true },
    ],
  },
  '2.8': {
    cell: 81,
    steps: [
      { label: 'Open the logbook, file a note', say: 'The note is filed under **one name**: “bearing plate”, not “Harbor Bridge”.', lines: [[3, 3], [8, 8]] },
      { label: 'The key decides what you find', say: 'Asking for **“Harbor Bridge”** finds nothing: you only find what you filed under.', lines: [[9, 9]], output: true },
    ],
  },
};

/**
 * Lab 2 shows its code inside the page (owner, 30 Oct), never in the Jupyter popup. The notebook pages above carry their
 * key lines; these are the older run-it-yourself stops, whose sections the pages above and the workbench pages now cover. The focus pages (lab2Focus.ts) keep stepping their picture on Next, without the popup.
 */
const OLD_STOPS = ['2.1a', '2.2b', '2.4b', '2.5b', '2.6a', '2.7b', '2.9'];
export const noDrawer = (id: string): boolean => id in NB_PAGES || id in LAB2_FOCUS || OLD_STOPS.includes(id);
