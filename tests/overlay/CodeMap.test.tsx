import { act, render, screen } from '@testing-library/react';
import { CodeMap } from '../../src/overlay/concepts/CodeMap';
import { MAP_STEPS, NB_FILE, NB_ROWS, stepLines } from '../../src/content/lab3Map';
import { focusStepCount, useDrawerStore } from '../../src/engine/presentation';
import { LAB_STOPS } from '../../src/content/labStops';
import completeNotebook from '../../src/content/notebooks/lab3_complete.json';
import { chapter2 } from '../../src/scenes/chapter2';

const go = (n: number) => act(() => useDrawerStore.setState(n === 0 ? { open: false, focus: 0 } : { open: true, focus: n }));
afterEach(() => act(() => useDrawerStore.setState({ open: false, focus: 0 })));

test('the page opens on the whole map, then one click per stop', () => {
  expect(MAP_STEPS).toHaveLength(18);
  expect(focusStepCount('3.6m')).toBe(17);
});

test('every step after the map finds its lines in the notebook, and its key lines sit in its section', () => {
  MAP_STEPS.forEach((s, i) => {
    const hl = stepLines(s);
    if (i === 0 || s.guide) return expect(hl).toBeNull();
    expect(hl, s.title).not.toBeNull();
    expect(hl!.key.size, s.title).toBeGreaterThan(0);
    for (const r of hl!.key) expect(hl!.section.has(r), `${s.title} ${NB_ROWS[r].text}`).toBe(true);
  });
});

test('the first step is the whole map with nothing dimmed; Next lights the node and its lines', () => {
  const { container } = render(<CodeMap />);
  expect(screen.getByTestId('code-map').dataset.step).toBe('0');
  expect(container.querySelectorAll('.cm__node.is-off')).toHaveLength(0);
  go(6);
  expect(screen.getByTestId('code-map').dataset.step).toBe('6');
  expect(container.querySelector('[data-node="embedder"]')!.classList.contains('is-on')).toBe(true);
  expect(container.querySelector('[data-node="asset"]')!.classList.contains('is-off')).toBe(true);
  expect(container.querySelector('[data-line="q"]')!.getAttribute('data-lit')).toBe('true');
  expect(container.querySelector('[data-line="u"]')!.getAttribute('data-lit')).toBe('true');
  expect(screen.getByTestId('code-map-see').textContent).toContain('TODO 1 passed');
});

test('once the camera arrives only the section stays: key lines lit, the rest faded', () => {
  vi.useFakeTimers();
  const { container } = render(<CodeMap />);
  go(11);
  act(() => vi.advanceTimersByTime(1400));
  const key = [...container.querySelectorAll('.nr.is-key')].map((e) => e.textContent);
  expect(key.join('')).toContain('user_id="inspector_demo"');
  expect(container.querySelectorAll('.nr.is-dim').length).toBeGreaterThan(800);
  vi.useRealTimers();
});

test('the two days show their own inspector and only their own path', () => {
  const { container } = render(<CodeMap />);
  go(16);
  expect(container.querySelector('[data-who]')!.getAttribute('data-who')).toBe('mercer');
  expect(container.querySelector('[data-line="confirm"]')!.getAttribute('data-lit')).toBe('true');
  expect(container.querySelector('[data-line="read"]')!.getAttribute('data-lit')).toBeNull();
  go(17);
  expect(container.querySelector('[data-who]')!.getAttribute('data-who')).toBe('vance');
  expect(container.querySelector('[data-line="read"]')!.getAttribute('data-lit')).toBe('true');
  expect(container.querySelector('[data-line="confirm"]')!.getAttribute('data-lit')).toBeNull();
});

// owner, 4 Nov: one numbering rule, and it is the notebook's Parts: Oracle is Part 1, the embedder Part 2, and attendees run the complete notebook, so nothing says they write code
test('the map and the panel number by Part, and never by TODO', () => {
  const { container } = render(<CodeMap />);
  const world = container.querySelector('.cm__world')!.textContent!;
  expect(world).not.toMatch(/TODO|STEP/);
  for (const p of [1, 2, 3, 4, 5, 6]) expect(world).toContain(`PART ${p}`);
  expect(container.textContent).not.toContain('YOU WRITE');
  go(6);
  const tags = container.querySelector('.cm__tags')!.textContent!;
  expect(tags).toContain('PART 2');
  expect(tags).not.toMatch(/TODO|STEP/);
  go(14);
  expect(container.querySelector('.cm__tags')!.textContent).toBe('PART 5');
});

