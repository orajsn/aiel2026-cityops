import { BOATS, BOAT_TOP_Y, boatXZ, riverBoats, type BoatSpec } from '../../src/world/Boats';
import { LIMITS } from '../../src/content/traffic';
import { BRIDGE, toBridgeLocal } from '../../src/world/bridgeFrame';

/** Everything standing in the water under Harbor Bridge, in bridge-local units: [x0, x1, z0, z1]. */
function obstacles(): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  for (const x of BRIDGE.piers) out.push([x - BRIDGE.pierW / 2, x + BRIDGE.pierW / 2, -BRIDGE.pierD / 2, BRIDGE.pierD / 2]);
  for (const i of BRIDGE.pylonPiers) {
    const x = BRIDGE.piers[i];
    for (const s of [-1, 1]) out.push([x - BRIDGE.legW / 2, x + BRIDGE.legW / 2, s * BRIDGE.legZ - BRIDGE.legD / 2, s * BRIDGE.legZ + BRIDGE.legD / 2]);
  }
  for (const p of BRIDGE.platforms) out.push([p.x - p.w / 2, p.x + p.w / 2, p.z - p.d / 2, p.z + p.d / 2]);
  return out;
}

function sail(boats: BoatSpec[], step: number) {
  const obs = obstacles();
  let underBridge = 0;
  for (const b of boats) {
    for (let t = 0.25; t <= 0.9; t += step) {
      const { x, z } = boatXZ(t, b);
      const { lx, lz } = toBridgeLocal(x, z);
      const hw = b.width / 2 + 0.01;
      const hl = b.length / 2 + 0.01;
      if (Math.abs(lz) < 0.05) underBridge++;
      for (const [x0, x1, z0, z1] of obs) {
        const hit = lx + hw > x0 && lx - hw < x1 && lz + hl > z0 && lz - hl < z1;
        if (hit) throw new Error(`${b.kind} at t=${t.toFixed(4)} hits an obstacle at lx=${lx.toFixed(3)} lz=${lz.toFixed(3)}`);
      }
    }
  }
  return underBridge;
}

test('no boat ever sails through a pier, a tower leg or an inspection platform (Pier 3 and Pier 2)', () => {
  expect(BRIDGE.platforms.map((p) => p.x)).toEqual([BRIDGE.piers[2], BRIDGE.piers[1]]);
  expect(sail(BOATS, 0.00005)).toBeGreaterThan(0); // the boats really do pass under the bridge
});

test('Traffic mode: the most river boats it allows, at any speed, still clear every pier, leg and platform', () => {
  const many = riverBoats(LIMITS.boats.count[1], 1, 10);
  expect(many).toHaveLength(LIMITS.boats.count[1]);
  expect(sail(many, 0.0002)).toBeGreaterThan(0);
});

test('boats pass under the deck and the platform with room to spare', () => {
  for (const p of BRIDGE.platforms) expect(BOAT_TOP_Y).toBeLessThan(p.y - 0.03);
  expect(BOAT_TOP_Y).toBeLessThan(BRIDGE.clearanceY - 0.05);
});

test('boats are river-boat sized, not ships (a Chao Phraya express boat is ~4 m by ~30 m)', () => {
  for (const b of BOATS) {
    expect(b.width).toBeLessThan(0.08); // < ~9 m
    expect(b.length).toBeLessThan(0.4); // < ~43 m
  }
});

test('Traffic mode: a boat route drawn straight through any pier, platform or tower leg is steered through the open span', async () => {
  const { steerAtBridge } = await import('../../src/world/Boats');
  const { makePath, travel } = await import('../../src/world/trafficPaths');
  const { fromBridgeLocal } = await import('../../src/world/bridgeFrame');
  const obs = obstacles();
  const ferry = BOATS.find((b) => b.kind === 'ferry')!;
  const barge = BOATS.find((b) => b.kind === 'barge')!;
  // routes across the bridge at every pier, the platforms and between them, in both directions, a little skewed
  for (let lx = -0.9; lx <= 0.75; lx += 0.03) {
    const a = fromBridgeLocal(lx - 0.15, -3);
    const b = fromBridgeLocal(lx + 0.15, 3);
    const path = makePath([[a.x, a.z], [b.x, b.z]]);
    for (const dir of [1, -1] as const) {
      const v = { route: 0, start: dir === 1 ? 0 : path.length, speed: 0.05, dir, tint: 0 };
      for (let t = 0; t < path.length / 0.05; t += 0.25) {
        const p = travel(path, v, t);
        const s = steerAtBridge(p.x, p.z, p.angle);
        const { lx: bx, lz: bz } = toBridgeLocal(s.x, s.z);
        for (const boat of [ferry, barge]) {
          const hw = boat.width / 2 + 0.01;
          const hl = boat.length / 2 + 0.01;
          for (const [x0, x1, z0, z1] of obs) {
            const hit = bx + hw > x0 && bx - hw < x1 && bz + hl > z0 && bz - hl < z1;
            if (hit) throw new Error(`route at lx=${lx.toFixed(2)} dir ${dir}: ${boat.kind} hits at lx=${bx.toFixed(3)} lz=${bz.toFixed(3)}`);
          }
        }
      }
    }
  }
});
