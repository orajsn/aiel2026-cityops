import { LAB3_STUDENT } from './labStops';
import { highlightPython, type TokenKind } from '../overlay/jupyter/highlight';

/**
 * Lab 3's coding part as one map (owner, 4 Nov; drafted on the canvas "Lab 3 Code Map"): one page, eleven steps, in the order the code
 * runs. Each Next flies the map to a node while a real notebook window scrolls to that part of the code: its lines stay, the key lines
 * light up, the rest fades. The window shows the student notebook (notebook_student_ollama.ipynb) with each TODO's answer filled in.
 * The notebook file itself is never changed: answers and names are put in here, for the screen only.
 */

export type MapNode = 'inspector' | 'copilot' | 'prompt' | 'model' | 'answer' | 'scope' | 'embedder' | 'message' | 'extractor' | 'memory' | 'finding' | 'asset';
export type MapLine = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'read' | 'l' | 'm' | 'n' | 'g' | 'h' | 'o' | 'p' | 'q' | 'confirm';

export interface MapCam {
  s: number;
  cx: number;
  cy: number;
}
export interface MapStep {
  title: string;
  /** the whole map, full width, no notebook (the first step) */
  wide?: boolean;
  cam: MapCam;
  todo?: string;
  kicker?: string;
  ask: string;
  plain: string;
  /** what the notebook prints */
  see?: string;
  /** the lit nodes; none: everything at full strength */
  nodes?: MapNode[];
  lines: MapLine[];
  /** the person on the Inspector card on this step */
  who?: 'mercer' | 'vance';
  code?: { cell: number; from: string; to: string; keys: string[] } | { cell: number; extra: string; from: string; to: string; keys: string[] };
}

const ALL: MapCam = { s: 0.44, cx: 960, cy: 545 };

