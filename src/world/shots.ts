import type { ShotId } from '../engine/types';
import { assetPosition } from '../content/geo';
import { BRIDGE, fromBridgeLocal } from './bridgeFrame';

export type Vec3 = [number, number, number];

export interface Shot {
  position: Vec3;
  target: Vec3;
  durationMs: number;
  ease?: 'inOut' | 'out';
  /** the place this shot is about; tests check it stays on screen, left of the panel */
  subject?: Vec3;
}

/**
 * A camera that looks at `subject` from the south (north is always up the screen, so moving between
 * places reads as travelling across one map), `pitchDeg` below level, `dist` away, turned `headingDeg`
 * east of north. `screenX` slides the subject left (negative) to keep it clear of the right-hand panel;
 * `lead` aims that far beyond the subject, which drops it lower in the frame (the city rises behind it).
 */
export function northShot(subject: Vec3, dist: number, pitchDeg: number, screenX: number, durationMs: number, headingDeg = 0, lead = 0): Shot {
  const p = (pitchDeg * Math.PI) / 180;
  const hd = (headingDeg * Math.PI) / 180;
  const f = [Math.sin(hd), -Math.cos(hd)];
  const r = [Math.cos(hd), Math.sin(hd)];
  const tanX = Math.tan((22.5 * Math.PI) / 180) * (16 / 9);
  const ox = screenX * dist * tanX;
  const target: Vec3 = [subject[0] - r[0] * ox + f[0] * lead, subject[1], subject[2] - r[1] * ox + f[1] * lead];
  const back = dist * Math.cos(p);
  const position: Vec3 = [target[0] - f[0] * back, target[1] + dist * Math.sin(p), target[2] - f[1] * back];
  return { position, target, durationMs, ease: 'inOut', subject };
}

// The five places of the story (and the opening). Every city camera looks roughly north, and every frame
// shows only city:
// tests/world/frame.test.ts checks all four corners of every page and every move between pages.
const OPS = assetPosition('City Operations Control Center');
const HB = fromBridgeLocal(0, 0);
const PIER3 = fromBridgeLocal(BRIDGE.platform.x, BRIDGE.platform.z);
const PIER2 = fromBridgeLocal(BRIDGE.piers[1], 0);

export const SHOTS: Record<ShotId, Shot> = {
  /** the opening: low over the river by the bridge, before rising over the city */
  arrive: northShot([HB.x, 0.3, HB.z], 10, 36, 0, 0, 0, 2),
  /** the city: ICONSIAM across the river, the Silom and Sathorn towers, the Ops Center; low enough that the towers show their sides */
  city: northShot([-26, 0, -36], 30, 44, 0, 2600, -15),
  /** the sky stage over the Ops Center, where the AI ideas are explained (SkyStage.tsx), the Ops Center below */
  // lower and more forward than the city cameras so the stage is seen from the side; the haze shows at the top
  sky: northShot([OPS.x, 9, OPS.z], 17, 22, -0.18, 2200, -20, -1),
  /** City Operations Control Center, where the operator and the copilot work */
  ops: northShot([OPS.x, 0.5, OPS.z], 22, 42, -0.1, 2200, -15, 2.2),
  /** Harbor Bridge whole, low in the frame, the city behind it */
  bridge: northShot([HB.x, 0.3, HB.z], 14, 42, -0.1, 2200, 0, 2.8),
  /** Pier 3 and its maintenance platform: the inspector, the crack (Lab 2); left of the question bubble */
  pier3: northShot([PIER3.x, BRIDGE.platform.y, PIER3.z], 3.8, 42, -0.4, 2200),
  /** Pier 2: the corrosion, Mercer and Vance (Lab 3) */
  pier2: northShot([PIER2.x, 0.2, PIER2.z], 3.8, 42, -0.1, 1800),
  'core-dive': { position: [30, 60, 560], target: [-20, -96, -10], durationMs: 2500, ease: 'inOut' },
  'core-face-tables': { position: [-250, -120, 270], target: [-270, -180, 0], durationMs: 1400, ease: 'inOut' },
  'core-face-json': { position: [-125, -120, 270], target: [-145, -180, 0], durationMs: 1400, ease: 'inOut' },
  'core-face-graph': { position: [150, -40, 430], target: [80, -125, -20], durationMs: 1400, ease: 'inOut' },
  'core-face-vectors': { position: [250, -120, 270], target: [230, -178, 0], durationMs: 1400, ease: 'inOut' },
  'vector-field': { position: [185, -130, 230], target: [170, -180, 0], durationMs: 1600, ease: 'inOut' },
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
