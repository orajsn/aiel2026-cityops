import { act, render, screen } from '@testing-library/react';
import { CodeMap } from '../../src/overlay/concepts/CodeMap';
import { MAP_STEPS, NB_ROWS, forScreen, stepLines } from '../../src/content/lab3Map';
import { focusStepCount, useDrawerStore } from '../../src/engine/presentation';
import { LAB3_STUDENT, LAB_STOPS } from '../../src/content/labStops';
import { chapter2 } from '../../src/scenes/chapter2';

const go = (n: number) => act(() => useDrawerStore.setState(n === 0 ? { open: false, focus: 0 } : { open: true, focus: n }));
afterEach(() => act(() => useDrawerStore.setState({ open: false, focus: 0 })));

test('the page opens on the whole map, then one click per stop', () => {
  expect(MAP_STEPS).toHaveLength(13);
  expect(focusStepCount('3.6m')).toBe(12);
});

test('every step after the map finds its lines in the notebook, and its key lines sit in its section', () => {
  MAP_STEPS.forEach((s, i) => {
    const hl = stepLines(s);
    if (i === 0) return expect(hl).toBeNull();
    expect(hl, s.title).not.toBeNull();
    expect(hl!.key.size, s.title).toBeGreaterThan(0);
    for (const r of hl!.key) expect(hl!.section.has(r), `${s.title} ${NB_ROWS[r].text}`).toBe(true);
  });
});