// owner, 4 Nov: Part 1 highlights the settings, then the connection that proves it worked
test('Part 1 lights the settings, then the connect lines across their two cells', () => {
  const lit = (i: number) => [...stepLines(MAP_STEPS[i])!.key].map((r) => NB_ROWS[r].text);
  expect(lit(4).join('\n')).toMatch(/DB_USER[\s\S]*DB_DSN[\s\S]*ONNX_MODEL[\s\S]*OLLAMA_BASE_URL[\s\S]*OLLAMA_MODEL/);
  expect(lit(5).join('\n')).toMatch(/oracledb\.connect[\s\S]*vector_conn = connect_to_oracle\(\)[\s\S]*Connected - using user/);
  expect(MAP_STEPS[4].tag).toBe('PART 1');
  expect(MAP_STEPS[6].tag).toBe('PART 2');
});

// owner, 4 Nov: "we remove old code panel": no page of Lab 3 still opens the notebook drawer
test('no Lab 3 page in the show has the old notebook drawer', () => {
  for (const s of chapter2) expect(LAB_STOPS[s.id], s.id).toBeUndefined();
});

// a colleague's note, 4 Nov: Part 0 shows how to choose the notebook, then lights the code area and the Run button
test('Part 0 walks the JupyterLab screen one thing per click, on one button', () => {
  const { container } = render(<CodeMap />);
  expect(MAP_STEPS.slice(1, 4).map((s) => s.guide)).toEqual(['file', 'code', 'run']);
  go(1);
  expect(screen.getByTestId('code-map-guide').dataset.spot).toBe('file');
  expect(container.querySelector('.cm__spotlabel')!.textContent).toBe('notebook_complete_ollama.ipynb');
  expect(JSON.stringify(MAP_STEPS)).not.toContain('notebook_student');
  go(3);
  expect(screen.getByTestId('code-map-guide').dataset.spot).toBe('run');
  const labels = [...container.querySelectorAll('.cm__rail button')].map((b) => b.textContent);
  expect(labels.slice(0, 3)).toEqual(['Map', '0', '1a']);
  expect(container.querySelector('.cm__rail .is-now')!.textContent).toBe('0');
});

// owner, 4 Nov: "you did not follow my original notebook": the window is the run notebook, with nothing changed or added
test('the window is the run notebook: exact code, its line numbers, its counts and its results', () => {
  expect(NB_FILE).toBe('notebook_complete_ollama.ipynb');
  let r = 0;
  const shown = NB_ROWS;
  for (const cell of completeNotebook.cells as { type: string; source: string; count?: number | null; outputs?: string[] }[]) {
    if (cell.type !== 'code' || !cell.source.trim()) continue;
    const lines = cell.source.split('\n');
    while (shown[r].text !== lines[0] || shown[r].kind !== 'code' || shown[r].line !== 1) r += 1;
    expect(shown[r].prompt).toBe(`[${cell.count ?? ' '}]:`);
    lines.forEach((l, k) => {
      expect(shown[r + k].text).toBe(l);
      expect(shown[r + k].line).toBe(k + 1);
    });
    r += lines.length;
    const printed = (cell.outputs ?? []).join('').replace(/\n+$/, '');
    if (cell.outputs?.length) {
      printed.split('\n').forEach((l, k) => expect(shown[r + k].text).toBe(l));
      expect(shown[r].kind).toBe('out');
    }
  }
});

test('every step finds its real lines and result, and says what was really printed', () => {
  const printed = NB_ROWS.filter((x) => x.kind === 'out').map((x) => x.text).join(' ');
  for (const s of MAP_STEPS.slice(1).filter((x) => !x.guide)) expect(printed, s.title).toContain(s.see!);
  const out = NB_ROWS.findIndex((x) => x.kind === 'out' && x.text.includes('Connected - using user prism'));
  expect(stepLines(MAP_STEPS[5])!.section.has(out)).toBe(true);
  expect(NB_ROWS.some((x) => x.kind === 'out' && x.text === 'Helpers loaded: ok, show_table, print_json')).toBe(true);
});

test('our own words keep the rules, and the cell number is the real one', () => {
  for (const s of MAP_STEPS) expect(`${s.ask} ${s.plain}`.replace(/call_copilot/g, '')).not.toMatch(/Evelyn|Jordan|[Pp]ier \d|llama3|copilot|Kirkland/);
  expect(NB_ROWS.find((x) => x.prompt)!.prompt).toBe('[1]:');
});

// owner, 4 Nov: the code section looks like JupyterLab: its colours, a frame round each cell, and the selected cell in blue
test('the window draws cells the way JupyterLab does, without changing their text', () => {
  const { container } = render(<CodeMap />);
  go(5);
  const hl = stepLines(MAP_STEPS[5])!;
  const row = container.querySelector(`[data-r="${hl.to}"]`)!;
  expect(row.classList.contains('is-sel')).toBe(true);
  expect(container.querySelector('.nr--first.is-sel .nr__g')!.textContent).toBe('[1]:');
  expect(container.querySelector('.py-kw')).toBeTruthy();
  expect(container.querySelector('.py-op')).toBeTruthy();
  expect(NB_ROWS.filter((r) => r.kind === 'code').every((r) => r.spans.map((s) => s.t).join('') === r.text)).toBe(true);
});

