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
  'gulf-approach': { position: [-70, 18, 40], target: [-36, 2, -20], durationMs: 0 },
  'city-high': { position: [-52, 9, 0], target: [-34, 1.5, -24], durationMs: 2500, ease: 'inOut' },
  'city-wide': { position: [-56, 16, 6], target: [-30, 1, -30], durationMs: 2000, ease: 'inOut' },
  'ops-center': { position: [26, 22, -30], target: [5, 3, -67], durationMs: 2000, ease: 'inOut' },
  'bridge-pier3': bridgeShot([0.95, 0.75, 2.1], [-0.07, 0.24, 0.18], 2200),
  'bridge-pier2': bridgeShot([-1.0, 0.55, 1.65], [-0.26, 0.22, 0.09], 1600),
  'bridge-overview': bridgeShot([2.4, 1.8, 4.8], [0, 0.3, 0], 2200),
  'core-dive': { position: [10, 22, 205], target: [-5, -36, -3], durationMs: 2500, ease: 'inOut' },
  'core-face-tables': { position: [-86, -40, 94], target: [-90, -62, 2], durationMs: 1400, ease: 'inOut' },
  'core-face-json': { position: [-46, -40, 94], target: [-54, -62, 2], durationMs: 1400, ease: 'inOut' },
  'core-face-graph': { position: [50, -14, 150], target: [26, -44, -6], durationMs: 1400, ease: 'inOut' },
  'core-face-vectors': { position: [84, -40, 94], target: [74, -61, 2], durationMs: 1400, ease: 'inOut' },
  'vector-field': { position: [84, -40, 94], target: [74, -61, 2], durationMs: 1600, ease: 'inOut' },
  'memory-room': { position: [260, 20, 220], target: [300, 8, 180], durationMs: 2000, ease: 'inOut' },
  'toolbelt-wall': { position: [-260, 20, 220], target: [-300, 8, 180], durationMs: 2000, ease: 'inOut' },
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