test('the TODOs show their answers, not the placeholders', () => {
  const text = NB_ROWS.map((r) => r.text).join('\n');
  expect(text).not.toMatch(/YOUR CODE HERE|YOUR SQL HERE|user_id=None,\s+# <-- TODO 3/);
  expect(text).toContain('vectors = self.provider.embed_documents(list(texts))');
  expect(text).toContain("vec = array.array('f', embedder.embed([description])[0].tolist())");
  expect(text).toContain('VECTOR_DISTANCE(embedding, :q, COSINE) AS score');
  expect(text).toContain('similar = find_similar_findings(narrative, asset_id=asset_id, k=3)');
});

test('the screen keeps the rules: Mercer and Vance only, no pier numbers, the model never named', () => {
  const text = NB_ROWS.map((r) => r.text).join('\n') + JSON.stringify(MAP_STEPS);
  expect(text).not.toMatch(/Evelyn|Jordan|[Pp]ier \d|llama3|Kirkland|\bMEA\b|\bMWA\b|\bBMA\b|fictional/);
  expect(forScreen('user_id="Evelyn_H_Mercer" on Pier 2')).toBe('user_id="Mercer" on Pier');
  for (const s of MAP_STEPS) expect(`${s.ask} ${s.plain}`.replace(/call_copilot/g, '')).not.toMatch(/copilot/);
});

test('the first step is the whole map with nothing dimmed; Next lights the node and its lines', () => {
  const { container } = render(<CodeMap />);
  expect(screen.getByTestId('code-map').dataset.step).toBe('0');
  expect(container.querySelectorAll('.cm__node.is-off')).toHaveLength(0);
  go(3);
  expect(screen.getByTestId('code-map').dataset.step).toBe('3');
  expect(container.querySelector('[data-node="embedder"]')!.classList.contains('is-on')).toBe(true);
  expect(container.querySelector('[data-node="asset"]')!.classList.contains('is-off')).toBe(true);
  expect(container.querySelector('[data-line="o"]')!.getAttribute('data-lit')).toBe('true');
  expect(screen.getByTestId('code-map-see').textContent).toContain('TODO 1 passed');
});

test('once the camera arrives only the section stays: key lines lit, the rest faded', () => {
  vi.useFakeTimers();
  const { container } = render(<CodeMap />);
  go(6);
  act(() => vi.advanceTimersByTime(1400));
  const key = [...container.querySelectorAll('.nr.is-key')].map((e) => e.textContent);
  expect(key.join('')).toContain('user_id="inspector_demo"');
  expect(container.querySelectorAll('.nr.is-dim').length).toBeGreaterThan(800);
  vi.useRealTimers();
});

test('the two days show their own inspector and only their own path', () => {
  const { container } = render(<CodeMap />);
  go(11);
  expect(container.querySelector('[data-who]')!.getAttribute('data-who')).toBe('mercer');
  expect(container.querySelector('[data-line="confirm"]')!.getAttribute('data-lit')).toBe('true');
  expect(container.querySelector('[data-line="read"]')!.getAttribute('data-lit')).toBeNull();
  go(12);
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
  go(3);
  const tags = container.querySelector('.cm__tags')!.textContent!;
  expect(tags).toContain('PART 2');
  expect(tags).toContain('YOU WRITE 2 LINES');
  expect(tags).not.toMatch(/TODO|STEP/);
  go(9);
  expect(container.querySelector('.cm__tags')!.textContent).toBe('PART 5');
});

// owner, 4 Nov: Part 1 highlights the settings, then the connection that proves it worked
test('Part 1 lights the settings, then the connect lines across their two cells', () => {
  const lit = (i: number) => [...stepLines(MAP_STEPS[i])!.key].map((r) => NB_ROWS[r].text);
  expect(lit(1).join('\n')).toMatch(/DB_USER[\s\S]*DB_DSN[\s\S]*ONNX_MODEL[\s\S]*OLLAMA_BASE_URL[\s\S]*OLLAMA_MODEL/);
  expect(lit(2).join('\n')).toMatch(/oracledb\.connect[\s\S]*vector_conn = connect_to_oracle\(\)[\s\S]*Connected - using user/);
  expect(MAP_STEPS[1].tag).toBe('PART 1');
  expect(MAP_STEPS[3].tag).toBe('PART 2');
});

// owner, 4 Nov: the line numbers are the notebook file's own, never counted on screen
test('each line shows its number from the notebook file, also after a filled-in TODO', () => {
  const nb = LAB3_STUDENT.cells;
  const fileLine = (cell: number, sub: string) => nb[cell].source.split('\n').findIndex((l) => l.includes(sub)) + 1;
  const row = (sub: string) => NB_ROWS.find((r) => r.kind === 'code' && r.text.includes(sub))!;
  // untouched lines, before and after an answer that is shorter or longer than its placeholder
  expect(row('def embed(self').line).toBe(fileLine(15, 'def embed(self'));
  expect(row('async def embed_async').line).toBe(fileLine(15, 'async def embed_async'));
  expect(row('# Pre-built: INSERT with named binds').line).toBe(fileLine(50, '# Pre-built: INSERT with named binds'));
  expect(row('FETCH FIRST :k ROWS ONLY').line).toBeUndefined();
  expect(row('# Pre-built: execute + materialise').line).toBe(fileLine(55, '# Pre-built: execute + materialise'));
  expect(row('# TODO 6 (b)').line).toBe(fileLine(71, '# TODO 6 (b)'));
  // an answer sits on its placeholder's lines; the first line of each is on the placeholder's number
  expect(row("vec = array.array('f', embedder.embed([description])").line).toBe(fileLine(50, '# YOUR CODE HERE'));
  expect(row('SELECT finding_id').line).toBe(fileLine(55, '-- YOUR SQL HERE'));
  // the prompt is the file's: nothing has been run
  expect(NB_ROWS.filter((r) => r.prompt).every((r) => r.prompt === '[ ]:' && r.line === 1)).toBe(true);
  const { container } = render(<CodeMap />);
  const key = [...stepLines(MAP_STEPS[3])!.key][0];
  expect(container.querySelector(`[data-r="${key}"] .nr__n`)!.textContent).toBe(String(NB_ROWS[key].line));
});

// owner, 4 Nov: "we remove old code panel": no page of Lab 3 still opens the notebook drawer
test('no Lab 3 page in the show has the old notebook drawer', () => {
  for (const s of chapter2) expect(LAB_STOPS[s.id], s.id).toBeUndefined();
});
