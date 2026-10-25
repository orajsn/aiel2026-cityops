import { speedUnits, type RoutePoint } from '../content/traffic';

/** a drawn route, measured: cumulative distance at each point */
export interface Path {
  pts: RoutePoint[];
  cum: number[];
  length: number;
}
export interface Vehicle {
  route: number;
  /** distance along the route at t = 0 */
  start: number;
  /** map units a second */
  speed: number;
  dir: 1 | -1;
  /** 0..1, picks a colour */
  tint: number;
  /** the route's size setting (cars) */
  size?: number;
}

export function makePath(points: RoutePoint[]): Path {
  const cum = [0];
  for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  return { pts: points, cum, length: cum[cum.length - 1] ?? 0 };
}

/** position at distance d (clamped to the route) and the heading of the segment there */
function at(p: Path, d: number): { x: number; z: number; angle: number } {
  const n = p.pts.length;
  if (n === 0) return { x: 0, z: 0, angle: 0 };
  if (n === 1) return { x: p.pts[0][0], z: p.pts[0][1], angle: 0 };
  const s = Math.max(0, Math.min(p.length, d));
  let i = 1;
  while (i < n - 1 && p.cum[i] < s) i++;
  const seg = p.cum[i] - p.cum[i - 1] || 1;
  const k = (s - p.cum[i - 1]) / seg;
  const [ax, az] = p.pts[i - 1];
  const [bx, bz] = p.pts[i];
  return { x: ax + (bx - ax) * k, z: az + (bz - az) * k, angle: Math.atan2(bx - ax, bz - az) };
}

/**
 * Where vehicle `v` is `t` seconds in: it drives to the end of the (open) route, turns round and comes back,
 * so it never leaves the route. `angle` is the heading for rotation.y (atan2(dx, dz)).
 */
export function travel(p: Path, v: Vehicle, t: number): { x: number; z: number; angle: number } {
  const L = p.length;
  if (L <= 0) return at(p, 0);
  // unfold the back-and-forth into one loop of length 2L
  const u = (((v.start + v.speed * t * v.dir) % (2 * L)) + 2 * L) % (2 * L);
  const back = u > L;
  const d = back ? 2 * L - u : u;
  const pos = at(p, d);
  // the heading follows the way the vehicle is going on this leg
  const forward = v.dir === 1 ? !back : back;
  if (v.speed === 0) return pos;
  return { ...pos, angle: forward ? pos.angle : pos.angle + Math.PI };
}

/** a small seeded random: the same traffic every time the page opens (the app is deterministic) */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `count` vehicles over the routes in proportion to their length, each with its own speed in [min, max] */
export function placeVehicles(paths: Path[], count: number, speedMin: number, speedMax: number, seed: number): Vehicle[] {
  const usable = paths.map((p, i) => ({ p, i })).filter(({ p }) => p.length > 0);
  const total = usable.reduce((s, { p }) => s + p.length, 0);
  if (!usable.length || total <= 0 || count <= 0) return [];
  const r = rng(seed);
  // largest-remainder split of `count` by route length
  const raw = usable.map(({ p }) => (p.length / total) * count);
  const n = raw.map(Math.floor);
  let left = count - n.reduce((s, x) => s + x, 0);
  raw.map((x, i) => ({ i, rem: x - Math.floor(x) }))
    .sort((a, b) => b.rem - a.rem)
    .forEach(({ i }) => {
      if (left > 0) (n[i]++, left--);
    });
  const out: Vehicle[] = [];
  usable.forEach(({ p, i }, k) => {
    for (let j = 0; j < n[k]; j++) {
      const s = speedMin + (speedMax - speedMin) * r();
      out.push({ route: i, start: ((j + r() * 0.8) / n[k]) * p.length, speed: speedUnits(s), dir: j % 2 === 0 ? 1 : -1, tint: r() });
    }
  });
  return out;
}

/** every route with its own count, speed range and size: `settings[i]` belongs to `paths[i]` */
export function placeOnRoutes(paths: Path[], settings: { count: number; speedMin: number; speedMax: number; size: number }[], seed: number): Vehicle[] {
  return paths.flatMap((p, i) => placeVehicles([p], settings[i]?.count ?? 0, settings[i]?.speedMin ?? 1, settings[i]?.speedMax ?? 1, seed + i * 7919).map((v) => ({ ...v, route: i, size: settings[i]?.size ?? 1 })));
}
