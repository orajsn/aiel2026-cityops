import { LAB2_FOCUS } from '../../src/content/lab2Focus';
import { LAB_STOPS } from '../../src/content/labStops';
import { useSceneStore } from '../../src/engine/store';
import { bindKeys } from '../../src/engine/keys';
import { focusNext, focusPrev, pagePrev, presentNext, presentPrev, stopStepCount, useDrawerStore, usePresentationStore } from '../../src/engine/presentation';

// Lab 2's notebook focus (lab2Focus.ts): Next opens the drawer on step 1, walks the steps, then closes it and goes on
const FOCUS = Object.keys(LAB2_FOCUS).find((id) => LAB2_FOCUS[id].length > 0)!;
const STEPS = LAB2_FOCUS[FOCUS].length;
// a Lab 3 page with cells to run, to check it walks as before
const LAB3 = Object.keys(LAB_STOPS).find((id) => id.startsWith('3.'))!;
const LAB3_RUNS = stopStepCount(LAB3);

const at = () => {
  const d = useDrawerStore.getState();
  return `${useSceneStore.getState().current().id}${d.open ? `:${d.focus}` : d.done ? ':done' : ''}`;
};
/** a click, then the camera arrives (and the drawers mount, which reset the drawer as the app does) */
const click = (f: () => void) => {
  const before = useSceneStore.getState().index;
  f();
  useSceneStore.getState().setSettled(true);
  if (useSceneStore.getState().index !== before) useDrawerStore.getState().reset();
  return at();
};

beforeEach(() => {
  useSceneStore.getState().setScenes([
    { id: 'before', chapter: 1, title: 'Before', shot: 'city' },
    { id: FOCUS, chapter: 1, title: 'Focus', shot: 'city' },
    { id: 'after', chapter: 1, title: 'After', shot: 'city' },
    { id: LAB3, chapter: 2, title: 'Lab 3', shot: 'city' },
  ]);
  useSceneStore.setState({ index: 0 });
  useSceneStore.getState().setSettled(true);
  useDrawerStore.getState().reset();
});

test('there is a focus page to test', () => {
  expect(STEPS).toBeGreaterThan(0);
});

test('Next: the page, the drawer on step 1, every step, then straight on to the next page with the drawer closed', () => {
  const forward = [FOCUS, ...Array.from({ length: STEPS }, (_, i) => `${FOCUS}:${i + 1}`), 'after'];
  expect(forward.map(() => click(presentNext))).toEqual(forward);
});

test('Back walks the steps in reverse: from the page after it lands on the last step, then closes, then the page before', () => {
  useSceneStore.setState({ index: 2 });
  const back = [...Array.from({ length: STEPS }, (_, i) => `${FOCUS}:${STEPS - i}`), FOCUS, 'before'];
  expect(back.map(() => click(presentPrev))).toEqual(back);
});

test('the same line without Presentation mode: the arrows and Page Down/Up', () => {
  const unbind = bindKeys(useSceneStore, { jump() {}, notes() {}, lang() {} });
  const press = (key: string) => click(() => window.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true })));
  useSceneStore.setState({ index: 1 });
  expect(press('ArrowRight')).toBe(`${FOCUS}:1`);
  expect(press('PageDown')).toBe(STEPS > 1 ? `${FOCUS}:2` : 'after');
  expect(press('ArrowLeft')).toBe(STEPS > 1 ? `${FOCUS}:1` : `${FOCUS}:${STEPS}`);
  // at step 1, Back closes the drawer; once closed, the page before
  useSceneStore.setState({ index: 1 });
  useDrawerStore.setState({ open: true, focus: 1, done: false });
  expect(press('PageUp')).toBe(FOCUS);
  expect(press('PageUp')).toBe('before');
  unbind();
});

test('closed by hand mid-way, Next opens it again where it was', () => {
  useSceneStore.setState({ index: 1 });
  focusNext();
  if (STEPS > 1) focusNext();
  useDrawerStore.getState().setOpen(false);
  focusNext();
  expect(at()).toBe(`${FOCUS}:${Math.min(2, STEPS)}`);
});

test('nothing happens to focus before the camera arrives, and on pages without a focus', () => {
  useSceneStore.setState({ index: 1, settled: false });
  expect(focusNext()).toBe(false);
  useSceneStore.setState({ index: 2, settled: true });
  expect(focusNext()).toBe(false);
  expect(focusPrev()).toBe(false);
});

test('the page before, from the first page, stays put and opens nothing', () => {
  pagePrev();
  expect(at()).toBe('before');
});

test('Lab 3 unchanged: its clicker walk opens on the drawer start, each cell, closes, then moves on', () => {
  usePresentationStore.getState().setOn(true);
  useSceneStore.setState({ index: 3 });
  const walk = [`${LAB3}:0`, ...Array.from({ length: LAB3_RUNS }, (_, i) => `${LAB3}:${i + 1}`), `${LAB3}:done`];
  expect(walk.map(() => click(presentNext))).toEqual(walk);
  usePresentationStore.getState().setOn(false);
});
