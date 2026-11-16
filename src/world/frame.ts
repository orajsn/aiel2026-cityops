import { senayanEdgeVisibility } from './senayanBounds';
import type { Vec3 } from './shots';

/** The canvas camera: 45 deg vertical field of view on the fixed 16:9 stage (App.tsx). */
export const FOV_Y_DEG = 45;
export const ASPECT = 16 / 9;
const TAN_Y = Math.tan((FOV_Y_DEG / 2) * (Math.PI / 180));
const TAN_X = TAN_Y * ASPECT;

type V = [number, number, number];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V): V => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

function basis(pos: Vec3, target: Vec3) {
  const f = norm(sub(target, pos));
  const r = norm(cross(f, [0, 1, 0]));
  const u = cross(r, f);
  return { f, r, u };
}

/**
 * Where each corner of the frame meets the ground (y = 0), or null when that corner looks at the sky.
 * The ground is a plane, so if all four corners land inside the map, the whole frame shows only city.
 */
export function frameCorners(pos: Vec3, target: Vec3): ({ x: number; z: number } | null)[] {
  const { f, r, u } = basis(pos, target);
  return [
    [-1, 1],
    [1, 1],
    [1, -1],
    [-1, -1],
  ].map(([sx, sy]) => {
    const d: V = [f[0] + r[0] * sx * TAN_X + u[0] * sy * TAN_Y, f[1] + r[1] * sx * TAN_X + u[1] * sy * TAN_Y, f[2] + r[2] * sx * TAN_X + u[2] * sy * TAN_Y];
    if (d[1] >= -1e-6) return null;
    const k = -pos[1] / d[1];
    return { x: pos[0] + d[0] * k, z: pos[2] + d[2] * k };
  });
}

/** How much of the city the frame's worst corner sees: 1 = fully inside the map, 0 = sky or haze. */
export function frameCityScore(pos: Vec3, target: Vec3): number {
  return Math.min(...frameCorners(pos, target).map((c) => (c ? senayanEdgeVisibility(c.x, c.z) : 0)));
}

/** Screen position of a world point: x, y in -1..1 (left/bottom negative), and whether it is in front. */
export function projectToScreen(pos: Vec3, target: Vec3, p: Vec3): { x: number; y: number; front: boolean } {
  const { f, r, u } = basis(pos, target);
  const d = sub(p as V, pos as V);
  const z = dot(d, f);
  return { x: dot(d, r) / (z * TAN_X), y: dot(d, u) / (z * TAN_Y), front: z > 0 };
}

/** The world point at screen position (x, y in -1..1) and `depth` along the view of a camera. */
export function screenPoint(pos: Vec3, target: Vec3, x: number, y: number, depth: number): Vec3 {
  const { f, r, u } = basis(pos, target);
  const d: V = [f[0] + r[0] * x * TAN_X + u[0] * y * TAN_Y, f[1] + r[1] * x * TAN_X + u[1] * y * TAN_Y, f[2] + r[2] * x * TAN_X + u[2] * y * TAN_Y];
  return [pos[0] + d[0] * depth, pos[1] + d[1] * depth, pos[2] + d[2] * depth];
}
