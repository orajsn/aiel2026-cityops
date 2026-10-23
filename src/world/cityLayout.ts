import { project } from '../content/geo';
import { isWater } from './river';

export interface Building {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

/** mulberry32: small, deterministic. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** City extent in scene units (x east, z south). */
export const CITY_BOUNDS = { minX: -90, maxX: 80, minZ: -103, maxZ: 103 };

const CBD = project(13.728, 100.538); // Sathorn / Silom / Siam
const CBD2 = project(13.765, 100.56); // Din Daeng / Ratchada

export function buildingLayout(seed = 11, step = 7): Building[] {
  const r = rng(seed);
  const out: Building[] = [];
  const { minX, maxX, minZ, maxZ } = CITY_BOUNDS;
  for (let z = minZ; z < maxZ; z += step) {
    for (let x = minX; x < maxX; x += step) {
      const jx = x + (r() - 0.5) * step * 0.6;
      const jz = z + (r() - 0.5) * step * 0.6;
      // density: full inside, fading at the edges
      const ex = Math.min(jx - minX, maxX - jx) / 150;
      const ez = Math.min(jz - minZ, maxZ - jz) / 150;
      const edge = Math.min(1, ex, ez);
      if (r() > 0.15 + 0.85 * edge * edge) continue;
      if (isWater(jx, jz, 5)) continue;
      const dc = Math.hypot(jx - CBD.x, jz - CBD.z);
      const dc2 = Math.hypot(jx - CBD2.x, jz - CBD2.z);
      const bump = Math.exp(-(dc * dc) / (2 * 28 * 28)) + 0.6 * Math.exp(-(dc2 * dc2) / (2 * 22 * 22));
      const base = r();
      const h = 2 + 6 * base + 22 * base * base * bump * edge;
      const w = step * (0.45 + r() * 0.35);
      const d = step * (0.45 + r() * 0.35);
      out.push({ x: jx, z: jz, w, d, h });
    }
  }
  return out;
}
