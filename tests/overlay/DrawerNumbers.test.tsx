import { act, render } from '@testing-library/react';
import { LAB_STOPS, stopCells } from '../../src/content/labStops';
import { LAB_GUIDE, guideSteps } from '../../src/content/labGuide';
import { JupyterDrawer } from '../../src/overlay/jupyter/JupyterDrawer';
import { useDrawerStore } from '../../src/engine/presentation';
import { LAB2_FOCUS } from '../../src/content/lab2Focus';

// owner, 28 Oct ("check all"): on every page, the step bar's numbers are the cells' own numbers
beforeEach(() => useDrawerStore.getState().reset());

// a Lab 2 page with a notebook focus shows the whole notebook and its focus steps instead (FocusDrawer.test.tsx)
for (const id of Object.keys(LAB_STOPS).filter((id) => !LAB2_FOCUS[id]?.length)) {
  test(`page ${id}: each chip shows the number of the cell it lands on, and the bar agrees with "Run N cells"`, () => {
    const stop = LAB_STOPS[id];
    const runs = stopCells(stop).filter((c) => c.run);
    const c = render(<JupyterDrawer sceneId={id} />).container;
    act(() => useDrawerStore.setState({ open: true, focus: 0 }));
    const chips = () => [...c.querySelectorAll('.jd__steps .jd__step')];
    // as many numbered chips as cells to run, numbered 1..N in order, as the header says
    expect(chips().map((b) => b.textContent).filter((t) => /^\d+$/.test(t!))).toEqual(runs.map((r) => String(r.run)));
    expect(c.querySelector('.jd__todo-line')?.textContent).toContain(`Run ${runs.length} cell`);
    // stepping through: the lit chip and the lit cell carry the same number (a skipped cell: no number on either)
    const steps = guideSteps(id);
    steps.forEach((s, i) => {
      if (s.part) return;
      act(() => useDrawerStore.setState({ focus: i + 1 }));
      const lit = c.querySelector('.jd__steps .jd__step.is-on')?.textContent;
      const cell = runs.find((r) => r.index === s.block.cell);
      expect(lit, `${id} ${s.block.title}`).toBe(cell ? String(cell.run) : 'skip');
    });
    // the guide walks its cells top to bottom
    const order = (LAB_GUIDE[id] ?? []).map((b) => b.cell);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });
}
