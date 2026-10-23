import { rng } from './cityLayout';
import type { Vec3 } from './shots';

const RADIUS = 30;
const CLUSTERS: { c: Vec3; r: number; w: number }[] = [
  { c: [-13, 7, -8], r: 8, w: 0.3 },
  { c: [14, -3, 7], r: 9, w: 0.3 },
  { c: [-1, -11, 15], r: 7, w: 0.2 },
];

/** Deterministic points in a sphere of radius 30 with three visible clusters. */
export function layoutCloud(n: number, seed: number): Vec3[] {
  const r = rng(seed);
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const pick = r();
    let acc = 0;
    let cluster: (typeof CLUSTERS)[number] | null = null;
    for (const c of CLUSTERS) {
      acc += c.w;
      if (pick < acc) {
        cluster = c;
        break;
      }
    }
    let p: Vec3;
    if (cluster) {
      const g = () => (r() + r() + r() - 1.5) * 1.2; // roughly gaussian
      p = [cluster.c[0] + g() * cluster.r * 0.5, cluster.c[1] + g() * cluster.r * 0.5, cluster.c[2] + g() * cluster.r * 0.5];
    } else {
      // uniform in sphere
      const u = r() * 2 - 1;
      const phi = r() * Math.PI * 2;
      const rad = RADIUS * Math.cbrt(r());
      const s = Math.sqrt(1 - u * u);
      p = [rad * s * Math.cos(phi), rad * u, rad * s * Math.sin(phi)];
    }
    const len = Math.hypot(p[0], p[1], p[2]);
    if (len > RADIUS) p = [(p[0] / len) * RADIUS, (p[1] / len) * RADIUS, (p[2] / len) * RADIUS];
    out.push(p);
  }
  return out;
}

/** A 20 x 30 stacked grid: the "documents" before embedding. */
export function layoutDocuments(n: number, cols = 20, spacing = 2.2): Vec3[] {
  const out: Vec3[] = [];
  const rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    out.push([(col - (cols - 1) / 2) * spacing, (rows / 2 - row) * spacing * 0.9, 0]);
  }
  return out;
}

export function nearestK(points: Vec3[], query: Vec3, k: number): number[] {
  return points
    .map((p, i) => ({ i, d: Math.hypot(p[0] - query[0], p[1] - query[1], p[2] - query[2]) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((x) => x.i);
}

export function applyWalls(
  points: Vec3[],
  tags: Record<string, string>[],
  filter: Record<string, string>,
): boolean[] {
  const keys = Object.keys(filter);
  return points.map((_, i) => keys.every((key) => tags[i]?.[key] === filter[key]));
}
