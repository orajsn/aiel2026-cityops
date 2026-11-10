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
  expect(MAP_STEPS).toHaveLength(21);
  expect(focusStepCount('3.6m')).toBe(20);
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
  go(13);
  act(() => vi.advanceTimersByTime(1400));
  const key = [...container.querySelectorAll('.nr.is-key')].map((e) => e.textContent);
  expect(key.join('')).toContain('user_id="inspector_demo"');
  expect(container.querySelectorAll('.nr.is-dim').length).toBeGreaterThan(800);
  vi.useRealTimers();
});

test('the two days show their own inspector and only their own path', () => {
  const { container } = render(<CodeMap />);
  go(18);
  expect(container.querySelector('[data-who]')!.getAttribute('data-who')).toBe('mercer');
  expect(container.querySelector('[data-line="confirm"]')!.getAttribute('data-lit')).toBeNull();
  go(19);
  expect(container.querySelector('[data-who]')!.getAttribute('data-who')).toBe('mercer');
  expect(container.querySelector('[data-line="confirm"]')!.getAttribute('data-lit')).toBe('true');
  expect(container.querySelector('[data-line="read"]')!.getAttribute('data-lit')).toBeNull();
  go(20);
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
  go(16);
  expect(container.querySelector('.cm__tags .cm__tag')!.textContent).toBe('PART 5');
  expect(container.querySelector('[data-testid="code-map-part-name"]')!.textContent).toBe('Scoping');
  expect(container.querySelector('[data-testid="code-map-part-kind"]')!.textContent).toBe('Memory scope + context filtering');
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
  expect(MAP_STEPS.slice(8, 14).map((s) => s.rail)).toEqual(['3a', '3b', '3b', '3b', '3b', '3c']);
  expect(MAP_STEPS.slice(8, 14).map((s) => s.tag)).toEqual(['PART 3a', 'PART 3b', 'PART 3b', 'PART 3b', 'PART 3b', 'PART 3c']);
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
  expect(container.querySelector('[data-line="r"]')).toBeTruthy();
  expect(container.querySelector('[data-line="m"]')).toBeNull();
});

// owner, 4 Nov: the database lane reads left to right by Part, with meaningful places and shapes
test('the embedder (Part 2) is left of Part 3 and 4, and in the middle between CITY_ASSET and the findings, which share a column', () => {
  const { container } = render(<CodeMap />);
  const box = (id: string) => {
    const el = container.querySelector<HTMLElement>(`[data-node="${id}"]`)!;
    return { left: parseInt(el.style.left), top: parseInt(el.style.top), w: parseInt(el.style.width), h: parseInt(el.style.height) };
  };
  const [emb, asset, finding] = ['embedder', 'asset', 'finding'].map(box);
  expect(asset.left).toBe(finding.left);
  expect(asset.w).toBe(finding.w);
  expect(finding.top).toBeGreaterThan(asset.top);
  expect(emb.left + emb.w).toBeLessThan(asset.left);
  expect(emb.top + emb.h / 2).toBe((asset.top + asset.h / 2 + finding.top + finding.h / 2) / 2);
  // its arrows leave its right edge and enter the left edges of both
  const d = (id: string) => container.querySelector(`[data-line="${id}"]`)!.getAttribute('d')!;
  expect(d('o')).toBe(`M${emb.left + emb.w} ${emb.top + emb.h / 2} H416`);
  expect(d('u')).toBe(`M416 ${emb.top + emb.h / 2} V${asset.top + asset.h / 2} H436`);
  expect(d('q')).toBe(`M416 ${emb.top + emb.h / 2} V${finding.top + finding.h / 2} H436`);
  expect(emb.left + emb.w).toBeLessThan(416);
  expect(436).toBeLessThan(asset.left);
  // the dashed path of a signed finding ends under the findings table
  expect(d('confirm')).toBe(`M110 322 V912 H${finding.left + finding.w / 2} V888`);
  // nodes in one lane never overlap
  const lane = ['embedder', 'asset', 'message', 'extractor', 'memory', 'finding'].map(box);
  for (const a of lane) for (const b of lane) if (a !== b) expect(a.left < b.left + b.w && b.left < a.left + a.w && a.top < b.top + b.h && b.top < a.top + a.h).toBe(false);
  for (const n of lane) expect(n.left + n.w).toBeLessThan(1800);
});

