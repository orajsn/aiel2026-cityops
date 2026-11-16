import completeNotebook from './notebooks/senayan/lab3_complete.json';
import { highlightPython, type TokenKind } from '../overlay/jupyter/highlight';

/**
 * Lab 3's coding part as one map (owner, 4 Nov; drafted on the canvas "Lab 3 Code Map"): one page, the map and then the notebook's Parts 1 to 6
 * and the two days, in the order the code runs. Each Next flies the map to a node while a real notebook window scrolls to that part of the
 * code: its lines stay, the key lines light up, the rest fades. The window IS the owner's run notebook, notebook_complete_ollama.ipynb
 * (notebooks/lab3_complete.json): its own text, line numbers, execution counts and printed results, nothing changed or added.
 */

export type MapNode = 'inspector' | 'copilot' | 'prompt' | 'model' | 'answer' | 'scope' | 'embedder' | 'message' | 'extractor' | 'memory' | 'finding' | 'asset';
export type MapLine = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'read' | 'l' | 'n' | 'g' | 'h' | 'o' | 'q' | 'r' | 'u' | 'confirm';

export interface MapCam {
  s: number;
  cx: number;
  cy: number;
}
interface CodeSection {
  cell: number;
  from: string;
  to: string;
  keys: string[];
  /** tint every line of the block, not only its key lines (owner, 4 Nov: highlight the whole block) */
  all?: boolean;
  /** the lines of the cell's printed result that stay lit with it */
  out?: string | string[];
}
export interface MapStep {
  title: string;
  /** the whole map, full width, no notebook (the first step) */
  wide?: boolean;
  cam: MapCam;
  /** a guide stop: a picture (the JupyterLab screen with this part lit, or the notebook's extraction diagram) instead of the map and the notebook window */
  guide?: 'file' | 'code' | 'run' | 'extract';
  /** the numbering (owner, 4 Nov): the notebook's own Part, or the story's day; a part with two clicks is 3a, 3b on the buttons */
  tag?: string;
  rail: string;
  ask: string;
  plain: string;
  /** what the notebook prints */
  see?: string;
  /** the lit nodes; none: everything at full strength */
  nodes?: MapNode[];
  lines: MapLine[];
  /** the Oracle AI Database lane itself is the subject (Part 1): it lights while every node in it stays pale */
  lane?: boolean;
  /** the person on the Inspector card on this step */
  who?: 'mercer' | 'vance';
  code?: CodeSection & { extra?: string };
}

const ALL: MapCam = { s: 0.44, cx: 960, cy: 545 };

