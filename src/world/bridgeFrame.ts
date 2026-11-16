/** Shared frame for the mapped Senayan crossing and its illustrative training structure. */
export interface BridgeFrame {
  x: number;
  z: number;
  water: number;
  ramp: number;
  half: number;
  yaw: number;
}

export interface InspectionPlatform {
  x: number;
  w: number;
  d: number;
  z: number;
  y: number;
}

// OSM way 498447364 provides the mapped plan. Elevations and fixtures are illustrative.
export const BRIDGE_S = 0.22;
const S = BRIDGE_S;
export const DECK_Y = 0.94;
export const DECK_W = 0.4 / S;
export const DECK_T = 0.12;
const west = -0.61;
const east = 0.61;
const platform = (x: number): InspectionPlatform => ({ x, w: 0.36, d: 0.26, z: 0.38, y: 0.01 });

export const BRIDGE = {
  // Existing internal station indices retain the workshop actor and notebook contracts.
  piers: [west, east, west],
  pierW: 0.24,
  pierD: 0.5,
  pylonPiers: [] as number[],
  legW: 0,
  legD: 0,
  legZ: 0,
  platform: platform(west),
  platforms: [platform(west), platform(east)],
  damage: {
    crack: { x: west, y: 0.09, z: 0.251 },
    corrosion: { x: east, y: 0.09, z: 0.251 },
  },
  clearanceY: (DECK_Y - DECK_T / 2) * S,
  lanes: [] as number[],
  footY: { west: 0.04, east: 0.04 },
  mappedLengthM: 14.5576,
  mappedWidthM: 4,
  waterY: -0.12,
};

const FRAME: BridgeFrame = {
  x: -38.19,
  z: -19.57,
  water: 0.72788,
  ramp: 1.5,
  half: 2.22788,
  yaw: (-13.3 * Math.PI) / 180,
};

export function harborBridgeFrame(): BridgeFrame {
  return FRAME;
}

export function toBridgeLocal(x: number, z: number): { lx: number; lz: number } {
  const dx = x - FRAME.x;
  const dz = z - FRAME.z;
  const c = Math.cos(FRAME.yaw);
  const s = Math.sin(FRAME.yaw);
  return { lx: dx * c - dz * s, lz: dx * s + dz * c };
}

export function fromBridgeLocal(lx: number, lz: number): { x: number; z: number } {
  const c = Math.cos(FRAME.yaw);
  const s = Math.sin(FRAME.yaw);
  return { x: FRAME.x + lx * c + lz * s, z: FRAME.z - lx * s + lz * c };
}

export function inBridgeCorridor(x: number, z: number, margin = 0.15): boolean {
  const p = toBridgeLocal(x, z);
  return Math.abs(p.lz) < 0.2 + margin && Math.abs(p.lx) < FRAME.half + margin;
}

export function bridgeDeckHeight(x: number, z: number): number | null {
  const p = toBridgeLocal(x, z);
  const a = Math.abs(p.lx);
  if (Math.abs(p.lz) > 0.2 || a > FRAME.half) return null;
  const top = (DECK_Y + DECK_T / 2) * S;
  return a <= FRAME.water ? top : top + ((a - FRAME.water) / FRAME.ramp) * (0.04 - top);
}

/** A single centre path matches the mapped single-lane road. */
export function bridgeLanes(): { points: [number, number][] }[] {
  const xs = [-FRAME.half, -FRAME.water, 0, FRAME.water, FRAME.half];
  return [{ points: xs.map((x): [number, number] => {
    const p = fromBridgeLocal(x, 0);
    return [p.x, p.z];
  }) }];
}