test('each kind of node looks like what it is: tables are cylinders, steps that compute are hexagons, the prompt is a page', () => {
  const { container } = render(<CodeMap />);
  const shape = (id: string) => container.querySelector(`[data-node="${id}"]`)!.getAttribute('data-shape');
  for (const id of ['asset', 'message', 'memory', 'finding']) expect(shape(id), id).toBe('store');
  for (const id of ['embedder', 'extractor', 'copilot', 'model']) expect(shape(id), id).toBe('process');
  expect(shape('prompt')).toBe('doc');
  expect(shape('inspector')).toBe('card');
  expect(shape('answer')).toBe('card');
  for (const id of ['asset', 'message', 'embedder']) expect(container.querySelector(`[data-node="${id}"] svg.cm__shape path`)).toBeTruthy();
});

// the colleague's comments on the canvas, 5 Nov: each click lights only what it is about, everything else stays pale
test('each click lights only its own part: the database lane for Part 1, then one part at a time', () => {
  const { container } = render(<CodeMap />);
  const lit = () => [...container.querySelectorAll('.cm__node.is-on')].map((e) => e.getAttribute('data-node')).sort();
  const lane = () => !!container.querySelector('.cm__db.is-on');
  // Part 1: the lane lights, no node in it is lit yet (they are not mentioned yet)
  for (const i of [4, 5]) {
    go(i);
    expect(lit(), MAP_STEPS[i].rail).toEqual([]);
    expect(lane()).toBe(true);
    expect(container.querySelectorAll('.cm__node.is-off').length).toBeGreaterThanOrEqual(11);
  }
  // Part 2: the embedder, and the picture stays on it through 2b
  go(6);
  expect(lit()).toEqual(['embedder']);
  expect(lane()).toBe(false);
  expect(MAP_STEPS[7].cam).toEqual(MAP_STEPS[6].cam);
  go(7);
  expect(lit()).toEqual(['embedder']);
  // 3b (code): zoomed on the messages and the extractor, the memory stays pale
  go(10);
  expect(lit()).toEqual(['extractor', 'message']);
  expect(container.querySelector('[data-node="memory"]')!.classList.contains('is-off')).toBe(true);
  expect(MAP_STEPS[10].cam.s).toBeGreaterThan(1);
  // Part 5: only the scope; Part 6: only call_copilot, zoomed
  go(16);
  expect(lit()).toEqual(['scope']);
  go(17);
  expect(lit()).toEqual(['copilot']);
  expect(MAP_STEPS[17].cam.s).toBeGreaterThan(1);
});


// a colleague's review, 10 Nov: the notebook part's name and its engineering discipline sit after the PART badge
test('each notebook part names itself and its discipline after the PART badge', () => {
  const { container } = render(<CodeMap />);
  const at = (rail: string) => MAP_STEPS.findIndex((s) => s.rail === rail);
  const read = () => [container.querySelector('[data-testid="code-map-part-name"]')?.textContent ?? null, container.querySelector('[data-testid="code-map-part-kind"]')?.textContent ?? null];
  go(at('2a'));
  expect(read()).toEqual(['Embedder and SDK', 'Supporting infrastructure + memory configuration']);
  go(at('3c'));
  expect(read()).toEqual(['Auto-extraction', 'Memory engineering']);
  go(at('4b'));
  expect(read()).toEqual(['Similar-finding search', 'Context engineering']);
  go(at('6'));
  expect(read()).toEqual(['Execution flow', 'Basic harness engineering']);
  go(at('1a'));
  expect(read()).toEqual([null, null]);
});
