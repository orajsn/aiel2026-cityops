
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
const TAKSIN_DECK = { x: -38.19, z: -19.57, headingDeg: 13.3 };

/** Structure scale: HarborBridge.tsx draws in structure units inside a group scaled by this. */
export const BRIDGE_S = 0.22;
const S = BRIDGE_S;
/** deck height and width in structure units */
export const DECK_Y = 1.6;
export const DECK_W = 1.9;

/**
 * Everything in the water and the heights that matter, in bridge-local world units (x along the deck,
 * z across it). Shared by the bridge and the boats so the boats always use the open channel.
 */
export const BRIDGE = {
  /** piers 1..6 from the west (Thonburi) bank; the real river spans about x -0.93..0.73 here */
  piers: [-0.75, -0.48, -0.2, 0.2, 0.45, 0.68],
  pierW: 0.7 * S,
  pierD: 1.4 * S,
  /** the two towers stand on the outer piers (1 and 6), by the banks, clear of the inspection platforms */
  pylonPiers: [0, 5],
  legW: 0.5 * S,
  legD: 0.36 * S,
  legZ: (DECK_W / 2 + 0.25) * S,
  /** maintenance platform bolted to the camera-side face of Pier 3 (kept for older callers: platforms[0]) */
  platform: { x: -0.2, w: 0.9 * S, d: 0.9 * S, z: 0.7 * S + 0.45 * S, y: (DECK_Y - 0.95) * S },
  /** inspection platforms: Pier 3 (the crack, Lab 2) and Pier 2 (the corrosion, Lab 3) */
  platforms: [
    { x: -0.2, w: 0.9 * S, d: 0.9 * S, z: 0.7 * S + 0.45 * S, y: (DECK_Y - 0.95) * S },
    { x: -0.48, w: 0.9 * S, d: 0.9 * S, z: 0.7 * S + 0.45 * S, y: (DECK_Y - 0.95) * S },
  ],
  /** where the damage is, on the pier shaft face the platform looks at (bridge-local world units) */
  damage: {
    crack: { x: -0.2, y: (DECK_Y - 0.62) * S, z: 0.7 * S },
    corrosion: { x: -0.48, y: (DECK_Y - 0.7) * S, z: 0.7 * S },
  },
  /** underside of the pier caps, the lowest part of the deck */
  clearanceY: (DECK_Y - 0.3 - 0.12) * S,
  /** boat lanes through the main span between Pier 3 and Pier 4, one per direction */
  lanes: [-0.03, 0.05],
  /** ground height where each ramp lands, 2.4 units out along the deck axis (measured on the map) */
  footY: { west: 0.062, east: 0.116 },
};

export function harborBridgeFrame(): BridgeFrame {
  if (cached) return cached;
  // the group's rotation.y maps local +x to (cos yaw, -sin yaw): a heading of +13.3 deg (east-south-east) is yaw -13.3 deg
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

/** Inverse of toBridgeLocal. */
export function fromBridgeLocal(lx: number, lz: number): { x: number; z: number } {
  const f = harborBridgeFrame();
  const cos = Math.cos(f.yaw);
  const sin = Math.sin(f.yaw);
  return { x: f.x + lx * cos + lz * sin, z: f.z - lx * sin + lz * cos };
}

/** True when (x, z) lies inside the bridge corridor (deck and ramps). */
export function inBridgeCorridor(x: number, z: number, margin = 3): boolean {
  const f = harborBridgeFrame();
  const { lx, lz } = toBridgeLocal(x, z);
  return Math.abs(lz) < margin && Math.abs(lx) < f.half + margin;
}