export const MAP_STEPS: MapStep[] = [
  { title: 'The whole map', rail: 'Map', wide: true, cam: { s: 0.82, cx: 960, cy: 545 }, ask: 'Everything in today’s notebook is on this one map.', plain: 'One turn of the AI agent runs along the top. Everything it remembers sits in one database underneath. We walk it in the order the code runs.', lines: [] },
  // Part 0 (colleague's note, 4 Nov): how to open the notebook and run a cell, on a real JupyterLab screenshot; one thing lit per click
  { title: 'Open the notebook', rail: '0', tag: 'PART 0', guide: 'file', cam: { s: 0.82, cx: 960, cy: 545 }, ask: 'First, open the notebook.', plain: 'In the file list, open agent_memory and double-click notebook_complete_ollama.ipynb.', lines: [] },
  { title: 'Open the notebook', rail: '0', tag: 'PART 0', guide: 'code', cam: { s: 0.82, cx: 960, cy: 545 }, ask: 'This is where the code is.', plain: 'Each box is a cell. Click inside one to select it: the blue bar on its left shows which cell you are on.', lines: [] },
  { title: 'Open the notebook', rail: '0', tag: 'PART 0', guide: 'run', cam: { s: 0.82, cx: 960, cy: 545 }, ask: 'Run the cell.', plain: 'Click Run, or press Shift + Enter. The cell runs and the next one is selected.', lines: [] },
  { title: 'Oracle setup', rail: '1a', tag: 'PART 1', cam: { s: 0.5, cx: 960, cy: 710 }, ask: 'Where does everything live?', plain: 'One filing room, not five. These few settings name the database, the embedding model and the language model.', see: 'Config ready: db=prism@aidbfree:1521/FREEPDB1  |  onnx=ALL_MINILM_L12_V2  |  llm=llama3.2  |  narratives=4', nodes: [], lane: true, lines: [], code: { cell: 6, from: '# Oracle AI Database 26ai', to: 'OLLAMA_MODEL    =', keys: ['DB_USER     =', 'DB_DSN      =', 'ONNX_MODEL  =', 'OLLAMA_BASE_URL =', 'OLLAMA_MODEL    ='], out: 'Config ready' } },
  { title: 'Oracle setup', rail: '1b', tag: 'PART 1', cam: { s: 0.5, cx: 960, cy: 710 }, ask: 'Did it connect to the database?', plain: 'One connection opens the database. If you see this line, you are in, and everything after this uses the same connection.', see: 'Connected - using user prism', nodes: [], lane: true, lines: [], code: { cell: 6, from: 'def connect_to_oracle', to: 'ok(f"Connected', keys: ['return oracledb.connect', 'vector_conn = connect_to_oracle', 'ok(f"Connected'], out: 'Connected - using user' } },
  { title: 'The embedder', rail: '2a', tag: 'PART 2', cam: { s: 1.0, cx: 440, cy: 720 }, ask: 'How do you search by meaning?', plain: 'Text becomes 384 numbers, like an address on a map of meaning. Reports that mean the same thing land close together.', see: 'TODO 1 passed - embedder returns float32 ((1, 384)) arrays', nodes: ['embedder'], lines: ['o', 'q', 'u'], code: { cell: 12, from: 'def embed(self', to: 'return np.asarray', keys: ['vectors = self.provider', 'return np.asarray'], out: 'TODO 1 passed' } },
  { title: 'The memory SDK', rail: '2b', tag: 'PART 2', cam: { s: 1.0, cx: 440, cy: 720 }, ask: 'Who keeps the memory?', plain: 'The memory SDK sits on that same connection and sets up its own tables, with the embedder doing the numbers.', see: 'OracleAgentMemory ready. Tables under prefix CITY_*', nodes: ['embedder'], lines: [], code: { cell: 14, from: 'memory = OracleAgentMemory(', to: 'table_name_prefix', keys: ['connection=vector_conn', 'extract_memories=True', 'table_name_prefix'], out: 'OracleAgentMemory ready' } },
  // Part 3 is three clicks (owner, 4 Nov): the asset table, the extraction (its picture first, then the code), the memory it writes
  { title: 'City assets', rail: '3a', tag: 'PART 3a', cam: { s: 1.0, cx: 560, cy: 640 }, ask: 'Which assets are we talking about?', plain: 'Before any memory, the AI agent needs to know what exists. The code reads two data files and finds 26 city assets, Harbor Bridge among them.', see: 'Loaded 308 maintenance logs, 60 inspection reports. Discovered 26 unique assets.', nodes: ['asset'], lines: [], code: { cell: 17, from: '_data_dir = Path(', to: 'print(f"Discovered', keys: [], all: true, out: ['Loaded', 'Discovered'] } },
  { title: 'Auto-extraction', rail: '3b', tag: 'PART 3b', guide: 'extract', cam: { s: 0.82, cx: 960, cy: 545 }, ask: 'What happens to a new message?', plain: "It is filed word for word in CITY_MESSAGE. The extractor reads it, with the running thread summary and the past memories, and may write several typed records into CITY_MEMORY. Inspect their count and fidelity.", lines: [] },
  { title: 'Auto-extraction', rail: '3b', tag: 'PART 3b', cam: { s: 1.05, cx: 1160, cy: 610 }, ask: 'How does a report get filed?', plain: 'Two lines do it: build the content string, then add_messages_async. Saving the message is also what starts the extractor.', see: "TODO 2 passed - added message(s): ['b9dc2ca1-f704-4756-9c42-c3d59bea58f4']", nodes: ['message', 'extractor'], lines: ['g', 'h'], code: { cell: 20, from: 'content = f"[Asset', to: 'add_messages_async([Message(role="user", content=content)', keys: ['content = f"[Asset', 'add_messages_async([Message(role="user", content=content)'], out: 'TODO 2 passed' } },
  { title: 'Peek at the tables', rail: '3b', tag: 'PART 3b', cam: { s: 1.0, cx: 1360, cy: 610 }, ask: 'What did the extractor write?', plain: 'A small helper prints the rows of both tables for one thread: the message word for word, and the cards the extractor wrote from it.', see: 'CITY_MESSAGE - 1 row(s) for thread=smoke_thread', nodes: ['message', 'memory'], lines: [], code: { cell: 22, from: 'def peek_sdk_tables', to: 'print(f"   [{mtype:10}]', keys: ['FROM CITY_MESSAGE', 'FROM CITY_MEMORY'], out: ['CITY_MESSAGE - 1 row', 'CITY_MEMORY - 2 row'] } },
  { title: 'Run four reports', rail: '3b', tag: 'PART 3b', cam: { s: 1.05, cx: 1160, cy: 610 }, ask: 'What happens with more reports?', plain: 'The same call runs on four sampled reports, each filed into one thread, so the extractor has more to work with.', see: 'Sampled narratives (asset, severity):', nodes: ['message', 'extractor'], lines: ['g', 'h'], code: { cell: 26, from: 'narratives = sample_narratives', to: 'thread_id="inspect_demo"', keys: ['narratives = sample_narratives', 'await report_event('], out: 'Sampled narratives' } },
  { title: 'Finding a memory', rail: '3c', tag: 'PART 3c', cam: { s: 1.1, cx: 1560, cy: 600 }, ask: 'Why did the search come back empty?', plain: "This SDK search requires a user_id. Use the recorded writer’s scope and inspect the returned records; a missing required identifier is a validation error.", see: 'TODO 3 passed - 14 memories extracted from 4 narratives', nodes: ['memory'], lines: [], code: { cell: 28, from: 'results = await', to: 'max_results', keys: ['user_id="inspector_demo"'], out: 'TODO 3 passed' } },
  { title: 'The official record', rail: '4a', tag: 'PART 4', cam: { s: 0.9, cx: 460, cy: 790 }, ask: 'What is a finding, if it is not a memory?', plain: "Keep an extracted memory separate from the finding explicitly recorded by the inspector. Inspect the finding row and its embedding.", see: 'TODO 4 passed - finding_id=2e80d8fa-551', nodes: ['finding', 'embedder'], lines: ['o', 'q'], code: { cell: 37, from: 'finding_id = str(uuid', to: 'vec = array', keys: ['vec = array'] } },
  { title: 'Search with walls', rail: '4b', tag: 'PART 4', cam: { s: 1.0, cx: 640, cy: 800 }, ask: 'Nearest in meaning, but only this bridge?', plain: 'One SQL statement does both: the closest in meaning, inside the walls of this asset and this category.', see: 'TODO 5 passed - broad=5, asset-filtered=5, category-filtered=4', nodes: ['finding'], lines: [], code: { cell: 41, from: 'SELECT finding_id', to: 'FETCH FIRST', keys: ['VECTOR_DISTANCE', 'WHERE (:asset_id', 'AND (:category'] } },
  { title: 'Who sees what', rail: '5', tag: 'PART 5', cam: { s: 1.1, cx: 660, cy: 410 }, ask: 'Why can Vance not read Mercer’s private note?', plain: "Compare the scoped queries: Vance should not retrieve Mercer’s personal note, while the shared guideline is available in its allowed scope. Inspect both results.", see: "Updated scope assertion: run this cell in your lab to generate results.", nodes: ['scope'], lines: ['e', 'f'], code: { cell: 46, from: '# Inspector Vance searches at user scope', to: 'max_results=10', keys: ['vance_personal = await', 'user_id="Jordan_Vance"'], out: ['Updated scope assertion'] } },
  { title: 'One whole turn', rail: '6', tag: 'PART 6', cam: { s: 1.2, cx: 660, cy: 280 }, ask: 'What does the AI agent actually read?', plain: 'Two lines fetch it: its context card and the similar findings. Then it all goes into one prompt: ask, save.', see: 'TODO 6 passed - copilot ran end-to-end', nodes: ['copilot'], lines: [], code: { cell: 54, from: 'card = await', to: 'similar = find_similar', keys: ['card = await', 'similar = find_similar'], out: 'TODO 6 passed' } },
  { title: 'Day 1, step 1: Mercer asks', rail: 'Day 1a', tag: 'DAY 1', cam: ALL, ask: 'Mercer calls call_copilot for diagnostic help.', plain: 'She types what she sees on Harbor Bridge. The AI agent searches what is already known and reasons about it. Her turn is saved, and the extractor keeps what matters.', see: 'DAY 1, step 1: Mercer calls call_copilot for diagnostic help', who: 'mercer', nodes: ['inspector', 'copilot', 'scope', 'embedder', 'asset', 'message', 'extractor', 'memory', 'prompt', 'model', 'answer'], lines: ['a', 'e', 'f', 'g', 'h'], code: { cell: 57, from: 'MERCER_NOTES = await call_copilot(', to: 'asset_id="Harbor Bridge"', keys: ['MERCER_NOTES = await call_copilot(', 'inspector_id="Evelyn_H_Mercer"', 'asset_id="Harbor Bridge"'], out: 'Mercer' } },
  { title: 'Day 1, step 2: Mercer records', rail: 'Day 1b', tag: 'DAY 1', cam: ALL, ask: 'Mercer logs the finding herself.', plain: "Mercer explicitly records the finding with log_finding: a separate path and row in the findings table. This is not a digital signature.", see: 'Logged finding fcd664d7-d5d - now searchable by future call_copilot invocations.', who: 'mercer', nodes: ['inspector', 'embedder', 'finding', 'prompt', 'model', 'answer'], lines: ['confirm'], code: { cell: 59, from: 'MERCER_FINDING_ID = log_finding(', to: 'days_ago=0', keys: ['log_finding(', 'category="corrosion"', 'severity="medium"', 'overall_grade="C"'], out: 'Logged finding' } },
  { title: 'Later: Vance', rail: 'Day N', tag: 'DAY N', cam: ALL, ask: 'Vance asks, and Mercer’s work reaches him.', plain: "He only calls call_copilot. His inspector-specific thread starts fresh. The final AI agent uses asset_id as the shared memory scope; inspect the bridge memories and Mercer’s finding.", see: 'DAY N: Inspector Vance on Harbor Bridge (never met Mercer)', who: 'vance', lines: ['a', 'e', 'read', 'l', 'n', 'b', 'c', 'd'], code: { cell: 64, from: 'VANCE_DIAGNOSIS = await', to: 'asset_id="Harbor Bridge"', keys: ['VANCE_DIAGNOSIS = await', 'inspector_id="Jordan_Vance"', 'asset_id="Harbor Bridge"'], out: 'DAY N:' } },
];

