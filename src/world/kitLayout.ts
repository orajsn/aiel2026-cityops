import { project } from '../content/geo';
import { rng, CITY_BOUNDS } from './cityLayout';
import { isWater } from './river';
import { harborBridgeFrame, inBridgeCorridor, onBridgeApproach } from './bridgeFrame';

/** Kenney city-kit models (CC0, kenney.nl), served from public/models/kenney. */
export const KIT = '/models/kenney';

export const MODEL_SETS = {
  tall: ['a', 'b', 'c', 'd', 'e'].map((k) => `commercial/building-skyscraper-${k}.glb`),
  mid: 'abcdefghijklmn'.split('').map((k) => `commercial/building-${k}.glb`),
  plain: 'abcdefghijklmn'.split('').map((k) => `commercial/low-detail-building-${k}.glb`),
  low: 'abcdefghijklmnopqrstu'.split('').map((k) => `suburban/building-type-${k}.glb`),
  industrial: 'abcdefghijklmnopqrst'.split('').map((k) => `industrial/building-${k}.glb`),
  tree: ['suburban/tree-large.glb', 'suburban/tree-small.glb'],
  road: ['roads/road-straight.glb', 'roads/road-crossroad.glb', 'roads/road-bridge.glb'],
  lamp: ['roads/light-square.glb'],
  port: ['industrial/shipping-container-a.glb', 'industrial/shipping-container-b.glb', 'industrial/shipping-container-c.glb', 'industrial/detail-tank-large.glb', 'industrial/water-tower.glb'],
};

export const ALL_MODELS: string[] = Object.values(MODEL_SETS).flat();

export interface Placement {
  model: string;
  x: number;
  z: number;
  /** quarter turns */
  yaw: number;
  /** uniform scale */
  s: number;
}

export const CELL = 6;
/** every Nth row/column is an avenue */
const AVENUE = 6;
const BUILD_SCALE = 5;
const ROAD_SCALE = CELL;

const CBD = project(13.728, 100.538);
const CBD2 = project(13.765, 100.56);
const PORT = project(13.7, 100.575);

/** Deterministic placement of kit models on a grid with avenues, bridges and trees. */
export function kitLayout(seed = 11): Placement[] {
  const r = rng(seed);
  const out: Placement[] = [];
  const { minX, maxX, minZ, maxZ } = CITY_BOUNDS;
  const cols = Math.floor((maxX - minX) / CELL);
  const rows = Math.floor((maxZ - minZ) / CELL);
  const pick = (list: string[]) => list[Math.floor(r() * list.length)];

  for (let rz = 0; rz < rows; rz++) {
    for (let cx = 0; cx < cols; cx++) {
      const x = minX + (cx + 0.5) * CELL;
      const z = minZ + (rz + 0.5) * CELL;
      const onAvX = cx % AVENUE === 0;
      const onAvZ = rz % AVENUE === 0;
      const ex = Math.min(x - minX, maxX - x) / 150;
      const ez = Math.min(z - minZ, maxZ - z) / 150;
      const edge = Math.max(0, Math.min(1, ex, ez));
      const water = isWater(x, z, 2);
      if (inBridgeCorridor(x, z, 9)) {
        // approach roads join Harbor Bridge to the street grid; the rest of the corridor stays clear
        if (!water && onBridgeApproach(x, z)) {
          const f = harborBridgeFrame();
          const alongX = Math.abs(Math.cos(f.yaw)) > 0.5; // deck runs along world x
          out.push({ model: (onAvX && !alongX) || (onAvZ && alongX) ? 'roads/road-crossroad.glb' : 'roads/road-straight.glb', x, z, yaw: alongX ? 1 : 0, s: ROAD_SCALE });
        }
        continue;
      }

      if (onAvX || onAvZ) {
        // avenues: road tiles; over water they become bridges; fade out at the edge
        if (r() > 0.2 + 0.8 * edge) continue;
        if (water) {
          if (onAvX && onAvZ) continue;
          // Harbor Bridge is the only crossing near the port
          const hb = harborBridgeFrame();
          if (Math.hypot(x - hb.x, z - hb.z) < 60) continue;
          out.push({ model: 'roads/road-bridge.glb', x, z, yaw: onAvX ? 0 : 1, s: ROAD_SCALE });
        } else if (onAvX && onAvZ) {
          out.push({ model: 'roads/road-crossroad.glb', x, z, yaw: 0, s: ROAD_SCALE });
        } else {
          out.push({ model: 'roads/road-straight.glb', x, z, yaw: onAvX ? 0 : 1, s: ROAD_SCALE });
          if ((cx + rz) % 3 === 0) out.push({ model: 'roads/light-square.glb', x: x + (onAvX ? 2.6 : 0), z: z + (onAvZ ? 2.6 : 0), yaw: onAvX ? 1 : 0, s: BUILD_SCALE });
        }
        continue;
      }

      if (water) continue;
      if (r() > 0.12 + 0.88 * edge * edge) continue;

      const dc = Math.hypot(x - CBD.x, z - CBD.z);
      const dc2 = Math.hypot(x - CBD2.x, z - CBD2.z);
      const dp = Math.hypot(x - PORT.x, z - PORT.z);
      let model: string;
      if (dc < 22 || dc2 < 14) model = r() < 0.7 ? pick(MODEL_SETS.tall) : pick(MODEL_SETS.mid);
      else if (dp < 30) {
        const k = r();
        model = k < 0.4 ? pick(MODEL_SETS.industrial) : k < 0.9 ? pick(MODEL_SETS.port) : pick(MODEL_SETS.mid);
      }
      else if (dc < 60 || dc2 < 40) model = r() < 0.6 ? pick(MODEL_SETS.mid) : pick(MODEL_SETS.plain);
      else {
        const k = r();
        model = k < 0.12 ? pick(MODEL_SETS.tree) : k < 0.55 ? pick(MODEL_SETS.plain) : k < 0.8 ? pick(MODEL_SETS.low) : pick(MODEL_SETS.mid);
      }
      out.push({ model, x, z, yaw: Math.floor(r() * 4), s: BUILD_SCALE });
    }
  }
  return out;
}
