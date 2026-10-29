import { create } from 'zustand';
import { LAB_STOPS, stopCells } from '../content/labStops';
import { guideSteps } from '../content/labGuide';
import { handsOnTaskCount } from '../content/lab1HandsOn';
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

export const useDrawerStore = create<DrawerState>((set) => ({
  open: false,
  focus: 0,
  done: false,
  setOpen: (open) => set({ open }),
  setFocus: (focus) => set({ focus }),
  reset: () => set({ open: false, focus: 0, done: false }),
}));

// every page starts with its drawer closed, however it was reached (clicker, jump menu, address)
useSceneStore.subscribe((s, prev) => {
  if (s.index !== prev.index) useDrawerStore.getState().reset();
});

/** how many steps a page's drawer has: its guide's sections and parts (labGuide.ts), else its cells to run, else its Lab 1 hands-on steps */
export function stopStepCount(id: string): number {
  const stop = LAB_STOPS[id];
  // Lab 1's Hands-on drawer (lab1HandsOn.ts): opens on its overview, then one step per task on the chosen 3A / 3B path
  if (!stop) return handsOnTaskCount(id);
  return guideSteps(id).length || stopCells(stop).filter((c) => c.run).length;
}

/** the steps of the drawer on the page now; 0 when the page has none, or is not on screen yet */
function runsHere(): number {
  const { settled } = useSceneStore.getState();
  return settled ? stopStepCount(useSceneStore.getState().current().id) : 0;
}

export function presentNext() {
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
  const runs = runsHere();
  const d = useDrawerStore.getState();
  if (runs) {
    if (d.done) return useDrawerStore.setState({ open: true, focus: runs, done: false });
    if (d.open && d.focus > 0) return d.setFocus(d.focus - 1);
    if (d.open) return d.setOpen(false);
  }
  useSceneStore.getState().prev();
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
