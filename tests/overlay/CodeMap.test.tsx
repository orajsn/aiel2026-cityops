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
  expect(MAP_STEPS).toHaveLength(16);
  expect(focusStepCount('3.6m')).toBe(15);
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
  expect(container.querySelector('[data-line="o"]')!.getAttribute('data-lit')).toBe('true');
  expect(screen.getByTestId('code-map-see').textContent).toContain('TODO 1 passed');
});

test('once the camera arrives only the section stays: key lines lit, the rest faded', () => {
  vi.useFakeTimers();
  const { container } = render(<CodeMap />);
  go(9);
  act(() => vi.advanceTimersByTime(1400));
  const key = [...container.querySelectorAll('.nr.is-key')].map((e) => e.textContent);
  expect(key.join('')).toContain('user_id="inspector_demo"');
  expect(container.querySelectorAll('.nr.is-dim').length).toBeGreaterThan(800);
  vi.useRealTimers();
});

test('the two days show their own inspector and only their own path', () => {
  const { container } = render(<CodeMap />);
  go(14);
  expect(container.querySelector('[data-who]')!.getAttribute('data-who')).toBe('mercer');
  expect(container.querySelector('[data-line="confirm"]')!.getAttribute('data-lit')).toBe('true');
  expect(container.querySelector('[data-line="read"]')!.getAttribute('data-lit')).toBeNull();
  go(15);
  expect(container.querySelector('[data-who]')!.getAttribute('data-who')).toBe('vance');
  expect(container.querySelector('[data-line="read"]')!.getAttribute('data-lit')).toBe('true');
  expect(container.querySelector('[data-line="confirm"]')!.getAttribute('data-lit')).toBeNull();
});

// owner, 4 Nov: one numbering rule, and it is the notebook's Parts: Oracle is Part 1, the embedder Part 2, and an exercise says "you write"
test('the map and the panel number by Part, and never by TODO', () => {
  const { container } = render(<CodeMap />);
  const world = container.querySelector('.cm__world')!.textContent!;
  expect(world).not.toMatch(/TODO|STEP/);
  for (const p of [1, 2, 3, 4, 5, 6]) expect(world).toContain(`PART ${p}`);
  expect(container.querySelectorAll('.cm__world .cm__tag--write')).toHaveLength(5);
  go(6);
  const tags = container.querySelector('.cm__tags')!.textContent!;
  expect(tags).toContain('PART 2');
  expect(tags).toContain('YOU WRITE 2 LINES');
  expect(tags).not.toMatch(/TODO|STEP/);
  go(12);
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
  expect(container.querySelector('.cm__spotlabel')!.textContent).toBe('notebook_student_ollama.ipynb');
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
  const printed = NB_ROWS.filter((x) => x.kind === 'out').map((x) => x.text).join('\n');
  for (const s of MAP_STEPS.slice(1).filter((x) => !x.guide)) expect(printed, s.title).toContain(s.see!);
  const out = NB_ROWS.findIndex((x) => x.kind === 'out' && x.text.includes('Connected - using user prism'));
  expect(stepLines(MAP_STEPS[5])!.section.has(out)).toBe(true);
  expect(NB_ROWS.some((x) => x.kind === 'out' && x.text === 'Helpers loaded: ok, show_table, print_json')).toBe(true);
});

test('our own words keep the rules, and the cell number is the real one', () => {
  for (const s of MAP_STEPS) expect(`${s.ask} ${s.plain}`.replace(/call_copilot/g, '')).not.toMatch(/Evelyn|Jordan|[Pp]ier \d|llama3|copilot|Kirkland/);
  expect(NB_ROWS.find((x) => x.prompt)!.prompt).toBe('[1]:');
});