export const MAP_STEPS: MapStep[] = [
  { title: 'The whole map', wide: true, cam: { s: 0.82, cx: 960, cy: 545 }, ask: 'Everything you build today is on this one map.', plain: 'One turn of the AI agent runs along the top. Everything it remembers sits in one database underneath. We walk it in the order the code runs.', lines: [] },
  { title: 'One connection', cam: { s: 0.6, cx: 620, cy: 690 }, kicker: 'PART 1 · PART 2', ask: 'Where does everything live?', plain: 'One filing room, not five. One connection gives the AI agent its tables, its memory and its search.', see: 'OracleAgentMemory ready. Tables under prefix CITY_*', nodes: ['embedder', 'message', 'extractor', 'memory', 'finding', 'asset'], lines: [], code: { cell: 20, from: 'memory = OracleAgentMemory(', to: 'table_name_prefix', keys: ['connection=vector_conn', 'extract_memories=True', 'table_name_prefix'] } },
  { title: 'The embedder', cam: { s: 1.25, cx: 330, cy: 710 }, todo: 'TODO 1', kicker: '2 LINES', ask: 'How do you search by meaning?', plain: 'Text becomes 384 numbers, like an address on a map of meaning. Reports that mean the same thing land close together.', see: 'TODO 1 passed - embedder returns float32 (n, 384) arrays', nodes: ['embedder'], lines: ['o', 'p', 'q'], code: { cell: 15, from: 'def embed(self', to: 'return np.asarray', keys: ['vectors = self.provider', 'return np.asarray'] } },
  { title: 'A report goes in', cam: { s: 0.72, cx: 1036, cy: 600 }, todo: 'TODO 2', kicker: '2 LINES', ask: 'What happens when an inspector reports?', plain: 'Two things. The report is filed word for word. Then the extractor writes small cards of what is worth keeping.', see: 'TODO 2 passed - added message(s): …', nodes: ['message', 'extractor', 'memory'], lines: ['g', 'h'], code: { cell: 29, from: '# TODO 2', to: 'return await t.add_messages_async', keys: ['content = f', 'return await t.add_messages_async'] } },
  { title: 'Finding a memory', cam: { s: 1.2, cx: 1412, cy: 600 }, todo: 'TODO 3', kicker: '1 LINE', ask: 'Why did the search come back empty?', plain: 'A memory belongs to whoever wrote it. Search with no name and you get nothing. Give the right name and the cards light up.', see: 'TODO 3 passed - … memories extracted from 4 narratives', nodes: ['memory'], lines: [], code: { cell: 39, from: 'results = await', to: 'max_results=30', keys: ['user_id="inspector_demo"'] } },
  { title: 'The official record', cam: { s: 0.88, cx: 560, cy: 780 }, todo: 'TODO 4', kicker: '1 LINE', ask: 'What is a finding, if it is not a memory?', plain: 'A memory is what the AI agent noticed. A finding is what a person signed. It gets its own table, and its description becomes numbers too.', see: 'TODO 4 passed - finding_id=…', nodes: ['finding', 'embedder'], lines: ['o', 'q'], code: { cell: 50, from: '# TODO 4', to: 'vec = array', keys: ['vec = array'] } },
  { title: 'Search with walls', cam: { s: 1.05, cx: 720, cy: 820 }, todo: 'TODO 5', kicker: 'ABOUT 7 LINES', ask: 'Nearest in meaning, but only this bridge?', plain: 'One SQL statement does both: the closest in meaning, inside the walls of this asset and this category.', see: 'TODO 5 passed - broad=…, asset-filtered=…, category-filtered=…', nodes: ['finding'], lines: [], code: { cell: 55, from: 'SELECT finding_id', to: 'FETCH FIRST', keys: ['VECTOR_DISTANCE', 'WHERE (:asset_id', 'AND (:category'] } },
  { title: 'Who sees what', cam: { s: 0.76, cx: 800, cy: 460 }, kicker: 'PART 5', ask: 'Why can Vance not read Mercer’s private note?', plain: 'Each inspector has a private thread. What the extractor learns goes on a shelf for the asset. The database enforces this, not the AI agent.', see: "Multi-tenancy verified: Vance sees city-wide guidelines but NOT Mercer's personal notes.", nodes: ['scope', 'copilot', 'message', 'memory'], lines: ['e', 'f'], code: { cell: 71, extra: 'thread_id = f"', from: 'pooled = await', to: 'max_results=3', keys: ['thread_id = f"', 'user_id=asset_id', 'exact_thread_match'] } },
  { title: 'One whole turn', cam: { s: 0.46, cx: 960, cy: 545 }, todo: 'TODO 6', kicker: '2 LINES', ask: 'What does the AI agent actually read?', plain: 'You write two lines: its context card and the similar findings. The rest is built: put it all in one prompt, ask, save.', see: 'TODO 6 passed - copilot ran end-to-end', nodes: ['copilot', 'scope', 'prompt', 'model', 'answer', 'memory', 'finding', 'asset'], lines: ['b', 'c', 'd', 'read', 'n', 'l', 'm', 'e'], code: { cell: 71, from: '# TODO 6 (a)', to: 'similar = find_similar', keys: ['card = await', 'similar = find_similar'] } },
  { title: 'Day 1: Mercer', cam: ALL, kicker: 'DAY 1', ask: 'Mercer leaves two things behind.', plain: 'Her turn is saved and the extractor keeps what matters. Then, once she is sure, she signs the finding herself: a separate path.', see: 'Logged finding … - now searchable by future call_copilot invocations.', who: 'mercer', nodes: ['inspector', 'copilot', 'scope', 'message', 'extractor', 'memory', 'finding'], lines: ['a', 'e', 'f', 'g', 'h', 'confirm'], code: { cell: 79, from: 'MERCER_FINDING_ID = log_finding(', to: 'days_ago=0', keys: ['log_finding(', 'category="corrosion"', 'severity="medium"', 'overall_grade="C"'] } },
  { title: 'Later: Vance', cam: ALL, kicker: 'DAY N', ask: 'Vance asks, and Mercer’s work reaches him.', plain: 'He only calls call_copilot. His own thread is empty, but the asset’s memory and her finding come up the same road. No human handoff.', see: 'DAY N: Inspector Vance on Harbor Bridge (never met Mercer)', who: 'vance', nodes: ['inspector', 'copilot', 'scope', 'prompt', 'model', 'answer', 'memory', 'finding', 'asset'], lines: ['a', 'e', 'read', 'l', 'm', 'n', 'b', 'c', 'd'], code: { cell: 85, from: 'VANCE_DIAGNOSIS = await', to: 'asset_id="Harbor Bridge"', keys: ['VANCE_DIAGNOSIS = await', 'inspector_id="Vance"', 'asset_id="Harbor Bridge"'] } },
];

/** the answer block in the markdown cell after a TODO cell */
function answer(cell: number): string[] {
  const m = LAB3_STUDENT.cells[cell].source.match(/```\w*\n([\s\S]*?)```/);
  return m ? m[1].replace(/\n$/, '').split('\n') : [];
}
const indent = (lines: string[], n: number) => lines.map((l) => (l ? ' '.repeat(n) + l : l));

