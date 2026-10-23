import * as THREE from 'three';
import { project } from '../content/geo';
import roadsJson from '../content/roads.json';
import { isWater } from './river';

export type RoadClass = 'motorway' | 'trunk' | 'primary' | 'secondary' | 'tertiary' | 'link' | 'rail' | 'skytrain';

interface RoadWay {
  c: RoadClass;
  p: [number, number][];
  b: 0 | 1;
}

/** Real Bangkok roads from OpenStreetMap, projected to scene units. */
export const ROADS = roadsJson as RoadWay[];

/** Half width in scene units per class (exaggerated like the river). */
export const HALF_WIDTH: Record<RoadClass, number> = {
  motorway: 1.0,
  trunk: 0.85,
  primary: 0.7,
  secondary: 0.52,
  tertiary: 0.38,
  link: 0.36,
  rail: 0.22,
  skytrain: 0.3,
};

/** Height above ground: elevated classes get piers. */
export const ELEVATION: Record<RoadClass, number> = {
  motorway: 2.2,
  trunk: 0,
  primary: 0,
  secondary: 0,
  tertiary: 0,
  link: 0,
  rail: 0,
  skytrain: 3.0,
};

export interface Seg {
  ax: number;
  az: number;
  bx: number;
  bz: number;
  c: RoadClass;
  half: number;
}

let segsCache: Seg[] | null = null;

/** Every road as straight segments in scene units (for distance queries). */
export function roadSegments(): Seg[] {
  if (segsCache) return segsCache;
  const out: Seg[] = [];
  for (const w of ROADS) {
    const pts = w.p.map(([lat, lon]) => project(lat, lon));
    for (let i = 0; i < pts.length - 1; i++) {
      out.push({ ax: pts[i].x, az: pts[i].z, bx: pts[i + 1].x, bz: pts[i + 1].z, c: w.c, half: HALF_WIDTH[w.c] });
    }
  }
  segsCache = out;
  return out;
}

const CELL = 8;
let index: Map<string, Seg[]> | null = null;

function cellKey(x: number, z: number) {
  return `${Math.floor(x / CELL)},${Math.floor(z / CELL)}`;
}

/** Spatial hash of road segments by cell, built once. */
function roadIndex(): Map<string, Seg[]> {
  if (index) return index;
  index = new Map();
  for (const s of roadSegments()) {
    const minX = Math.min(s.ax, s.bx) - 2;
    const maxX = Math.max(s.ax, s.bx) + 2;
    const minZ = Math.min(s.az, s.bz) - 2;
    const maxZ = Math.max(s.az, s.bz) + 2;
    for (let x = Math.floor(minX / CELL); x <= Math.floor(maxX / CELL); x++)
      for (let z = Math.floor(minZ / CELL); z <= Math.floor(maxZ / CELL); z++) {
        const k = `${x},${z}`;
        if (!index.has(k)) index.set(k, []);
        index.get(k)!.push(s);
      }
  }
  return index;
}

function segDist(x: number, z: number, s: Seg): number {
  const dx = s.bx - s.ax;
  const dz = s.bz - s.az;
  const len2 = dx * dx + dz * dz || 1;
  const u = Math.max(0, Math.min(1, ((x - s.ax) * dx + (z - s.az) * dz) / len2));
  return Math.hypot(x - (s.ax + dx * u), z - (s.az + dz * u));
}

/** Nearest road to (x, z) within `radius`: distance beyond its edge, and the segment. */
export function nearestRoad(x: number, z: number, radius = 8): { gap: number; seg: Seg } | null {
  const idx = roadIndex();
  let best: { gap: number; seg: Seg } | null = null;
  const r = Math.ceil(radius / CELL);
  const cx = Math.floor(x / CELL);
  const cz = Math.floor(z / CELL);
  for (let i = -r; i <= r; i++)
    for (let j = -r; j <= r; j++) {
      const list = idx.get(`${cx + i},${cz + j}`);
      if (!list) continue;
      for (const s of list) {
        const gap = segDist(x, z, s) - s.half;
        if (!best || gap < best.gap) best = { gap, seg: s };
      }
    }
  return best;
}

export interface Ribbon {
  c: RoadClass;
  pts: THREE.Vector3[];
  elevated: boolean;
}

/**
 * Roads split into ground and elevated runs. A run is elevated when the class is elevated,
 * the way is a bridge, or the run crosses water.
 */
export function roadRibbons(): Ribbon[] {
  const out: Ribbon[] = [];
  for (const w of ROADS) {
    const pts = w.p.map(([lat, lon]) => {
      const p = project(lat, lon);
      return new THREE.Vector3(p.x, 0, p.z);
    });
    const classElev = ELEVATION[w.c] > 0 || w.b === 1;
    // split by water crossing so only the crossing part lifts
    let run: THREE.Vector3[] = [pts[0]];
    let runWater = isWater(pts[0].x, pts[0].z, 0.5);
    for (let i = 1; i < pts.length; i++) {
      const water = isWater(pts[i].x, pts[i].z, 0.5);
      if (water !== runWater) {
        run.push(pts[i]);
        out.push({ c: w.c, pts: run, elevated: classElev || runWater });
        run = [pts[i]];
        runWater = water;
      } else run.push(pts[i]);
    }
    if (run.length > 1) out.push({ c: w.c, pts: run, elevated: classElev || runWater });
  }
  return out;
}

/** Flat ribbon geometry for a polyline at height y with half width w. */
export function ribbonGeometry(pts: THREE.Vector3[], w: number, y: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    let tx = next.x - prev.x;
    let tz = next.z - prev.z;
    const len = Math.hypot(tx, tz) || 1;
    tx /= len;
    tz /= len;
    const nx = -tz;
    const nz = tx;
    pos.push(pts[i].x + nx * w, y, pts[i].z + nz * w, pts[i].x - nx * w, y, pts[i].z - nz * w);
    if (i < pts.length - 1) {
      const k = i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
