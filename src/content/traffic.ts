/**
 * Traffic on the map (owner, 25 Oct): boats and cars on routes the owner draws in Traffic mode, with how many,
 * a speed range (each vehicle gets its own speed inside it) and, for cars, a size. Saved to
 * src/content/traffic.json through the dev server (/__traffic). Pure data and rules, shared by the app and
 * vite.config.ts (which cleans every save with normalizeTraffic before writing it).
 *
 * With no boat route drawn, boats follow the real river (src/world/Boats.tsx) as they always have. Cars start on
 * Harbor Bridge's two lanes (owner, 25 Oct: "I really want the car to go above the bridge").
 */
import { bridgeLanes } from '../world/bridgeFrame';

export type TrafficKind = 'boats' | 'cars';
export type RoutePoint = [number, number];
/** how many vehicles, how fast (each gets its own speed between slowest and fastest) and, for cars, how big */
export interface RouteSettings {
  count: number;
  /** 1 (slowest) to 10 (fastest) */
  speedMin: number;
  speedMax: number;
  /** 1 = true to scale; real cars are invisible from city height, so they are drawn bigger. Boats stay 1. */
  size: number;
}
/** a drawn route with its own settings (owner, 25 Oct: "each route should have its own amount of car, speed and size") */
export interface TrafficRoute extends RouteSettings {
  points: RoutePoint[];
}
/**
 * One kind of traffic: its routes, plus settings of its own that serve as the starting values for a new route and,
 * for boats with no route drawn, the river boats.
 */
export interface Fleet extends RouteSettings {
  routes: TrafficRoute[];
}
export interface TrafficConfig {
  boats: Fleet;
  cars: Fleet;
}

export const LIMITS = {
  /** per route (and the river boats) */
  boats: { count: [0, 40] as const },
  cars: { count: [0, 150] as const },
  speed: [1, 10] as const,
  size: [1, 8] as const,
  routes: 60,
  points: 600,
  /** the map model covers x -127..13, z -93..-15: points well outside are mistakes */
  x: [-200, 80] as const,
  z: [-160, 40] as const,
};

/** Harbor Bridge's two lanes, six cars each at a size the deck takes, clear of the lamp posts (tests/world/bridgeRoad.test.ts) */
export const BRIDGE_CARS = { count: 6, speedMin: 3, speedMax: 5, size: 2 };

export const DEFAULT_TRAFFIC: TrafficConfig = {
  // today's five river boats, at today's speed (1.7 to 2.4 map units a second)
  boats: { count: 5, speedMin: 9, speedMax: 10, size: 1, routes: [] },
  cars: { count: 10, speedMin: 3, speedMax: 5, size: 2, routes: bridgeLanes().map((r) => ({ ...r, ...BRIDGE_CARS })) },
};

/** speed 1..10 as map units a second (1 unit is about 108 m): 1 = 0.2, 10 = about 2.1 */
export function speedUnits(speed: number): number {
  return 0.2 * Math.pow(1.3, speed - 1);
}

const clamp = (v: unknown, lo: number, hi: number, fallback: number) => {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : fallback;
  return Math.min(hi, Math.max(lo, n));
};

/** count, speeds (slowest never above fastest) and size, each clamped; missing values come from `d` */
function cleanSettings(v: Partial<RouteSettings>, d: RouteSettings, kind: TrafficKind): RouteSettings {
  const a = clamp(v.speedMin, LIMITS.speed[0], LIMITS.speed[1], d.speedMin);
  const b = clamp(v.speedMax, LIMITS.speed[0], LIMITS.speed[1], d.speedMax);
  return {
    count: Math.round(clamp(v.count, LIMITS[kind].count[0], LIMITS[kind].count[1], d.count)),
    speedMin: Math.min(a, b),
    speedMax: Math.max(a, b),
    // boats stay true to scale: bigger ones would hit Harbor Bridge (tests/world/Boats.test.ts)
    size: kind === 'boats' ? 1 : clamp(v.size, LIMITS.size[0], LIMITS.size[1], d.size),
  };
}

function cleanPoints(r: unknown): RoutePoint[] {
  const pts = Array.isArray((r as TrafficRoute)?.points) ? (r as TrafficRoute).points : [];
  return pts
    .filter((p): p is RoutePoint => Array.isArray(p) && p.length === 2 && p.every((c) => typeof c === 'number' && Number.isFinite(c)))
    .filter(([x, z]) => x >= LIMITS.x[0] && x <= LIMITS.x[1] && z >= LIMITS.z[0] && z <= LIMITS.z[1])
    .slice(0, LIMITS.points)
    .map(([x, z]) => [Math.round(x * 1000) / 1000, Math.round(z * 1000) / 1000] as RoutePoint);
}

const lengthOf = (pts: RoutePoint[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/**
 * Routes saved before routes had their own settings carry none: those share the old fleet-wide count by length
 * (largest remainder, as the vehicles were spread before) and take its speeds and size, so the traffic looks the same.
 */
function cleanRoutes(v: unknown, fleet: RouteSettings, kind: TrafficKind): TrafficRoute[] {
  if (!Array.isArray(v)) return [];
  const raw = v.slice(0, LIMITS.routes).map((r) => ({ r: (r && typeof r === 'object' ? r : {}) as Partial<TrafficRoute>, points: cleanPoints(r) })).filter((x) => x.points.length >= 2);
  const legacy = raw.filter((x) => x.r.count === undefined);
  const total = legacy.reduce((s, x) => s + lengthOf(x.points), 0);
  const share = new Map<object, number>();
  if (legacy.length && total > 0) {
    const exact = legacy.map((x) => ({ x, n: (lengthOf(x.points) / total) * fleet.count }));
    exact.forEach(({ x, n }) => share.set(x, Math.floor(n)));
    let left = fleet.count - exact.reduce((s, { n }) => s + Math.floor(n), 0);
    [...exact].sort((p, q) => (q.n % 1) - (p.n % 1)).forEach(({ x }) => left-- > 0 && share.set(x, share.get(x)! + 1));
  }
  return raw.map((x) => ({ points: x.points, ...cleanSettings(x.r, { ...fleet, count: share.get(x) ?? fleet.count }, kind) }));
}

function cleanFleet(v: unknown, kind: TrafficKind): Fleet {
  const d = DEFAULT_TRAFFIC[kind];
  const f = (v && typeof v === 'object' ? v : {}) as Partial<Fleet>;
  const own = cleanSettings(f, d, kind);
  // no routes entry at all: the defaults; an empty list saved on purpose stays empty
  return { ...own, routes: f.routes === undefined ? d.routes.map((r) => ({ ...r, points: [...r.points] })) : cleanRoutes(f.routes, own, kind) };
}

/** anything (a saved file, a POST body) to a valid config; garbage gives the defaults */
export function normalizeTraffic(v: unknown): TrafficConfig {
  let o: unknown = v;
  if (typeof v === 'string') {
    try {
      o = JSON.parse(v);
    } catch {
      o = null;
    }
  }
  const t = (o && typeof o === 'object' ? o : {}) as Partial<TrafficConfig>;
  return { boats: cleanFleet(t.boats, 'boats'), cars: cleanFleet(t.cars, 'cars') };
}
