import * as THREE from 'three';
import { project } from '../content/geo';

/** The Chao Phraya, north to south, simplified. [lat, lon] pairs. */
const RIVER_LATLON: [number, number][] = [
  [13.86, 100.525],
  [13.81, 100.508],
  [13.78, 100.498],
  [13.755, 100.488],
  [13.738, 100.492],
  [13.722, 100.506],
  [13.708, 100.513],
  [13.698, 100.525],
  [13.692, 100.545],
  [13.698, 100.565],
  [13.69, 100.582],
  [13.672, 100.58],
  [13.66, 100.57],
  [13.64, 100.565],
  [13.6, 100.56],
  [13.54, 100.555],
];

export const RIVER_CURVE = new THREE.CatmullRomCurve3(
  RIVER_LATLON.map(([lat, lon]) => {
    const p = project(lat, lon);
    return new THREE.Vector3(p.x, 0, p.z);
  }),
  false,
  'centripetal',
);

/** Half width of the river at curve parameter t (0 north, 1 south). */
export function riverHalfWidth(t: number): number {
  return 7 + 9 * t;
}

const SAMPLES = 160;
const samples: THREE.Vector3[] = RIVER_CURVE.getSpacedPoints(SAMPLES);

/** Approximate distance from (x, z) to the river centre line, and the t there. */
export function distanceToRiver(x: number, z: number): { d: number; t: number } {
  let best = Infinity;
  let bt = 0;
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i];
    const b = samples[i + 1];
    const abx = b.x - a.x;
    const abz = b.z - a.z;
    const len2 = abx * abx + abz * abz || 1;
    let u = ((x - a.x) * abx + (z - a.z) * abz) / len2;
    u = Math.max(0, Math.min(1, u));
    const px = a.x + abx * u;
    const pz = a.z + abz * u;
    const d = Math.hypot(x - px, z - pz);
    if (d < best) {
      best = d;
      bt = (i + u) / (samples.length - 1);
    }
  }
  return { d: best, t: bt };
}

export function isWater(x: number, z: number, margin = 0): boolean {
  const { d, t } = distanceToRiver(x, z);
  return d < riverHalfWidth(t) + margin;
}

/** A flat ribbon along the river curve. uv.x across (0..1), uv.y along (0..1). */
export function riverGeometry(segments = 200): THREE.BufferGeometry {
  const pts = RIVER_CURVE.getSpacedPoints(segments);
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = pts[i];
    const tan = RIVER_CURVE.getTangentAt(t);
    const nx = -tan.z;
    const nz = tan.x;
    const w = riverHalfWidth(t);
    pos.push(p.x + nx * w, 0, p.z + nz * w, p.x - nx * w, 0, p.z - nz * w);
    uv.push(0, t, 1, t);
    if (i < segments) {
      const k = i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
