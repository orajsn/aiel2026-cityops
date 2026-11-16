import { create } from 'zustand';
import trafficJson from '../content/traffic.json';
import { LIMITS, normalizeTraffic, type Fleet, type RoutePoint, type RouteSettings, type TrafficConfig, type TrafficKind, type TrafficRoute } from '../content/traffic';
import { at } from './base';

/**
 * Traffic mode (owner tool, next to Camera mode): draw boat and car routes on the map and set how many
 * vehicles, their speed range and the cars' size. Changes show at once; Save writes src/content/traffic.json
 * through the dev server (/__traffic), which keeps the previous file as traffic.prev.json.
 */
interface TrafficState {
  config: TrafficConfig;
  editing: boolean;
  kind: TrafficKind;
  /** the route being drawn (index into config[kind].routes), -1 = none yet */
  route: number;
  /** the drawn point picked for moving or deleting */
  point: { route: number; index: number } | null;
  /** unsaved changes */
  dirty: boolean;
  /** when unsaved work was brought back from this browser (ms since 1970), for the bar's note */
  restored: number | null;
  setEditing(v: boolean): void;
  setKind(k: TrafficKind): void;
  select(i: number): void;
  /** the picked route's count, speeds and size; with no route picked, the starting values for the next route (and the river boats) */
  setFleet(kind: TrafficKind, patch: Partial<RouteSettings>): void;
  addPoint(p: RoutePoint): void;
  undoPoint(): void;
  newRoute(): void;
  addRoutes(kind: TrafficKind, routes: TrafficRoute[]): void;
  selectPoint(p: { route: number; index: number } | null): void;
  movePoint(p: RoutePoint): void;
  deletePoint(): void;
  deleteRoute(i: number): void;
  replace(config: TrafficConfig, dirty?: boolean): void;
}

export const useTrafficStore = create<TrafficState>((set, get) => ({
  config: normalizeTraffic(trafficJson),
  editing: false,
  kind: 'cars',
  route: -1,
  point: null,
  dirty: false,
  restored: null,
  setEditing: (editing) => set({ editing, point: null }),
  setKind: (kind) => set({ kind, route: get().config[kind].routes.length - 1, point: null }),
  select: (route) => set({ route }),
  setFleet: (kind, patch) => {
    const { config, route } = get();
    const fleet = config[kind];
    const target = route >= 0 && route < fleet.routes.length ? fleet.routes[route] : fleet;
    const next = { ...target, ...patch };
    // keep slowest <= fastest while one slider passes the other
    if (patch.speedMin !== undefined && patch.speedMin > target.speedMax) next.speedMax = patch.speedMin;
    if (patch.speedMax !== undefined && patch.speedMax < target.speedMin) next.speedMin = patch.speedMax;
    const raw = target === fleet ? { ...fleet, ...next } : { ...fleet, routes: fleet.routes.map((r, i) => (i === route ? { ...r, ...next } : r)) };
    set({ config: normalizeTraffic({ ...config, [kind]: raw }), dirty: true });
  },
  addPoint: (p) => {
    const { config, kind } = get();
    let route = get().route;
    const routes = config[kind].routes.map((r) => ({ ...r, points: [...r.points] }));
    if (route < 0 || route >= routes.length) {
      if (routes.length >= LIMITS.routes) return;
      const { count, speedMin, speedMax, size } = config[kind];
      routes.push({ points: [], count, speedMin, speedMax, size });
      route = routes.length - 1;
    }
    if (routes[route].points.length >= LIMITS.points) return;
    routes[route].points.push([Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000]);
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, route, point: null, dirty: true });
  },
  undoPoint: () => {
    const { config, kind, route } = get();
    if (route < 0) return;
    const routes = config[kind].routes.map((r) => ({ ...r, points: [...r.points] }));
    routes[route]?.points.pop();
    if (routes[route] && routes[route].points.length === 0) {
      routes.splice(route, 1);
      set({ config: { ...config, [kind]: { ...config[kind], routes } }, route: routes.length - 1, dirty: true });
      return;
    }
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, dirty: true });
  },
  newRoute: () => set({ route: -1, point: null }),
  selectPoint: (point) => set(point ? { point, route: point.route } : { point: null }),
  movePoint: (p) => {
    const { config, kind, point } = get();
    if (!point) return;
    const routes = config[kind].routes.map((r) => ({ ...r, points: [...r.points] }));
    if (!routes[point.route]?.points[point.index]) return;
    routes[point.route].points[point.index] = [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000];
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, dirty: true });
  },
  deletePoint: () => {
    const { config, kind, point } = get();
    if (!point) return;
    const routes = config[kind].routes.map((r) => ({ ...r, points: [...r.points] }));
    routes[point.route]?.points.splice(point.index, 1);
    let route = point.route;
    if (routes[point.route] && routes[point.route].points.length === 0) {
      routes.splice(point.route, 1);
      route = routes.length - 1;
    }
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, route, point: null, dirty: true });
  },
  addRoutes: (kind, add) => {
    const config = get().config;
    const routes = [...config[kind].routes, ...add].slice(0, LIMITS.routes);
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, kind, route: routes.length - 1, dirty: true });
  },
  deleteRoute: (i) => {
    const { config, kind } = get();
    const routes = config[kind].routes.filter((_, j) => j !== i);
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, route: Math.min(get().route, routes.length - 1), point: null, dirty: true });
  },
  replace: (config, dirty = false) => set({ config: normalizeTraffic(config), dirty, route: -1, point: null }),
}));

/** routes still being drawn may have one point: only routes of two points or more drive */
export function drivableRoutes(f: Fleet) {
  return f.routes.filter((r) => r.points.length >= 2);
}

/**
 * Unsaved work is kept in this browser (owner, 25 Oct: six routes were lost to a save that could not reach the
 * server), so a failed save or a reload never loses it; a good save clears it.
 */
export const DRAFT_KEY = 'cityops.trafficDraft';
const keepDraft = (config: TrafficConfig) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ at: Date.now(), config }));
  } catch {
    /* storage blocked: nothing kept */
  }
};
const dropDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage blocked */
  }
};
useTrafficStore.subscribe((s, prev) => {
  if (s.dirty && s.config !== prev.config) keepDraft(s.config);
});

/** read the saved traffic fresh from the dev server (the file is not watched, so a save never reloads the page), then any unsaved work kept in this browser */
export async function loadTraffic(): Promise<void> {
  if (import.meta.env.DEV) try {
    const r = await fetch(at('__traffic'), { cache: 'no-store' });
    if (r.ok && (r.headers.get('content-type') ?? '').includes('json')) useTrafficStore.getState().replace(await r.json());
  } catch {
    /* no dev server: the bundled traffic.json stands */
  }
  try {
    const kept = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
    if (kept?.config) {
      useTrafficStore.getState().replace(kept.config, true);
      useTrafficStore.setState({ restored: typeof kept.at === 'number' ? kept.at : Date.now() });
    }
  } catch {
    /* storage blocked or a broken draft: the saved file stands */
  }
}

/** save to the project; 'failed' if the dev server is not reachable or refused it */
export async function persistTraffic(): Promise<'project' | 'failed'> {
  if (!import.meta.env.DEV) return 'failed';
  try {
    const r = await fetch(at('__traffic'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(useTrafficStore.getState().config) });
    if (r.ok) {
      useTrafficStore.setState({ dirty: false, restored: null });
      dropDraft();
      return 'project';
    }
  } catch {
    /* no dev server */
  }
  return 'failed';
}
