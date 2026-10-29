import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { StepsDrawer } from '../../src/overlay/handsOn/StepsDrawer';
import { FIGURES, LAB1_HANDS_ON, SEER_GUIDE, handsOnPart, useRouteStore } from '../../src/content/lab1HandsOn';
import { LAB_STOPS } from '../../src/content/labStops';
import { useDrawerStore, stopStepCount, presentNext } from '../../src/engine/presentation';
import { useSceneStore } from '../../src/engine/store';
import { useUiStore } from '../../src/engine/ui';

beforeEach(() => {
  useDrawerStore.getState().reset();
  useRouteStore.getState().setRoute('3a');
  useUiStore.setState({ lang: 'en' });
});

const lab = (id: string) => SEER_GUIDE.find((l) => l.id === id)!;
const openOn = (id: string) => {
  const r = render(<StepsDrawer sceneId={id} />);
  fireEvent.click(r.getByRole('button', { name: `Open ${LAB1_HANDS_ON[id].tab}` }));
  return r;
};

test('the handle shows only on a page with a Lab 1 hands-on entry', () => {
  for (const id of ['1.0', '1.3', '0.1', ...Object.keys(LAB_STOPS)]) {
    const { container, unmount } = render(<StepsDrawer sceneId={id} />);
    expect(container.innerHTML).toBe('');
    unmount();
  }
  for (const id of Object.keys(LAB1_HANDS_ON)) {
    const { getByRole, unmount } = render(<StepsDrawer sceneId={id} />);
    expect(getByRole('button', { name: `Open ${LAB1_HANDS_ON[id].tab}` })).toBeTruthy();
    unmount();
  }
});

test('opens on the overview, then each task shows every step verbatim with its expected result and code', () => {
  const { getByRole, getAllByRole, container } = openOn('1.4');
  const dialog = getByRole('dialog');
  expect(dialog.textContent).toContain('Hands-on 1 · Unstructured RAG');
  expect(dialog.textContent).toContain(lab('lab1').intro_en);
  // Overview + Tasks 2-5
  expect(getAllByRole('tab').map((t) => t.textContent)).toEqual(['Overview', 'Task 2', 'Task 3', 'Task 4', 'Task 5']);
  for (let k = 1; k <= 4; k++) {
    fireEvent.click(getAllByRole('tab')[k]);
    const task = lab('lab1').tasks[k];
    expect(container.querySelectorAll('.hd__step')).toHaveLength(task.steps.length);
    for (const s of task.steps) {
      const li = container.querySelector(`[data-step-id="${s.id}"]`)!;
      expect(li.querySelector('.hd__st')!.textContent).toBe(s.en);
      if (s.expected_en) expect(li.querySelector('.hd__exp')!.textContent).toBe(`Expected result: ${s.expected_en}`);
      expect([...li.querySelectorAll('.hd__code')].map((e) => e.textContent)).toEqual(s.code);
      expect([...li.querySelectorAll('[data-figure]')].map((e) => e.getAttribute('data-figure'))).toEqual(s.images);
    }
  }
  fireEvent.click(getByRole('button', { name: 'Close Hands-on 1' }));
  expect(useDrawerStore.getState().open).toBe(false);
});

