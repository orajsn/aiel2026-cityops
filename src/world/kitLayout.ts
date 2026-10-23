import { project } from '../content/geo';
import { rng, CITY_BOUNDS } from './cityLayout';
import { isWater } from './river';
import { inBridgeCorridor } from './bridgeFrame';
import { nearestRoad } from './roads';
import { nearLandmark } from './landmarks';

/** Kenney city-kit models (CC0, kenney.nl), served from public/models/kenney. */
export const KIT = '/models/kenney';

export const MODEL_SETS = {
  tall: ['a', 'b', 'c', 'd', 'e'].map((k) => `commercial/building-skyscraper-${k}.glb`),
  mid: 'abcdefghijklmn'.split('').map((k) => `commercial/building-${k}.glb`),
  plain: 'abcdefghijklmn'.split('').map((k) => `commercial/low-detail-building-${k}.glb`),
  low: 'abcdefghijklmnopqrstu'.split('').map((k) => `suburban/building-type-${k}.glb`),
  industrial: 'abcdefghijklmnopqrst'.split('').map((k) => `industrial/building-${k}.glb`),
  tree: ['suburban/tree-large.glb', 'suburban/tree-small.glb'],
  port: ['industrial/shipping-container-a.glb', 'industrial/shipping-container-b.glb', 'industrial/shipping-container-c.glb', 'industrial/detail-tank-large.glb', 'industrial/water-tower.glb'],
  lamp: ['roads/light-square.glb'],
};

export const ALL_MODELS: string[] = Object.values(MODEL_SETS).flat();

export interface Placement {
  model: string;
  x: number;
  z: number;
  /** rotation about y in radians */
  yaw: number;
  /** uniform scale */
  s: number;
}

/** Candidate spacing and model scale, in scene units (1 unit ~ 108 m; the city is a toy scale). */
export const SPACING = 2.7;
export const BUILD_SCALE = 2.3;

const CBD = project(13.728, 100.538); // Sathorn / Silom
const CBD2 = project(13.745, 100.535); // Siam / Ratchaprasong
const CBD3 = project(13.765, 100.56); // Din Daeng / Ratchada
const PORT = project(13.705, 100.572); // Khlong Toei port
const OLD = project(13.75, 100.492); // Rattanakosin: low, no towers

/**
 * Organic placement: jittered candidates across the city, kept only where they clear the
 * real streets and the river, turned to face the nearest street. Model mix by district.
 */
export function kitLayout(seed = 11): Placement[] {
  const r = rng(seed);
  const out: Placement[] = [];
  const { minX, maxX, minZ, maxZ } = CITY_BOUNDS;
  const pick = (list: string[]) => list[Math.floor(r() * list.length)];

  for (let z = minZ + 2; z < maxZ - 2; z += SPACING) {
    for (let x = minX + 2; x < maxX - 2; x += SPACING) {
      const jx = x + (r() - 0.5) * SPACING * 0.7;
      const jz = z + (r() - 0.5) * SPACING * 0.7;
      if (isWater(jx, jz, 1.2)) continue;
      if (inBridgeCorridor(jx, jz, 2.2)) continue;
      if (nearLandmark(jx, jz)) continue;
      const near = nearestRoad(jx, jz, 10);
      if (near && near.gap < 0.6) continue;
      // density: dense near streets, sparse far from any street
      const far = near ? near.gap : 10;
      if (r() > (far < 6 ? 0.95 : far < 9 ? 0.6 : 0.25)) continue;
      const ex = Math.min(jx - minX, maxX - jx) / 30;
      const ez = Math.min(jz - minZ, maxZ - jz) / 30;
      const edge = Math.max(0, Math.min(1, ex, ez));
      if (r() > 0.25 + 0.75 * edge) continue;

      const dc = Math.min(Math.hypot(jx - CBD.x, jz - CBD.z), Math.hypot(jx - CBD2.x, jz - CBD2.z));
      const dc3 = Math.hypot(jx - CBD3.x, jz - CBD3.z);
      const dp = Math.hypot(jx - PORT.x, jz - PORT.z);
      const dold = Math.hypot(jx - OLD.x, jz - OLD.z);
      const k = r();
      let model: string;
      if (dp < 9) model = k < 0.4 ? pick(MODEL_SETS.industrial) : k < 0.9 ? pick(MODEL_SETS.port) : pick(MODEL_SETS.plain);
      else if (dold < 9) model = k < 0.15 ? pick(MODEL_SETS.tree) : k < 0.7 ? pick(MODEL_SETS.low) : pick(MODEL_SETS.plain);
      else if (dc < 9 || dc3 < 5) model = k < 0.6 ? pick(MODEL_SETS.tall) : pick(MODEL_SETS.mid);
      else if (dc < 20 || dc3 < 12) model = k < 0.12 ? pick(MODEL_SETS.tall) : k < 0.6 ? pick(MODEL_SETS.mid) : pick(MODEL_SETS.plain);
      else model = k < 0.14 ? pick(MODEL_SETS.tree) : k < 0.55 ? pick(MODEL_SETS.plain) : k < 0.82 ? pick(MODEL_SETS.low) : pick(MODEL_SETS.mid);

      // face the nearest street
      let yaw = Math.floor(r() * 4) * (Math.PI / 2);
      if (near) {
        const s = near.seg;
        yaw = Math.atan2(s.bx - s.ax, s.bz - s.az);
      }
      const scale = model.startsWith('suburban/tree') ? BUILD_SCALE * 1.2 : BUILD_SCALE;
      out.push({ model, x: jx, z: jz, yaw, s: scale });
    }
  }
  return out;
}
