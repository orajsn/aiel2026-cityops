import { assetPosition } from '../content/geo';
import { nearestCrossing } from './roads';

export interface BridgeFrame {
  x: number;
  z: number;
  /** half length of the deck over water, bank to bank */
  half: number;
  /** rotation about y so local +x runs along the deck */
  yaw: number;
  /** the deck polyline in scene units */
  pts: { x: number; z: number }[];
}

let cached: BridgeFrame | null = null;

/**
 * Harbor Bridge is the real river crossing nearest the asset position (the Industrial Ring Road
 * bridge by the port), so the deck is part of the street network and connects on both banks.
 */
export function harborBridgeFrame(): BridgeFrame {
  if (cached) return cached;
  const p = assetPosition('Harbor Bridge');
  const run = nearestCrossing(p.x, p.z);
  if (!run) {
    cached = { x: p.x, z: p.z, half: 6, yaw: 0, pts: [{ x: p.x - 6, z: p.z }, { x: p.x + 6, z: p.z }] };
    return cached;
  }
  const a = run[0];
  const b = run[run.length - 1];
  const yaw = Math.atan2(b.x - a.x, b.z - a.z) - Math.PI / 2;
  const half = Math.hypot(b.x - a.x, b.z - a.z) / 2;
  cached = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2, half, yaw, pts: run };
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

/** True when (x, z) lies inside the bridge corridor. */
export function inBridgeCorridor(x: number, z: number, margin = 3): boolean {
  const f = harborBridgeFrame();
  const { lx, lz } = toBridgeLocal(x, z);
  return Math.abs(lz) < margin && Math.abs(lx) < f.half + margin;
}
