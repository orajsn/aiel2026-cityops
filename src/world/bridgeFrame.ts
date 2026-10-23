import { assetPosition } from '../content/geo';
import { RIVER_CURVE, distanceToRiver, riverHalfWidth } from './river';

export interface BridgeFrame {
  /** deck centre, on the river centreline */
  x: number;
  z: number;
  /** half length of the deck over water (bank to bank) */
  water: number;
  /** length of each approach ramp on land */
  ramp: number;
  /** half of the whole structure: water + ramp */
  half: number;
  /** rotation about y so local +x runs across the river */
  yaw: number;
}

let cached: BridgeFrame | null = null;

/** Harbor Bridge: one straight deck across the river at the asset position, perpendicular to the flow. */
export function harborBridgeFrame(): BridgeFrame {
  if (cached) return cached;
  const p = assetPosition('Harbor Bridge');
  const { t } = distanceToRiver(p.x, p.z);
  const c = RIVER_CURVE.getPointAt(t);
  const tan = RIVER_CURVE.getTangentAt(t);
  const yaw = Math.atan2(tan.x, tan.z) + Math.PI / 2;
  const water = 1.7; // the real river at Taksin is ~250 m across; a little margin on each bank
  const ramp = 1.4;
  cached = { x: c.x, z: c.z, water, ramp, half: water + ramp, yaw };
  return cached;
}

/** Bridge-local coordinates: lx along the deck, lz across it. */
export function toBridgeLocal(x: number, z: number): { lx: number; lz: number } {
  const f = harborBridgeFrame();
  const dx = x - f.x;
  const dz = z - f.z;
  const cos = Math.cos(f.yaw);
  const sin = Math.sin(f.yaw);
  return { lx: dx * cos - dz * sin, lz: dx * sin + dz * cos };
}

/** True when (x, z) lies inside the bridge corridor (deck and ramps). */
export function inBridgeCorridor(x: number, z: number, margin = 3): boolean {
  const f = harborBridgeFrame();
  const { lx, lz } = toBridgeLocal(x, z);
  return Math.abs(lz) < margin && Math.abs(lx) < f.half + margin;
}
