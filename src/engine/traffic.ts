import { create } from 'zustand';
import trafficJson from '../content/traffic.json';
import { LIMITS, normalizeTraffic, type Fleet, type RoutePoint, type TrafficConfig, type TrafficKind } from '../content/traffic';
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
  /** unsaved changes */
  dirty: boolean;
  setEditing(v: boolean): void;
  setKind(k: TrafficKind): void;
  select(i: number): void;
  setFleet(kind: TrafficKind, patch: Partial<Omit<Fleet, 'routes'>>): void;
  addPoint(p: RoutePoint): void;
  undoPoint(): void;
  newRoute(): void;
  addRoutes(kind: TrafficKind, routes: { points: RoutePoint[] }[]): void;
  deleteRoute(i: number): void;
  replace(config: TrafficConfig, dirty?: boolean): void;
}

export const useTrafficStore = create<TrafficState>((set, get) => ({
  config: normalizeTraffic(trafficJson),
  editing: false,
  kind: 'cars',
  route: -1,
  dirty: false,
  setEditing: (editing) => set({ editing }),
  setKind: (kind) => set({ kind, route: get().config[kind].routes.length - 1 }),
  select: (route) => set({ route }),
  setFleet: (kind, patch) => {
    const config = normalizeTraffic({ ...get().config, [kind]: { ...get().config[kind], ...patch } });
    // keep min <= max while one slider passes the other
    if (patch.speedMin !== undefined && patch.speedMin > get().config[kind].speedMax) config[kind].speedMax = config[kind].speedMin = patch.speedMin;
    if (patch.speedMax !== undefined && patch.speedMax < get().config[kind].speedMin) config[kind].speedMin = config[kind].speedMax = patch.speedMax;
    set({ config, dirty: true });
  },
  addPoint: (p) => {
    const { config, kind } = get();
    let route = get().route;
    const routes = config[kind].routes.map((r) => ({ points: [...r.points] }));
    if (route < 0 || route >= routes.length) {
      if (routes.length >= LIMITS.routes) return;
      routes.push({ points: [] });
      route = routes.length - 1;
    }
    if (routes[route].points.length >= LIMITS.points) return;
    routes[route].points.push([Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000]);
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, route, dirty: true });
  },
  undoPoint: () => {
    const { config, kind, route } = get();
    if (route < 0) return;
    const routes = config[kind].routes.map((r) => ({ points: [...r.points] }));
    routes[route]?.points.pop();
    if (routes[route] && routes[route].points.length === 0) {
      routes.splice(route, 1);
      set({ config: { ...config, [kind]: { ...config[kind], routes } }, route: routes.length - 1, dirty: true });
      return;
    }
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, dirty: true });
  },
  newRoute: () => set({ route: -1 }),
  addRoutes: (kind, add) => {
    const config = get().config;
    const routes = [...config[kind].routes, ...add].slice(0, LIMITS.routes);
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, kind, route: routes.length - 1, dirty: true });
  },
  deleteRoute: (i) => {
    const { config, kind } = get();
    const routes = config[kind].routes.filter((_, j) => j !== i);
    set({ config: { ...config, [kind]: { ...config[kind], routes } }, route: Math.min(get().route, routes.length - 1), dirty: true });
  },
  replace: (config, dirty = false) => set({ config: normalizeTraffic(config), dirty, route: -1 }),
}));

/** routes still being drawn may have one point: only routes of two points or more drive */
export function drivableRoutes(f: Fleet) {
  return f.routes.filter((r) => r.points.length >= 2);
}

/** read the saved traffic fresh from the dev server (the file is not watched, so a save never reloads the page) */
export async function loadTraffic(): Promise<void> {
  try {
    const r = await fetch(at('__traffic'), { cache: 'no-store' });
    if (r.ok && (r.headers.get('content-type') ?? '').includes('json')) useTrafficStore.getState().replace(await r.json());
  } catch {
    /* no dev server: the bundled traffic.json stands */
  }
}

/** save to the project; 'failed' if the dev server is not reachable or refused it */
export async function persistTraffic(): Promise<'project' | 'failed'> {
  try {
    const r = await fetch(at('__traffic'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(useTrafficStore.getState().config) });
    if (r.ok) {
      useTrafficStore.setState({ dirty: false });
      return 'project';
    }
  } catch {
    /* no dev server */
  }
  return 'failed';
}
