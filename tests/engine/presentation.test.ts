import { LAB_STOPS } from '../../src/content/labStops';
import { useSceneStore } from '../../src/engine/store';
import { bindKeys } from '../../src/engine/keys';
import { useDrawerStore, presentNext, presentPrev, usePresentationStore, stopStepCount } from '../../src/engine/presentation';

// a Lab 3 page: Lab 2 shows its code inside the page, with no drawer to walk (lab2Notebook.ts)
const STOP = Object.keys(LAB_STOPS).find((id) => id.startsWith('3.'))!;
const RUNS = stopStepCount(STOP);

/** where the walk is: the page, and the drawer if it is open */
const at = () => {
  const d = useDrawerStore.getState();
  return `${useSceneStore.getState().current().id}${d.open ? `:${d.focus}` : d.done ? ':done' : ''}`;
};
/** a click on a page: the camera has arrived, so the page (and its drawer) is there */
const click = (f: () => void) => {
  f();
  useSceneStore.getState().setSettled(true);
  return at();
};

beforeEach(() => {
  useSceneStore.getState().setScenes([
    { id: 'before', chapter: 1, title: 'Before', shot: 'city' },
    { id: STOP, chapter: 1, title: 'Lab', shot: 'city' },
    { id: 'after', chapter: 1, title: 'After', shot: 'city' },
  ]);
  useSceneStore.getState().setSettled(true);
  useDrawerStore.getState().reset();
});

test('Next walks every page and every Jupyter cell in one line', () => {
  const forward = [STOP, `${STOP}:0`, ...Array.from({ length: RUNS }, (_, i) => `${STOP}:${i + 1}`), `${STOP}:done`, 'after'];
  expect(forward.map(() => click(presentNext))).toEqual(forward);
});

test('Back on the page walks the cells in reverse, then goes to the page before', () => {
  useSceneStore.setState({ index: 1 });
  for (let i = 0; i < RUNS + 2; i++) click(presentNext);
  expect(at()).toBe(`${STOP}:done`);
  const back = [...Array.from({ length: RUNS }, (_, i) => `${STOP}:${RUNS - i}`), `${STOP}:0`, STOP, 'before'];
  expect(back.map(() => click(presentPrev))).toEqual(back);
});

test('Back from the page after lands on the page start, drawer closed, like a slide', () => {
  useSceneStore.setState({ index: 1 });
  for (let i = 0; i < RUNS + 3; i++) click(presentNext);
  expect(at()).toBe('after');
  expect(click(presentPrev)).toBe(STOP);
});

describe('the clicker keys', () => {
  let unbind: () => void;
  const press = (key: string, extra: Partial<KeyboardEventInit> = {}) => {
    const e = new KeyboardEvent('keydown', { key, cancelable: true, ...extra });
    window.dispatchEvent(e);
    useSceneStore.getState().setSettled(true);
    return e;
  };
  beforeEach(() => {
    unbind = bindKeys(useSceneStore, { jump() {}, notes() {}, lang() {}, presenting: () => usePresentationStore.getState().on });
  });
  afterEach(() => {
    unbind();
    usePresentationStore.getState().setOn(false);
    usePresentationStore.setState({ blank: false });
  });

  test('presentation mode off: Page Down changes the page, as today', () => {
    useSceneStore.setState({ index: 1 });
    press('PageDown');
    expect(at()).toBe('after');
  });

  test('presentation mode on: Page Down and Page Up walk the drawer too; arrows do the same', () => {
    usePresentationStore.getState().setOn(true);
    useSceneStore.setState({ index: 1 });
    press('PageDown');
    expect(at()).toBe(`${STOP}:0`);
    press('ArrowRight');
    expect(at()).toBe(`${STOP}:1`);
    press('PageUp');
    press('ArrowLeft');
    expect(at()).toBe(STOP);
  });

  test('F5 never reloads the show, and B blanks the screen and brings it back', () => {
    usePresentationStore.getState().setOn(true);
    expect(press('F5').defaultPrevented).toBe(true);
    expect(press('F5', { shiftKey: true }).defaultPrevented).toBe(true);
    press('b');
    expect(usePresentationStore.getState().blank).toBe(true);
    // while blank, the clicker brings the screen back first instead of moving on
    useSceneStore.setState({ index: 0 });
    press('PageDown');
    expect(usePresentationStore.getState().blank).toBe(false);
    expect(at()).toBe('before');
    press('.');
    expect(usePresentationStore.getState().blank).toBe(true);
  });
});
