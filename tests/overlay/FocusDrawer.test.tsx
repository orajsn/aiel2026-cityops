import { act, fireEvent, render } from '@testing-library/react';
import { LAB2_FOCUS } from '../../src/content/lab2Focus';
import { LAB2, LAB_STOPS } from '../../src/content/labStops';
import { JupyterDrawer } from '../../src/overlay/jupyter/JupyterDrawer';
import { savedOutput, stepLines } from '../../src/overlay/jupyter/FocusDrawer';
import { SCENES } from '../../src/scenes';
import { useDrawerStore } from '../../src/engine/presentation';
import { useSceneStore } from '../../src/engine/store';

const FOCUS = Object.keys(LAB2_FOCUS).find((id) => LAB2_FOCUS[id].length > 0)!;
const STEPS = LAB2_FOCUS[FOCUS];
const lineCount = (cell: number) => LAB2.cells[cell].source.replace(/\n$/, '').split('\n').length;

let scrolled: Element[] = [];
beforeEach(() => {
  useSceneStore.getState().setScenes([{ id: FOCUS, chapter: 1, title: 'Focus', shot: 'city' }]);
  useSceneStore.getState().setSettled(true);
  useDrawerStore.getState().reset();
  scrolled = [];
  Element.prototype.scrollIntoView = function (this: Element) {
    scrolled.push(this);
  };
});

test('every focus page is a real page, every step a real code cell, its lines inside the cell, labelled', () => {
  const ids = new Set(SCENES.map((s) => s.id));
  for (const [id, steps] of Object.entries(LAB2_FOCUS)) {
    expect(ids.has(id), id).toBe(true);
    steps.forEach((s, i) => {
      expect(LAB2.cells[s.cell]?.type, `${id} step ${i + 1}`).toBe('code');
      for (const [a, b] of s.lines ?? []) {
        expect(a >= 1 && a <= b && b <= lineCount(s.cell), `${id} step ${i + 1} lines ${a}-${b}`).toBe(true);
      }
      expect(s.label.trim(), `${id} step ${i + 1}`).not.toBe('');
      if (s.output) expect(savedOutput(s.cell), `${id} step ${i + 1} output`).toBeTruthy();
    });
  }
});

test('closed: the handle waits; it opens on step 1 with the whole notebook', () => {
  const { getByLabelText, container } = render(<JupyterDrawer sceneId={FOCUS} />);
  fireEvent.click(getByLabelText('Open in Jupyter'));
  expect(useDrawerStore.getState()).toMatchObject({ open: true, focus: 1 });
  // the whole notebook: every code cell is there, not a slice
  const codeCells = LAB2.cells.filter((c) => c.type === 'code').length;
  expect(container.querySelectorAll('[data-cell]').length).toBe(codeCells);
});

test('each step: scrolls to its callout, lights its lines, numbers it; earlier steps fade to a small number', () => {
  const { container } = render(<JupyterDrawer sceneId={FOCUS} />);
  STEPS.forEach((step, k) => {
    act(() => useDrawerStore.setState({ open: true, focus: k + 1 }));
    const callout = container.querySelector(`[data-callout="${k + 1}"]`)!;
    expect(callout, `step ${k + 1}`).toBeTruthy();
    expect(callout.textContent).toContain(String(step.n));
    expect(callout.textContent).toContain(step.label);
    // the drawer scrolled to this step's callout, inside its own cell
    expect(scrolled[scrolled.length - 1]).toBe(callout);
    const cell = callout.closest('[data-cell]')!;
    expect(cell.getAttribute('data-cell')).toBe(String(step.cell));
    expect(cell.className).toContain('is-focus');
    // its lines are lit, and only those are 'now'
    const now = [...cell.querySelectorAll('.jd__fl.is-now')].map((e) => Number(e.getAttribute('data-line')));
    expect(now).toEqual(stepLines(step, lineCount(step.cell)).map((l) => l + 1));
    if (step.note) expect(cell.textContent).toContain(step.note);
    // one big callout on screen at a time; one small one for each earlier step
    expect(container.querySelectorAll('.jd__callout:not(.jd__callout--past)').length).toBe(1);
    expect(container.querySelectorAll('.jd__callout--past').length).toBe(k);
  });
});

test('the saved output shows from the step that asks for it', () => {
  const k = STEPS.findIndex((s) => s.output);
  if (k < 0) return;
  const { container } = render(<JupyterDrawer sceneId={FOCUS} />);
  if (k > 0) {
    act(() => useDrawerStore.setState({ open: true, focus: k }));
    expect(container.querySelector(`[data-cell="${STEPS[k].cell}"] [data-output="saved"]`)).toBeNull();
  }
  act(() => useDrawerStore.setState({ open: true, focus: k + 1 }));
  expect(container.querySelector(`[data-cell="${STEPS[k].cell}"] [data-output="saved"]`)!.textContent).toContain(savedOutput(STEPS[k].cell)!);
});

test('the drawer’s own Next and Back walk the same line, and its last Next closes it and goes on', () => {
  useSceneStore.getState().setScenes([
    { id: FOCUS, chapter: 1, title: 'Focus', shot: 'city' },
    { id: 'after', chapter: 1, title: 'After', shot: 'city' },
  ]);
  useSceneStore.getState().setSettled(true);
  const { getByText, getByLabelText } = render(<JupyterDrawer sceneId={FOCUS} />);
  fireEvent.click(getByLabelText('Open in Jupyter'));
  for (let i = 1; i < STEPS.length; i++) fireEvent.click(getByText('Next ↓'));
  expect(useDrawerStore.getState().focus).toBe(STEPS.length);
  if (STEPS.length > 1) {
    fireEvent.click(getByText('‹ Back'));
    expect(useDrawerStore.getState().focus).toBe(STEPS.length - 1);
    fireEvent.click(getByText('Next ↓'));
  }
  fireEvent.click(getByText('Close · next page ›'));
  expect(useSceneStore.getState().current().id).toBe('after');
  expect(useDrawerStore.getState().open).toBe(false);
});

test('Lab 3’s drawer is unchanged: its stop, its cells to run, no focus', () => {
  const lab3 = Object.keys(LAB_STOPS).find((id) => id.startsWith('3.'))!;
  const { getByLabelText, container } = render(<JupyterDrawer sceneId={lab3} />);
  expect(getByLabelText('Run in Jupyter')).toBeTruthy();
  act(() => useDrawerStore.setState({ open: true, focus: 1 }));
  expect(container.textContent).toContain(LAB_STOPS[lab3].where);
  expect(container.querySelector('[data-callout]')).toBeNull();
  expect(container.querySelectorAll('.jd__num').length).toBeGreaterThan(0);
});
