import { assetPosition } from '../content/geo';
import { RIVER_CURVE, distanceToRiver, riverHalfWidth } from './river';

export interface BridgeFrame {
  x: number;
  z: number;
  /** half length of the deck (bank to bank plus approach) */
  half: number;
  /** rotation about y so local +x runs across the river */
  yaw: number;
}

let cached: BridgeFrame | null = null;

/** Where Harbor Bridge crosses the river, derived from the asset position and the river curve. */
export function harborBridgeFrame(): BridgeFrame {
  if (cached) return cached;
  const p = assetPosition('Harbor Bridge');
  const { t } = distanceToRiver(p.x, p.z);
  const c = RIVER_CURVE.getPointAt(t);
  const tan = RIVER_CURVE.getTangentAt(t);
  const half = riverHalfWidth(t) + 12;
  const yaw = Math.atan2(tan.x, tan.z) + Math.PI / 2;
  cached = { x: c.x, z: c.z, half, yaw };
  return cached;
}

/** True when (x, z) lies inside the bridge corridor (deck plus approaches), in world units. */
export function inBridgeCorridor(x: number, z: number, margin = 8): boolean {
  const f = harborBridgeFrame();
  const dx = x - f.x;
  const dz = z - f.z;
  // rotate into bridge-local space: local x along the deck, local z across it
  const lx = dx * Math.cos(-f.yaw) + dz * Math.sin(-f.yaw);
  const lz = -dx * Math.sin(-f.yaw) + dz * Math.cos(-f.yaw);
  return Math.abs(lz) < margin && Math.abs(lx) < f.half + margin;
}
