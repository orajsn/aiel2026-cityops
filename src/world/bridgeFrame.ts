import { assetPosition } from '../content/geo';
import { RIVER_CURVE, distanceToRiver, isWater } from './river';

export interface BridgeFrame {
  x: number;
  z: number;
  /** half length of the deck over water, bank to bank */
  half: number;
  /** how far the approach road runs on land beyond each bank */
  approach: number;
  /** rotation about y so local +x runs across the river; snapped to the road grid */
  yaw: number;
}

let cached: BridgeFrame | null = null;

/**
 * Where Harbor Bridge crosses the river. The axis is snapped to the road grid (quarter turns)
 * so the deck lines up with the streets, and the deck length is measured along that axis.
 */
export function harborBridgeFrame(): BridgeFrame {
  if (cached) return cached;
  const p = assetPosition('Harbor Bridge');
  const { t } = distanceToRiver(p.x, p.z);
  const c = RIVER_CURVE.getPointAt(t);
  const tan = RIVER_CURVE.getTangentAt(t);
  const raw = Math.atan2(tan.x, tan.z) + Math.PI / 2;
  const yaw = Math.round(raw / (Math.PI / 2)) * (Math.PI / 2);
  // local +x direction in world space
  const dx = Math.cos(yaw);
  const dz = -Math.sin(yaw);
  const extent = (sign: number) => {
    let d = 0;
    while (d < 40 && isWater(c.x + dx * d * sign, c.z + dz * d * sign, 0.5)) d += 0.5;
    return d;
  };
  const half = Math.max(extent(1), extent(-1)) + 2;
  cached = { x: c.x, z: c.z, half, approach: 12, yaw };
  return cached;
}

/** Bridge-local coordinates: lx along the deck, lz across it. */
export function toBridgeLocal(x: number, z: number): { lx: number; lz: number } {
  const f = harborBridgeFrame();
  const dx = x - f.x;
  const dz = z - f.z;
  const cos = Math.cos(f.yaw);
  const sin = Math.sin(f.yaw);
  // inverse of rotation about y by yaw: world = R(yaw) * local
  return { lx: dx * cos - dz * sin, lz: dx * sin + dz * cos };
}

/** True when (x, z) lies inside the bridge corridor: deck plus approach roads on land. */
export function inBridgeCorridor(x: number, z: number, margin = 8): boolean {
  const f = harborBridgeFrame();
  const { lx, lz } = toBridgeLocal(x, z);
  return Math.abs(lz) < margin && Math.abs(lx) < f.half + f.approach + margin;
}

/** True when (x, z) is on the approach road (on land, within the corridor, beyond the deck). */
export function onBridgeApproach(x: number, z: number, halfWidth = 1.6): boolean {
  const f = harborBridgeFrame();
  const { lx, lz } = toBridgeLocal(x, z);
  return Math.abs(lz) < halfWidth && Math.abs(lx) >= f.half - 1 && Math.abs(lx) < f.half + f.approach;
}
