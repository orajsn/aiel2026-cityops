import type { ShotId } from '../engine/types';

export type Vec3 = [number, number, number];

export interface Shot {
  position: Vec3;
  target: Vec3;
  durationMs: number;
  ease?: 'inOut' | 'out';
}

// Landmarks in scene units (see content/geo.ts): Harbor Bridge (23, 36), Ops Center (5, -67), CBD (-12, -29).
export const CORE_POS: Vec3 = [0, -80, -20];

export const SHOTS: Record<ShotId, Shot> = {
  'gulf-approach': { position: [90, 170, 520], target: [20, 0, 80], durationMs: 0 },
  'city-high': { position: [10, 150, 170], target: [-5, 0, -30], durationMs: 2500, ease: 'inOut' },
  'city-wide': { position: [60, 200, 230], target: [0, 0, -40], durationMs: 2000, ease: 'inOut' },
  'ops-center': { position: [40, 60, -10], target: [5, 6, -67], durationMs: 2000, ease: 'inOut' },
  'bridge-pier3': { position: [50, 16, 66], target: [23, 4, 36], durationMs: 2200, ease: 'inOut' },
  'bridge-pier2': { position: [0, 14, 62], target: [20, 4, 38], durationMs: 1600, ease: 'inOut' },
  'bridge-overview': { position: [55, 45, 90], target: [20, 2, 30], durationMs: 2200, ease: 'inOut' },
  'core-dive': { position: [0, -20, 120], target: CORE_POS, durationMs: 2500, ease: 'inOut' },
  'core-face-tables': { position: [-70, -60, 50], target: CORE_POS, durationMs: 1400, ease: 'inOut' },
  'core-face-json': { position: [70, -60, 50], target: CORE_POS, durationMs: 1400, ease: 'inOut' },
  'core-face-graph': { position: [0, -45, 95], target: [0, -40, -20], durationMs: 1400, ease: 'inOut' },
  'core-face-vectors': { position: [-40, -90, 80], target: CORE_POS, durationMs: 1400, ease: 'inOut' },
  'vector-field': { position: [0, -70, 70], target: CORE_POS, durationMs: 1600, ease: 'inOut' },
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