test('no red anywhere in the drawer', () => {
  for (const id of Object.keys(LAB1_HANDS_ON)) {
    const { container, getAllByRole, unmount } = openOn(id);
    for (const tab of getAllByRole('tab')) {
      fireEvent.click(tab);
      expect(container.innerHTML).not.toMatch(/--red|#c74634|\bred\b/i);
    }
    unmount();
    useDrawerStore.getState().reset();
  }
});

test('a screenshot opens large with its caption, and closes', async () => {
  const { container, getAllByRole } = openOn('1.4');
  fireEvent.click(getAllByRole('tab')[4]); // Task 5: the data sync connector, 8 figures
  const shots = container.querySelectorAll('img[src]');
  expect(shots.length).toBeGreaterThan(0);
  const shot = container.querySelector('[data-figure]')! as HTMLElement;
  const id = shot.getAttribute('data-figure')!;
  fireEvent.click(shot);
  const lb = container.querySelector('.hd__lb')!;
  expect(lb).toBeTruthy();
  expect(lb.querySelector('figcaption')!.textContent).toBe(FIGURES[id].caption_en);
  expect(lb.querySelector('img')!.getAttribute('src')).toBeTruthy();
  act(() => void fireEvent.keyDown(window, { key: 'Escape' }));
  await waitFor(() => expect(container.querySelector('.hd__lb')).toBeNull());
});

test('the 3A / 3B switch changes the tasks and is remembered across pages', () => {
  const first = openOn('1.6a');
  expect(first.getAllByRole('tab')).toHaveLength(1 + 6);
  expect(first.getByRole('dialog').textContent).toContain('Hands-on 3 · Build the Sample Application');
  fireEvent.click(first.getByRole('radio', { name: '3B Launch' }));
  expect(useRouteStore.getState().route).toBe('3b');
  expect(first.getAllByRole('tab')).toHaveLength(1 + 4);
  expect(first.getByRole('dialog').textContent).toContain('Hands-on 3 · Launch the Sample Application');
  expect(stopStepCount('1.6a')).toBe(4);
  first.unmount();
  useDrawerStore.getState().reset();
  // the next page opens on the same path
  const next = openOn('1.6');
  expect(next.getByRole('radio', { name: '3B Launch' }).getAttribute('aria-checked')).toBe('true');
  fireEvent.click(next.getAllByRole('tab')[1]);
  expect(next.container.querySelectorAll('.hd__step')).toHaveLength(lab('lab3b').tasks[4].steps.length);
  // a page with one path has no switch
  next.unmount();
  useDrawerStore.getState().reset();
  expect(openOn('1.5').queryByRole('radio')).toBeNull();
});

test('Thai shows the guide in Thai', () => {
  useUiStore.setState({ lang: 'th' });
  const { container, getAllByRole, getByRole } = openOn('1.9');
  expect(getByRole('dialog').textContent).toContain(lab('lab5-3a').intro_th);
  fireEvent.click(getAllByRole('tab')[1]);
  const s = lab('lab5-3a').tasks[0].steps[0];
  const li = container.querySelector(`[data-step-id="${s.id}"]`)!;
  expect(li.querySelector('.hd__st')!.textContent).toBe(s.th);
  expect(container.querySelector('.hd')!.getAttribute('lang')).toBe('th');
  expect(container.querySelector('.hd__exp')!.textContent).toContain('ผลลัพธ์ที่คาดหวัง');
});

test('the clicker opens the drawer, walks it task by task, closes it, then goes on', () => {
  const n = handsOnPart(LAB1_HANDS_ON['1.8'], '3a').tasks.length;
  expect(stopStepCount('1.8')).toBe(n);
  expect(stopStepCount('1.0')).toBe(0);
  useSceneStore.getState().setScenes([
    { id: '1.8', chapter: 3, title: 'Model routing', shot: 'city' },
    { id: 'after', chapter: 3, title: 'After', shot: 'city' },
  ]);
  useSceneStore.setState({ index: 0 });
  useSceneStore.getState().setSettled(true);
  const { container } = render(<StepsDrawer sceneId="1.8" />);
  act(() => presentNext());
  expect(useDrawerStore.getState().open).toBe(true);
  expect(container.querySelector('.hd__ttab.is-on')!.textContent).toBe('Overview');
  for (let i = 0; i < n; i++) act(() => presentNext());
  expect(useDrawerStore.getState().focus).toBe(n);
  expect(container.querySelector('.hd__ttab.is-on')!.textContent).toBe('Task 4');
  act(() => presentNext());
  expect(useDrawerStore.getState().open).toBe(false);
  act(() => presentNext());
  expect(useSceneStore.getState().current().id).toBe('after');
});

test('the open drawer covers about 80% of the stage, each screenshot beside its step', () => {
  const { getByRole, getAllByRole, container } = openOn('1.4');
  expect(getByRole('dialog').style.width).toBe('1536px');
  fireEvent.click(getAllByRole('tab')[4]);
  for (const s of lab('lab1').tasks[4].steps) {
    const li = container.querySelector(`[data-step-id="${s.id}"]`)!;
    expect(li.classList.contains('hd__step--shots'), s.id).toBe(s.images.length > 0);
    if (s.images.length) expect(li.querySelector('.hd__body > .hd__text + .hd__shots')).toBeTruthy();
  }
});
