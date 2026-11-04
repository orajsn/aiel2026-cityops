import { act, render, screen } from '@testing-library/react';
import { CodeMap } from '../../src/overlay/concepts/CodeMap';
import { MAP_STEPS, NB_ROWS, forScreen, stepLines } from '../../src/content/lab3Map';
import { focusStepCount, useDrawerStore } from '../../src/engine/presentation';

const go = (n: number) => act(() => useDrawerStore.setState(n === 0 ? { open: false, focus: 0 } : { open: true, focus: n }));
afterEach(() => act(() => useDrawerStore.setState({ open: false, focus: 0 })));

test('the page opens on the whole map, then ten steps by Next', () => {
  expect(MAP_STEPS).toHaveLength(11);
  expect(focusStepCount('3.6m')).toBe(10);
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
  go(2);
  expect(screen.getByTestId('code-map').dataset.step).toBe('2');
  expect(container.querySelector('[data-node="embedder"]')!.classList.contains('is-on')).toBe(true);
  expect(container.querySelector('[data-node="asset"]')!.classList.contains('is-off')).toBe(true);
  expect(container.querySelector('[data-line="o"]')!.getAttribute('data-lit')).toBe('true');
  expect(screen.getByTestId('code-map-see').textContent).toContain('TODO 1 passed');
});

test('once the camera arrives only the section stays: key lines lit, the rest faded', () => {
  vi.useFakeTimers();
  const { container } = render(<CodeMap />);
  go(4);
  act(() => vi.advanceTimersByTime(1400));
  const key = [...container.querySelectorAll('.nr.is-key')].map((e) => e.textContent);
  expect(key.join('')).toContain('user_id="inspector_demo"');
  expect(container.querySelectorAll('.nr.is-dim').length).toBeGreaterThan(800);
  vi.useRealTimers();
});

test('the two days show their own inspector and only their own path', () => {
  const { container } = render(<CodeMap />);
  go(9);
  expect(container.querySelector('[data-who]')!.getAttribute('data-who')).toBe('mercer');
  expect(container.querySelector('[data-line="confirm"]')!.getAttribute('data-lit')).toBe('true');
  expect(container.querySelector('[data-line="read"]')!.getAttribute('data-lit')).toBeNull();
  go(10);
  expect(container.querySelector('[data-who]')!.getAttribute('data-who')).toBe('vance');
  expect(container.querySelector('[data-line="read"]')!.getAttribute('data-lit')).toBe('true');
  expect(container.querySelector('[data-line="confirm"]')!.getAttribute('data-lit')).toBeNull();
});

// owner, 4 Nov: "there should be one numbering rule": the steps are the only numbers; an exercise says "you write", with no number of its own
test('the map and the panel number only the steps', () => {
  const { container } = render(<CodeMap />);
  expect(container.querySelector('.cm__world')!.textContent).not.toMatch(/TODO|PART/);
  expect(container.querySelectorAll('.cm__world .cm__tag--write')).toHaveLength(5);
  go(2);
  const tags = container.querySelector('.cm__tags')!.textContent!;
  expect(tags).toContain('STEP 2');
  expect(tags).toContain('YOU WRITE 2 LINES');
  expect(tags).not.toMatch(/TODO|PART/);
  go(7);
  expect(container.querySelector('.cm__tags')!.textContent).not.toMatch(/TODO|PART|YOU WRITE/);
});

// owner, 4 Nov: "why it start with STEP 3": every step has its tag on the map and the tags start at 1
test('the tags on the map cover steps 1 to 10, starting at 1', () => {
  const { container } = render(<CodeMap />);
  const shown = new Set([...container.querySelectorAll('.cm__world .cm__tag')].flatMap((e) => (e.textContent!.match(/\d+/g) ?? []).map(Number)));
  expect([...shown].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});
