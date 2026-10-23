
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

/**
 * Harbor Bridge is drawn over the real Taksin bridge deck in the TerraMesh model: centre where the
 * deck crosses mid-river and heading, both measured top-down on the model's aerial texture.
 */
const TAKSIN_DECK = { x: -38.19, z: -19.52, headingDeg: 11 };

export function harborBridgeFrame(): BridgeFrame {
  if (cached) return cached;
  // the group's rotation.y maps local +x to (cos yaw, -sin yaw): a heading of +11 deg (east-south-east) is yaw -11 deg
  const yaw = (-TAKSIN_DECK.headingDeg * Math.PI) / 180;
  const water = 1.0; // the river is ~1.8 units (~200 m) wide along the deck; abutments just on the banks
  const ramp = 1.4;
  cached = { x: TAKSIN_DECK.x, z: TAKSIN_DECK.z, water, ramp, half: water + ramp, yaw };
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
