import type { ShotId } from '../engine/types';
import { harborBridgeFrame } from './bridgeFrame';

export type Vec3 = [number, number, number];

export interface Shot {
  position: Vec3;
  target: Vec3;
  durationMs: number;
  ease?: 'inOut' | 'out';
}

// Landmarks in scene units (see content/geo.ts): Harbor Bridge (23, 36), Ops Center (5, -67), CBD (-12, -29).
export const CORE_POS: Vec3 = [-5, -58, 2];

/** A shot expressed in Harbor Bridge local space (x along the deck, z across it). */
function bridgeShot(pos: Vec3, target: Vec3, durationMs: number): Shot {
  const f = harborBridgeFrame();
  const toWorld = ([x, y, z]: Vec3): Vec3 => [
    f.x + x * Math.cos(f.yaw) + z * Math.sin(f.yaw),
    y,
    f.z - x * Math.sin(f.yaw) + z * Math.cos(f.yaw),
  ];
  return { position: toWorld(pos), target: toWorld(target), durationMs, ease: 'inOut' };
}

export const SHOTS: Record<ShotId, Shot> = {
  'calib-top': { position: [-30, 220, -29.99], target: [-30, 0, -30], durationMs: 0 },
  // the model ends ~5 units south of Taksin: city cameras stay inside it and look north up the river
  'gulf-approach': { position: [-34, 22, -17], target: [-46, 0, -52], durationMs: 0 },
  'city-high': { position: [-36, 6, -17], target: [-44, 1, -40], durationMs: 2500, ease: 'inOut' },
  // 0.3: the document flow lands at City Operations Control Center (5, -67), so it has to be in frame
  'city-flow': { position: [12, 10, -82], target: [-4, 0, -60], durationMs: 2200, ease: 'inOut' },
  'city-wide': { position: [-26, 8, -16], target: [-38, 1, -46], durationMs: 2000, ease: 'inOut' },
  // City Operations Control Center (5, -67) sits near the map's east edge: cameras stand east of it and look west, into the city
  'ops-center': { position: [11, 6, -58], target: [-2, 0.5, -71], durationMs: 2000, ease: 'inOut' },
  // Pier 3 is at bridge-local x -0.2 with its platform on the +z (north) face; cameras hang over the water,
  // far enough out to show the pier, the platform, the deck and the river together
  'bridge-pier3': bridgeShot([0.5, 0.62, 1.95], [-0.2, 0.2, 0.2], 2200),
  'bridge-pier2': bridgeShot([0.35, 0.6, 1.8], [-0.48, 0.22, 0.05], 1600),
  'bridge-overview': bridgeShot([2.4, 1.8, 4.8], [0, 0.3, 0], 2200),
  // framed on the database diorama (DatabaseDiorama.tsx: base at y -200, shapes 125 apart), as built for scene 0.5
  'core-dive': { position: [30, 60, 560], target: [-20, -96, -10], durationMs: 2500, ease: 'inOut' },
  'core-face-tables': { position: [-250, -120, 270], target: [-270, -180, 0], durationMs: 1400, ease: 'inOut' },
  'core-face-json': { position: [-125, -120, 270], target: [-145, -180, 0], durationMs: 1400, ease: 'inOut' },
  'core-face-graph': { position: [150, -40, 430], target: [80, -125, -20], durationMs: 1400, ease: 'inOut' },
  'core-face-vectors': { position: [250, -120, 270], target: [230, -178, 0], durationMs: 1400, ease: 'inOut' },
  'vector-field': { position: [185, -130, 230], target: [170, -180, 0], durationMs: 1600, ease: 'inOut' },
  'memory-room': { position: [11, 4, -76], target: [0, 0.8, -64], durationMs: 2000, ease: 'inOut' },
  'toolbelt-wall': { position: [11.5, 3.5, -63], target: [-1, 0.6, -70], durationMs: 2000, ease: 'inOut' },
};

export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function lerp3(a: Vec3, b: Vec3, k: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

export function interpolateShot(a: Shot, b: Shot, t: number): { position: Vec3; target: Vec3 } {
  const c = Math.max(0, Math.min(1, t));
  const k = b.ease === 'out' ? easeOut(c) : easeInOut(c);
  return { position: lerp3(a.position, b.position, k), target: lerp3(a.target, b.target, k) };
}