/** the cell with its TODO answered; a placeholder and the line after it make way for the answer */
function answered(cell: number, lines: string[]): string[] {
  const out: string[] = [];
  for (let j = 0; j < lines.length; j++) {
    const s = lines[j].trim();
    if (s.startsWith('# YOUR CODE HERE') && [15, 29, 50].includes(cell)) {
      out.push(...indent(answer(cell + 1), cell === 15 ? 8 : 4));
      j += 1;
    } else if (cell === 39 && s.startsWith('user_id=None')) out.push('    user_id="inspector_demo",');
    else if (cell === 55 && s.startsWith('-- YOUR SQL HERE')) out.push(...indent(answer(56), 8));
    else if (cell === 71 && (s.startsWith('# TODO 6 (a)') || s.startsWith('# TODO 6 (b)'))) {
      const a = answer(72);
      const split = a.findIndex((l) => l.startsWith('# 6b'));
      out.push(lines[j], ...indent(s.includes('(a)') ? a.slice(1, split) : a.slice(split + 1), 4));
      j += 2;
    } else out.push(lines[j]);
  }
  return out;
}

/** the screen's rules, on the notebook's text: Mercer and Vance only, no pier numbers, the model never named */
export const forScreen = (line: string) =>
  line
    .replace(/Evelyn_H_Mercer/g, 'Mercer')
    .replace(/Jordan_Vance/g, 'Vance')
    .replace(/Jordan/g, 'Vance')
    .replace(/\b([Pp])ier \d/g, '$1ier')
    .replace(/"llama3\.2"/g, '"…"');

export interface NbSpan {
  t: string;
  k: TokenKind;
}
export interface NbRow {
  kind: 'code' | 'gap' | 'h1' | 'h2' | 'h3';
  /** the [n]: prompt on a cell's first line */
  prompt?: string;
  spans: NbSpan[];
  text: string;
}

const FIRST_CELL = 4;
const LAST_CELL = 88;

function build() {
  const rows: NbRow[] = [];
  const where = new Map<number, number[]>();
  let n = 0;
  for (let i = FIRST_CELL; i <= LAST_CELL; i++) {
    const cell = LAB3_STUDENT.cells[i];
    if (cell.type !== 'code') {
      const m = cell.source.match(/^(#{1,3})\s*(.*)/);
      if (m) {
        const text = forScreen(m[2].replace(/`/g, '').replace(/[^\p{L}\p{N}\p{P}\p{Zs}+=<>]/gu, '').trim());
        rows.push({ kind: `h${m[1].length}` as NbRow['kind'], spans: [{ t: text, k: 'plain' }], text });
      }
      continue;
    }
    n += 1;
    const text = answered(i, cell.source.replace(/\n+$/, '').split('\n')).map(forScreen).join('\n');
    // one token can run over several lines (a triple-quoted string): cut the tokens at the line ends
    const lines: NbSpan[][] = [[]];
    for (const tok of highlightPython(text)) {
      tok.text.split('\n').forEach((part, p) => {
        if (p > 0) lines.push([]);
        if (part) lines[lines.length - 1].push({ t: part, k: tok.kind });
      });
    }
    const at: number[] = [];
    lines.forEach((spans, q) => {
      at.push(rows.length);
      rows.push({ kind: 'code', prompt: q === 0 ? `[${n}]:` : undefined, spans, text: spans.map((s) => s.t).join('') });
    });
    where.set(i, at);
    rows.push({ kind: 'gap', spans: [], text: '' });
  }
  return { rows, where };
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
  const { cell, from, to, keys } = step.code;
  const at = NB.where.get(cell) ?? [];
  const find = (sub: string, after = -1) => {
    const r = at.find((row) => row > after && NB.rows[row].text.includes(sub));
    if (r === undefined) throw new Error(`Lab 3 map: cell ${cell} has no line "${sub}"`);
    return r;
  };
  const a = find(from);
  let b = find(to, a - 1);
  // a call's closing bracket belongs to the section
  if (NB.rows[b + 1]?.text.trim() === ')') b += 1;
  const section = new Set<number>();
  for (let r = a; r <= b; r++) section.add(r);
  const extra = 'extra' in step.code ? find(step.code.extra) : undefined;
  if (extra !== undefined) section.add(extra);
  const key = new Set(keys.map((k) => (extra !== undefined && NB.rows[extra].text.includes(k) ? extra : find(k, a - 1))));
  return { section, key, to: a };
}
