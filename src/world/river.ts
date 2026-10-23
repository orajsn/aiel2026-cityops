import * as THREE from 'three';
import { project } from '../content/geo';
import riverJson from '../content/river.json';

/** The Chao Phraya centreline from OpenStreetMap (tools/build_roads.py), north to south. [lat, lon]. */
const RIVER_LATLON = riverJson as [number, number][];

export const RIVER_CURVE = new THREE.CatmullRomCurve3(
  RIVER_LATLON.map(([lat, lon]) => {
    const p = project(lat, lon);
    return new THREE.Vector3(p.x, 0, p.z);
  }),
  false,
  'centripetal',
  0.2,
);

/** Half width of the river in scene units (exaggerated for the diorama look). */
export function riverHalfWidth(_t: number): number {
  return 4.5;
}

const SAMPLES = 400;
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
export function riverGeometry(segments = 600): THREE.BufferGeometry {
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
