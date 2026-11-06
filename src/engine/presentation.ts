import { create } from 'zustand';
import { LAB_STOPS, stopCells } from '../content/labStops';
import { guideSteps } from '../content/labGuide';
import { handsOnStepCount } from '../content/lab1HandsOn';
import { LAB2_FOCUS } from '../content/lab2Focus';
import { NB_PAGES, noDrawer } from '../content/lab2Notebook';
import { useSceneStore } from './store';

/**
 * Presentation mode (owner, 27 Oct): a PowerPoint clicker runs the whole show. Its Next walks every page and,
 * on a page with a Jupyter stop, the drawer too: open it, each cell to run, close it, then the next page.
 * Back walks the same line in reverse on the page, and from a page's start goes to the page before, which
 * opens at its own start like a slide. Off by default; remembered on this device.
 */

/** the Jupyter drawer on the page now: open or not, the cell in focus (0 = not started), done once closed after the last */
export interface DrawerState {
  open: boolean;
  focus: number;
  done: boolean;
  setOpen(open: boolean): void;
  setFocus(focus: number): void;
  reset(): void;
}

/**
 * Back from the page after a Lab 2 focus page lands on its last step, drawer open (resumeFocus). Every reset on that
 * page (the page change itself, the drawers mounting once the camera arrives) keeps it, until the next click.
 */
let resume: { id: string; focus: number } | null = null;

export const useDrawerStore = create<DrawerState>((set) => ({
  open: false,
  focus: 0,
  done: false,
  setOpen: (open) => ((resume = null), set({ open })),
  setFocus: (focus) => ((resume = null), set({ focus })),
  reset: () => {
    if (resume && resume.id === useSceneStore.getState().current()?.id) return set({ open: true, focus: resume.focus, done: false });
    resume = null;
    set({ open: false, focus: 0, done: false });
  },
}));

// every page starts with its drawer closed, however it was reached (clicker, jump menu, address)
useSceneStore.subscribe((s, prev) => {
  if (s.index !== prev.index) useDrawerStore.getState().reset();
});

/** how many steps a page's drawer has: its guide's sections and parts (labGuide.ts), else its cells to run, else its Lab 1 hands-on steps */
export function stopStepCount(id: string): number {
  if (focusStepCount(id)) return focusStepCount(id);
  if (noDrawer(id)) return 0;
  const stop = LAB_STOPS[id];
  // Lab 1's Hands-on drawer (lab1HandsOn.ts): opens on its overview, then one press per guide step on the chosen 3A / 3B path
  if (!stop) return handsOnStepCount(id);
  return guideSteps(id).length || stopCells(stop).filter((c) => c.run).length;
}

/** the steps of the drawer on the page now; 0 when the page has none, or is not on screen yet */
function runsHere(): number {
  const { settled } = useSceneStore.getState();
  return settled ? stopStepCount(useSceneStore.getState().current().id) : 0;
}

/* ---------- Lab 2's notebook focus (src/content/lab2Focus.ts): the same line for every Next and Back ---------- */

/** how many focus steps a page has (0: none, the page behaves as before). A notebook page (lab2Notebook.ts) shows its first step at once, so Next has one fewer */
/** pages whose notebook data stays but whose panel no longer steps through it (2.2c became the dimensions page on 3 Nov) */
const NO_STEPS = new Set(['2.2c']);
/**
 * Pages whose picture builds in steps inside one page (owner, 4 Nov): the page shows its first part at once and each Next adds the next
 * (the four glasses of 3.3b: Volume at once, then Relevance, Accuracy, Timing). The step is the drawer store's `focus` while `open`;
 * these pages have no drawer on screen, the store only counts the presses.
 */
