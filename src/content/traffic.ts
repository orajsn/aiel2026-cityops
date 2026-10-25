/**
 * Traffic on the map (owner, 25 Oct): boats and cars on routes the owner draws in Traffic mode, with how many,
 * a speed range (each vehicle gets its own speed inside it) and, for cars, a size. Saved to
 * src/content/traffic.json through the dev server (/__traffic). Pure data and rules, shared by the app and
 * vite.config.ts (which cleans every save with normalizeTraffic before writing it).
 *
 * With no boat route drawn, boats follow the real river (src/world/Boats.tsx) as they always have.
 */
export type TrafficKind = 'boats' | 'cars';
export type RoutePoint = [number, number];
export interface TrafficRoute {
  points: RoutePoint[];
}
export interface Fleet {
  count: number;
  /** 1 (slowest) to 10 (fastest); each vehicle gets its own speed between min and max */
  speedMin: number;
  speedMax: number;
  /** 1 = true to scale; real cars are invisible from city height, so they are drawn bigger */
  size: number;
  routes: TrafficRoute[];
}
export interface TrafficConfig {
  boats: Fleet;
  cars: Fleet;
}

export const LIMITS = {
  boats: { count: [0, 40] as const },
  cars: { count: [0, 300] as const },
  speed: [1, 10] as const,
  size: [1, 8] as const,
  routes: 60,
  points: 600,
  /** the map model covers x -127..13, z -93..-15: points well outside are mistakes */
  x: [-200, 80] as const,
  z: [-160, 40] as const,
};

export const DEFAULT_TRAFFIC: TrafficConfig = {
  // today's five river boats, at today's speed (1.7 to 2.4 map units a second)
  boats: { count: 5, speedMin: 9, speedMax: 10, size: 1, routes: [] },
  cars: { count: 40, speedMin: 5, speedMax: 8, size: 3, routes: [] },
};

/** speed 1..10 as map units a second (1 unit is about 108 m): 1 = 0.2, 10 = about 2.1 */
export function speedUnits(speed: number): number {
  return 0.2 * Math.pow(1.3, speed - 1);
}

const clamp = (v: unknown, lo: number, hi: number, fallback: number) => {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : fallback;
  return Math.min(hi, Math.max(lo, n));
};

function cleanRoutes(v: unknown): TrafficRoute[] {
  if (!Array.isArray(v)) return [];
  const out: TrafficRoute[] = [];
  for (const r of v.slice(0, LIMITS.routes)) {
    const pts = Array.isArray((r as TrafficRoute)?.points) ? (r as TrafficRoute).points : [];
    const points = pts
      .filter((p): p is RoutePoint => Array.isArray(p) && p.length === 2 && p.every((c) => typeof c === 'number' && Number.isFinite(c)))
      .filter(([x, z]) => x >= LIMITS.x[0] && x <= LIMITS.x[1] && z >= LIMITS.z[0] && z <= LIMITS.z[1])
      .slice(0, LIMITS.points)
      .map(([x, z]) => [Math.round(x * 1000) / 1000, Math.round(z * 1000) / 1000] as RoutePoint);
    if (points.length >= 2) out.push({ points });
  }
  return out;
}

function cleanFleet(v: unknown, kind: TrafficKind): Fleet {
  const d = DEFAULT_TRAFFIC[kind];
  const f = (v && typeof v === 'object' ? v : {}) as Partial<Fleet>;
  const a = clamp(f.speedMin, LIMITS.speed[0], LIMITS.speed[1], d.speedMin);
  const b = clamp(f.speedMax, LIMITS.speed[0], LIMITS.speed[1], d.speedMax);
  return {
    count: Math.round(clamp(f.count, LIMITS[kind].count[0], LIMITS[kind].count[1], d.count)),
    speedMin: Math.min(a, b),
    speedMax: Math.max(a, b),
    // boats stay true to scale: bigger ones would hit Harbor Bridge (tests/world/Boats.test.ts)
    size: kind === 'boats' ? 1 : clamp(f.size, LIMITS.size[0], LIMITS.size[1], d.size),
    routes: cleanRoutes(f.routes),
  };
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