/** a step's name in the page overview: its button and what it is about; the picture steps are told apart by their question */
/**
 * The notebook part's name and its engineering discipline, shown after the PART badge (a colleague's review, 10 Nov: "add notebook part name and
 * classification after the Part #"). Keyed by the rail button; Part 1, Part 0 and the days have none.
 */
const EMBEDDER = { name: 'Embedder and SDK', kind: 'Supporting infrastructure + memory configuration' };
const EXTRACT = { name: 'Auto-extraction', kind: 'Memory engineering' };
const SIMILAR = { name: 'Similar-finding search', kind: 'Context engineering' };
export const PART_KIND: Record<string, { name: string; kind: string }> = {
  '2a': EMBEDDER,
  '2b': EMBEDDER,
  '3a': EXTRACT,
  '3b': EXTRACT,
  '3c': EXTRACT,
  '4a': SIMILAR,
  '4b': SIMILAR,
  '5': { name: 'Scoping', kind: 'Memory scope + context filtering' },
  '6': { name: 'Execution flow', kind: 'Basic harness engineering' },
};

export const stepName = (m: MapStep): string => (m.guide ? `${m.rail} · ${m.ask}` : m.title.startsWith(m.rail) ? m.title : `${m.rail} · ${m.title}`);

export const NB_FILE = completeNotebook.file;