export const PAGE_STEPS: Record<string, number> = { '3.2a': 1, '3.3b': 3, '3.6m': 18 };
// 3.6m: the whole map at once, then each stop of its Parts 1 to 6 and the two days (src/content/lab3Map.ts)
// 3.2a: the desk holds Mercer's notes until Next; the next press closes the chat and wipes the desk (owner, 4 Nov)
export const focusStepCount = (id: string): number => (PAGE_STEPS[id] ?? (NO_STEPS.has(id) ? 0 : NB_PAGES[id] ? NB_PAGES[id].steps.length - 1 : LAB2_FOCUS[id]?.length ?? 0));

/** the focus page on screen now, once its camera has arrived */
function focusHere(): number {
  const s = useSceneStore.getState();
  return s.settled ? focusStepCount(s.current().id) : 0;
}

/**
 * Next on a focus page (any Next: arrow, Page Down, clicker, the on-screen buttons): open the drawer on step 1 (or
 * where it was closed by hand), then each step, then close it and go to the next page. False when the page has no focus.
 */
export function focusNext(): boolean {
  const steps = focusHere();
  if (!steps) return false;
  resume = null;
  const d = useDrawerStore.getState();
  if (!d.open) useDrawerStore.setState({ open: true, focus: Math.min(steps, Math.max(1, d.focus)), done: false });
  else if (d.focus < steps) useDrawerStore.setState({ focus: d.focus + 1 });
  else {
    useDrawerStore.setState({ open: false, done: true });
    useSceneStore.getState().next();
  }
  return true;
}

/** Back on a focus page: the steps in reverse, then close the drawer. False once it is closed: the page before, as usual. */
export function focusPrev(): boolean {
  const steps = focusHere();
  if (!steps) return false;
  const d = useDrawerStore.getState();
  if (!d.open) return false;
  resume = null;
  if (d.focus > 1) useDrawerStore.setState({ focus: d.focus - 1 });
  else useDrawerStore.setState({ open: false, focus: 0, done: false });
  return true;
}

/** after a move to the page before: a focus page opens where Next left it, on its last step */
export function resumeFocus() {
  const id = useSceneStore.getState().current().id;
  const steps = focusStepCount(id);
  if (!steps) return;
  resume = { id, focus: steps };
  useDrawerStore.setState({ open: true, focus: steps, done: false });
}

/** the page before (Back once the page's drawer is closed), resuming a focus page at its end */
export function pagePrev(store: { getState(): { index: number; prev(): void } } = useSceneStore) {
  const before = store.getState().index;
  store.getState().prev();
  if (store.getState().index !== before) resumeFocus();
}

export function presentNext() {
  if (focusNext()) return;
  const runs = runsHere();
  const d = useDrawerStore.getState();
  if (runs && !d.done) {
    if (!d.open) return useDrawerStore.setState({ open: true, focus: 0 });
    if (d.focus < runs) return d.setFocus(d.focus + 1);
    return useDrawerStore.setState({ open: false, done: true });
  }
  useSceneStore.getState().next();
}

export function presentPrev() {
  if (focusPrev()) return;
  if (focusHere()) return pagePrev();
  const runs = runsHere();
  const d = useDrawerStore.getState();
  if (runs) {
    if (d.done) return useDrawerStore.setState({ open: true, focus: runs, done: false });
    if (d.open && d.focus > 0) return d.setFocus(d.focus - 1);
    if (d.open) return d.setOpen(false);
  }
  pagePrev();
}

const KEY = 'cityops.presentation';

function storedOn(): boolean {
  try {
    return localStorage.getItem(KEY) === 'on';
  } catch {
    return false;
  }
}

export interface PresentationState {
  on: boolean;
  /** the clicker's blank-screen button: the show fades to the background colour */
  blank: boolean;
  setOn(on: boolean): void;
  toggleBlank(): void;
}

export const usePresentationStore = create<PresentationState>((set) => ({
  on: storedOn(),
  blank: false,
  setOn: (on) => {
    try {
      localStorage.setItem(KEY, on ? 'on' : 'off');
    } catch {
      /* per-viewer convenience only */
    }
    set({ on, blank: false });
  },
  toggleBlank: () => set((s) => ({ blank: !s.blank })),
}));
