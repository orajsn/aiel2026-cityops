import { vi } from 'vitest';
import { act, render } from '@testing-library/react';
import { LAB_STOPS } from '../../src/content/labStops';
import { LAB_GUIDE, guideSteps, partLines } from '../../src/content/labGuide';
import { JupyterDrawer } from '../../src/overlay/jupyter/JupyterDrawer';
import { useDrawerStore, stopStepCount } from '../../src/engine/presentation';

beforeEach(() => useDrawerStore.getState().reset());

test('every guide block is a code cell inside its page’s stop, right under its section heading', () => {
  for (const [id, blocks] of Object.entries(LAB_GUIDE)) {
    const stop = LAB_STOPS[id];
    for (const b of blocks) {
      expect(b.cell, `${id} ${b.title}`).toBeGreaterThanOrEqual(stop.from);
      expect(b.cell).toBeLessThanOrEqual(stop.to);
      expect(stop.notebook.cells[b.cell].type).toBe('code');
      expect(stop.notebook.cells[b.cell - 1].source.startsWith(`### ${b.title.split(' ')[0]} `)).toBe(true);
    }
  }
});

test('5.4’s eight parts each start on a real line of the cell, in order, so a notebook change cannot silently break them', () => {
  const b = LAB_GUIDE['2.7'].find((x) => x.title.startsWith('5.4'))!;
  const lines = LAB_STOPS['2.7'].notebook.cells[b.cell].source.split('\n');
  expect(b.parts!.map((p) => p.label[0])).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
  let last = -1;
  for (const p of b.parts!) {
    const r = partLines(lines, p);
    expect(r.start, p.label).toBeGreaterThan(last);
    expect(r.end).toBeGreaterThan(r.start);
    last = r.start;
  }
  expect(lines[partLines(lines, b.parts![5]).start]).toMatch(/model_node|Nodes/);
});

test('page 2.7 steps through 5 blocks and 5.4’s 8 parts: 13 steps, and the clicker walks the same', () => {
  expect(guideSteps('2.7')).toHaveLength(13);
  expect(stopStepCount('2.7')).toBe(13);
  expect(stopStepCount('2.1')).toBe(7); // pages without a guide still step through their cells to run
});

test('on a block the drawer shows its note under the heading; on a part it highlights that part’s lines', () => {
  const c = render(<JupyterDrawer sceneId="2.7" />).container;
  act(() => useDrawerStore.setState({ open: true, focus: 2 })); // 5.4, the block itself
  expect(c.querySelector('[data-guide-note]')?.textContent).toMatch(/eight parts/);
  act(() => useDrawerStore.setState({ focus: 2 + 6 })); // part F
  expect(c.querySelector('[data-guide-note]')?.textContent).toMatch(/model_node/);
  const lit = [...c.querySelectorAll('.jd__line--guide')].map((l) => l.textContent).join('');
  expect(lit).toMatch(/def model_node/);
  expect(lit).toMatch(/def tool_node_sequential/);
  expect(lit).not.toMatch(/def enforce_remember_node/);
});

test('the guide’s own notes name no pier (the notebook’s code is shown as it is)', () => {
  expect(JSON.stringify(LAB_GUIDE, (_, v) => (v instanceof RegExp ? String(v) : v))).not.toMatch(/Pier \d/);
});

// owner, 28 Oct: walking through the cells should look like running them, output included
test('a step runs its cell: [*] for a moment, then [n] and its output; 5.4 runs after its last part', () => {
  vi.useFakeTimers();
  const c = render(<JupyterDrawer sceneId="2.7" />).container;
  act(() => useDrawerStore.setState({ open: true, focus: 1 })); // 5.3
  expect(c.querySelector('[data-exec="running"]')).not.toBeNull();
  act(() => vi.advanceTimersByTime(1200));
  expect(c.querySelector('[data-exec="1"]')).not.toBeNull();
  expect(c.querySelector('[data-output="ran"]')?.textContent).toMatch(/Done!/);
  act(() => useDrawerStore.setState({ focus: 2 })); // 5.4 itself: explained first, not run yet
  act(() => vi.advanceTimersByTime(1200));
  expect(c.querySelector('[data-exec="2"]')).toBeNull();
  act(() => useDrawerStore.setState({ focus: 10 })); // its last part, H
  act(() => vi.advanceTimersByTime(1200));
  expect(c.querySelector('[data-exec="2"]')).not.toBeNull();
  vi.useRealTimers();
});

test('a quick clicker does not lose a run: each cell started finishes, in order', () => {
  vi.useFakeTimers();
  const c = render(<JupyterDrawer sceneId="2.2" />).container;
  act(() => useDrawerStore.setState({ open: true, focus: 1 }));
  act(() => vi.advanceTimersByTime(300));
  act(() => useDrawerStore.setState({ focus: 2 }));
  act(() => vi.advanceTimersByTime(1500));
  expect([...c.querySelectorAll('[data-exec]')].map((e) => e.getAttribute('data-exec')).filter(Boolean)).toEqual(['1', '2']);
  vi.useRealTimers();
});
