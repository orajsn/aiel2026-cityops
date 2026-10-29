import { create } from 'zustand';
import guide from './seerGuide.json';

/**
 * Lab 1's Hands-on drawers (owner, 29 Oct): on a Lab 1 page with an entry here, a teal handle waits on the screen's
 * left edge, like Lab 3's Jupyter drawer, and opens a dark panel with the ORIGINAL workshop guide for that part
 * (owner: "lab instruction need to follow the original"), screenshots included (src/overlay/handsOn/StepsDrawer.tsx).
 *
 * The guide's text lives in seerGuide.json, generated verbatim by tools/gen-seer-guide.py with its screenshots in
 * src/assets/seer/. Nothing in it is shortened or rewritten; the only rename is the heading: the guide's "Lab 1…5"
 * shows as "Hands-on 1…5". Keyed by scene id; with WITH_LAB1 = false (src/scenes/lab1.ts) no page shows a drawer.
 */

export interface GuideStep {
  id: string;
  en: string;
  th: string;
  expected_en: string;
  expected_th: string;
  code: string[];
  images: string[];
}
export interface GuideFigure {
  id: string;
  file: string;
  caption_en: string;
  caption_th: string;
}
export interface GuideTask {
  id: string;
  title_en: string;
  title_th: string;
  steps: GuideStep[];
  figures: GuideFigure[];
}
export interface GuideLab {
  id: string;
  route: string;
  title: string;
  intro_en: string;
  intro_th: string;
  tasks: GuideTask[];
}

export const SEER_GUIDE = guide as GuideLab[];

/** the screenshots: URLs only, so the browser fetches one when the drawer shows it, not on the first load */
const URLS = import.meta.glob('../assets/seer/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

export const FIGURES: Record<string, GuideFigure> = Object.fromEntries(SEER_GUIDE.flatMap((l) => l.tasks.flatMap((t) => t.figures)).map((f) => [f.id, f]));

/** the bundled URL of a figure, or undefined when its file is missing */
export const figureUrl = (id: string): string | undefined => {
  const f = FIGURES[id];
  return f && URLS[`../assets/seer/${f.file}`];
};

/** Hands-on 3, 4 and 5 come in two paths: 3A Build (on your computer) and 3B Launch (on OCI) */
export type Route = '3a' | '3b';
/** one path through a page's part of the guide: a lab and the numbers (1-based) of its tasks shown here */
export interface HandsOnPart {
  lab: string;
  tasks: number[];
}

export interface HandsOnEntry {
  /** the handle's label, e.g. "Hands-on 4" */
  tab: string;
  /** a short line under the handle's label */
  tabSub: string;
  /** the Hands-on number: the guide's "Lab n" (handsOnTitle) */
  n: number;
  /** a page with one path, or the 3A / 3B pair (a switch in the drawer) */
  parts: { one: HandsOnPart } | Record<Route, HandsOnPart>;
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const tasksOf = (lab: string) => range(1, SEER_GUIDE.find((l) => l.id === lab)!.tasks.length);

export const LAB1_HANDS_ON: Record<string, HandsOnEntry> = {
  '1.3a': { tab: 'Hands-on', tabSub: 'Sandbox Resource List · worksheet', n: 1, parts: { one: { lab: 'lab1', tasks: [1] } } },
  '1.4': { tab: 'Hands-on 1', tabSub: 'Unstructured RAG · Tasks 2–5', n: 1, parts: { one: { lab: 'lab1', tasks: [2, 3, 4, 5] } } },
  '1.5': { tab: 'Hands-on 2', tabSub: 'Semantic Store', n: 2, parts: { one: { lab: 'lab2', tasks: tasksOf('lab2') } } },
  '1.6a': {
    tab: 'Hands-on 3',
    tabSub: 'Set up the app · 3A or 3B',
    n: 3,
    parts: { '3a': { lab: 'lab3a', tasks: range(1, 6) }, '3b': { lab: 'lab3b', tasks: range(1, 4) } },
  },
  '1.6': {
    tab: 'Hands-on 3',
    tabSub: 'Test the app · 3A or 3B',
    n: 3,
    parts: { '3a': { lab: 'lab3a', tasks: [7, 8, 9] }, '3b': { lab: 'lab3b', tasks: [5] } },
  },
  '1.7': {
    tab: 'Hands-on 4',
    tabSub: 'Record the baseline · 3A or 3B',
    n: 4,
    parts: { '3a': { lab: 'lab4-3a', tasks: [1] }, '3b': { lab: 'lab4-3b', tasks: [1] } },
  },
  '1.8': {
    tab: 'Hands-on 4',
    tabSub: 'Model routing · 3A or 3B',
    n: 4,
    parts: { '3a': { lab: 'lab4-3a', tasks: [2, 3, 4] }, '3b': { lab: 'lab4-3b', tasks: [2, 3, 4] } },
  },
  '1.9': {
    tab: 'Hands-on 5',
    tabSub: 'Security Guardrails · 3A or 3B',
    n: 5,
    parts: { '3a': { lab: 'lab5-3a', tasks: tasksOf('lab5-3a') }, '3b': { lab: 'lab5-3b', tasks: tasksOf('lab5-3b') } },
  },
};

/** the drawer for a page, or undefined when the page has none */
export const handsOnFor = (sceneId: string): HandsOnEntry | undefined => LAB1_HANDS_ON[sceneId];

export const hasRoutes = (e: HandsOnEntry): boolean => !('one' in e.parts);

/** the lab and its tasks a page shows on the chosen path */
export function handsOnPart(e: HandsOnEntry, route: Route): { lab: GuideLab; tasks: GuideTask[] } {
  const part = 'one' in e.parts ? e.parts.one : e.parts[route];
  const lab = SEER_GUIDE.find((l) => l.id === part.lab)!;
  return { lab, tasks: part.tasks.map((n) => lab.tasks[n - 1]) };
}

/** the drawer's heading: "Hands-on n · " and the guide's own title after its "Lab n —", e.g. "Hands-on 1 · Unstructured RAG" */
export const handsOnTitle = (e: HandsOnEntry, lab: GuideLab): string => `Hands-on ${e.n} · ${lab.title.replace(/^Lab\s+\S+\s+—\s+/, '')}`;

/** how many tasks a page's drawer shows on the chosen path (the clicker walks them one by one) */
export const handsOnTaskCount = (sceneId: string, route: Route = useRouteStore.getState().route): number => {
  const e = handsOnFor(sceneId);
  return e ? handsOnPart(e, route).tasks.length : 0;
};

const ROUTE_KEY = 'cityops.handsOnRoute';
function storedRoute(): Route {
  try {
    return localStorage.getItem(ROUTE_KEY) === '3b' ? '3b' : '3a';
  } catch {
    return '3a';
  }
}

/** the 3A Build / 3B Launch choice, kept across pages and remembered on this device */
export const useRouteStore = create<{ route: Route; setRoute(r: Route): void }>((set) => ({
  route: storedRoute(),
  setRoute: (route) => {
    try {
      localStorage.setItem(ROUTE_KEY, route);
    } catch {
      /* per-viewer convenience only */
    }
    set({ route });
  },
}));