export interface NbSpan {
  t: string;
  k: TokenKind | 'op' | 'md-code' | 'md-b';
}
export interface NbRow {
  kind: 'code' | 'out' | 'md' | 'gap' | 'h1' | 'h2' | 'h3';
  /** the [n]: prompt on a cell's first line, the count the notebook was run with */
  prompt?: string;
  /** the line's number in its cell */
  line?: number;
  /** which notebook cell, and whether this row starts or ends its box */
  cell?: number;
  first?: boolean;
  last?: boolean;
  spans: NbSpan[];
  text: string;
}

interface RunCell {
  type: string;
  source: string;
  count?: number | null;
  outputs?: string[];
}

/** a markdown line, with its `code` and **bold** marked */
const mdSpans = (text: string): NbSpan[] =>
  text
    .split(/(`[^`]+`|\*\*.+?\*\*)/g)
    .filter(Boolean)
    .map((p) => (p.startsWith('`') && p.length > 1 ? { t: p.slice(1, -1), k: 'md-code' as const } : p.startsWith('**') && p.length > 3 ? { t: p.slice(2, -2), k: 'md-b' as const } : { t: p, k: 'plain' as const }));

function build() {
  const rows: NbRow[] = [];
  const where = new Map<number, number[]>();
  const outs = new Map<number, number[]>();
  (completeNotebook.cells as RunCell[]).forEach((cell, i) => {
    if (cell.type !== 'code') {
      for (const raw of cell.source.split('\n')) {
        // pictures and the show-answer tags are not text
        const line = raw.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/<[^>]+>/g, '');
        if (!line.trim() || /^-{3,}$/.test(line.trim())) continue;
        const h = line.match(/^(#{1,3})\s*(.*)/);
        if (h) rows.push({ kind: `h${h[1].length}` as NbRow['kind'], spans: mdSpans(h[2]), text: h[2] });
        else rows.push({ kind: 'md', spans: mdSpans(line), text: line });
      }
      return;
    }
    if (!cell.source.trim()) return;
    // one token can run over several lines (a triple-quoted string): cut the tokens at the line ends
    const lines: NbSpan[][] = [[]];
    for (const tok of highlightPython(cell.source)) {
      tok.text.split('\n').forEach((part, p) => {
        if (p > 0) lines.push([]);
        if (!part) return;
        // JupyterLab colours the operators too; the text stays exactly the same
        if (tok.kind !== 'plain') lines[lines.length - 1].push({ t: part, k: tok.kind });
        else for (const piece of part.split(/([=+\-*/%<>!&|~^]+)/).filter(Boolean)) lines[lines.length - 1].push({ t: piece, k: /^[=+\-*/%<>!&|~^]+$/.test(piece) ? 'op' : 'plain' });
      });
    }
    const at: number[] = [];
    lines.forEach((spans, q) => {
      at.push(rows.length);
      rows.push({ kind: 'code', prompt: q === 0 ? `[${cell.count ?? ' '}]:` : undefined, line: q + 1, cell: i, first: q === 0, last: q === lines.length - 1, spans, text: spans.map((s) => s.t).join('') });
    });
    where.set(i, at);
    const printed: number[] = [];
    for (const text of (cell.outputs ?? []).join('').replace(/\n+$/, '').split('\n')) {
      if (!(cell.outputs ?? []).length) break;
      printed.push(rows.length);
      rows.push({ kind: 'out', spans: [{ t: text, k: 'plain' }], text });
    }
    outs.set(i, printed);
    rows.push({ kind: 'gap', spans: [], text: '' });
  });
  return { rows, where, outs };
}

const NB = build();
export const NB_ROWS = NB.rows;

export interface StepLines {
  /** the rows of this part of the code, at full strength */
  section: Set<number>;
  /** the rows that light up */
  key: Set<number>;
  /** the row the window scrolls to */
  to: number;
}

/** which notebook rows a step shows; throws if the notebook no longer has the line, which the tests would catch */
export function stepLines(step: MapStep): StepLines | null {
  if (!step.code) return null;
  const { cell, from, to: end, keys, all, extra, out } = step.code;
  const at = NB.where.get(cell) ?? [];
  const find = (sub: string, after = -1) => {
    const r = at.find((row) => row > after && NB.rows[row].text.includes(sub));
    if (r === undefined) throw new Error(`Lab 3 map: cell ${cell} has no line "${sub}"`);
    return r;
  };
  const a = find(from);
  let b = find(end, a - 1);
  // a call's closing bracket belongs to the section
  if (NB.rows[b + 1]?.text.trim() === ')') b += 1;
  const section = new Set<number>();
  const key = new Set<number>();
  for (let r = a; r <= b; r++) section.add(r);
  const x = extra === undefined ? undefined : find(extra);
  if (x !== undefined) section.add(x);
  if (all) for (let r = a; r <= b; r++) key.add(r);
  for (const k of keys) key.add(x !== undefined && NB.rows[x].text.includes(k) ? x : find(k, a - 1));
  for (const o of [out ?? []].flat()) {
    const r = (NB.outs.get(cell) ?? []).find((row) => NB.rows[row].text.includes(o));
    if (r === undefined) throw new Error(`Lab 3 map: cell ${cell} printed no "${o}"`);
    section.add(r);
  }
  return { section, key, to: a };
}