// owner, 4 Nov: Part 3 is 3a CITY_ASSET (the code loads the asset registry), 3b the extraction (its picture first), 3c CITY_MEMORY
test('Part 3 is three parts: the assets, then the extraction with its picture first, then the memory', () => {
  expect(MAP_STEPS.slice(8, 12).map((s) => s.rail)).toEqual(['3a', '3b', '3b', '3c']);
  expect(MAP_STEPS.slice(8, 12).map((s) => s.tag)).toEqual(['PART 3a', 'PART 3b', 'PART 3b', 'PART 3c']);
  expect(MAP_STEPS[8].nodes).toEqual(['asset']);
  expect(MAP_STEPS[9].guide).toBe('extract');
  expect(MAP_STEPS[10].guide).toBeUndefined();
  const asset = stepLines(MAP_STEPS[8])!;
  const text = (rows: Set<number>) => [...rows].map((r) => NB_ROWS[r].text);
  expect(text(asset.section)[0]).toContain('_data_dir = Path(');
  expect(text(asset.section).join('\n')).toContain('print(f"Discovered');
  // the whole block is lit, lines 6 to 14 and nothing else of the cell
  expect(text(asset.key)[0]).toContain('_data_dir = Path(');
  expect(text(asset.key)[text(asset.key).length - 1]).toContain('print(f"Discovered');
  expect(asset.key.size).toBe(9);
  expect([...asset.key].every((r) => asset.section.has(r))).toBe(true);
  expect(NB_ROWS[[...asset.key][0]].line).toBe(6);
  expect(NB_ROWS[Math.max(...asset.key)].line).toBe(14);
  expect(NB_ROWS.filter((r) => r.kind === 'out' && /^(Loaded|Discovered)/.test(r.text) && asset.section.has(NB_ROWS.indexOf(r)))).toHaveLength(2);
  const { container } = render(<CodeMap />);
  const world = container.querySelector('.cm__world')!.textContent!;
  for (const p of ['PART 3a', 'PART 3b', 'PART 3c']) expect(world).toContain(p);
  go(9);
  expect(screen.getByTestId('code-map-guide').dataset.spot).toBe('extract');
  expect(container.querySelector('.cm__shot img')!.getAttribute('alt')).toContain('CITY_MESSAGE');
  expect(container.querySelector('.cm__rail .is-now')!.textContent).toBe('3b');
  go(10);
  expect(container.querySelector('.cm__rail .is-now')!.textContent).toBe('3b');
  expect([...container.querySelectorAll('.cm__rail button')].map((b) => b.textContent).filter((x) => x!.startsWith('3'))).toEqual(['3a', '3b', '3c']);
});

// owner, 4 Nov: 3a's node sits in the same row as 3b and 3c, in order, not at the bottom
test('Part 3 sits in one row, in order: CITY_ASSET, CITY_MESSAGE, the Extractor, CITY_MEMORY', () => {
  const { container } = render(<CodeMap />);
  const at = (id: string) => {
    const el = container.querySelector<HTMLElement>(`[data-node="${id}"]`)!;
    return { left: parseInt(el.style.left), top: parseInt(el.style.top) };
  };
  const row = ['asset', 'message', 'extractor', 'memory'].map(at);
  expect(new Set(row.map((r) => r.top)).size).toBe(1);
  expect(row.map((r) => r.left)).toEqual([...row.map((r) => r.left)].sort((a, b) => a - b));
  // the embedder and the findings keep their own row below it
  expect(at('embedder').top).toBeGreaterThan(row[0].top);
  expect(at('finding').top).toBe(at('embedder').top);
  expect(container.querySelector('[data-line="r"]')).toBeTruthy();
  expect(container.querySelector('[data-line="m"]')).toBeNull();
});

// owner, 4 Nov: the Part 2 node, the embedder, is connected to Part 3a (the assets) and to Part 4 (the findings)
test('the embedder is connected to CITY_ASSET above it and to CITY_INSPECTION_FINDING beside it', () => {
  const { container } = render(<CodeMap />);
  expect(container.querySelector('[data-line="u"]')!.getAttribute('d')).toBe('M260 760 V668');
  expect(container.querySelector('[data-line="q"]')).toBeTruthy();
  const el = (id: string) => container.querySelector<HTMLElement>(`[data-node="${id}"]`)!;
  const embedder = el('embedder');
  const asset = el('asset');
  // the line runs from the embedder's top edge to the asset's bottom edge, inside both
  expect(parseInt(embedder.style.top)).toBe(760);
  expect(parseInt(asset.style.top) + parseInt(asset.style.height)).toBeLessThan(668);
  for (const x of [260]) for (const n of [embedder, asset]) expect(x).toBeGreaterThan(parseInt(n.style.left)), expect(x).toBeLessThan(parseInt(n.style.left) + parseInt(n.style.width));
});

