import { BRIDGE_S, DECK_W, bridgeDeckHeight, bridgeLanes, fromBridgeLocal, harborBridgeFrame } from '../../src/world/bridgeFrame';
import { carScale } from '../../src/world/Cars';

const DECK_TOP = (1.6 + 0.36 / 2) * BRIDGE_S;

test('on Harbor Bridge the road is the deck top, between the banks', () => {
  const mid = fromBridgeLocal(0, 0);
  expect(bridgeDeckHeight(mid.x, mid.z)).toBeCloseTo(DECK_TOP, 4);
  const bank = fromBridgeLocal(0.95, 0.1);
  expect(bridgeDeckHeight(bank.x, bank.z)).toBeCloseTo(DECK_TOP, 4);
});

test('on the ramps the road slopes down to the street; off the deck there is no bridge road', () => {
  const f = harborBridgeFrame();
  const top = fromBridgeLocal(f.water, 0);
  const halfway = fromBridgeLocal(f.water + f.ramp / 2, 0);
  const foot = fromBridgeLocal(f.half - 0.001, 0);
  const h = (p: { x: number; z: number }) => bridgeDeckHeight(p.x, p.z)!;
  expect(h(top)).toBeCloseTo(DECK_TOP, 3);
  expect(h(halfway)).toBeLessThan(h(top));
  expect(h(foot)).toBeLessThan(0.15);
  // beside the deck (past its edge) and beyond the ramp foot: the map's ground, not the bridge
  const beside = fromBridgeLocal(0, (DECK_W * BRIDGE_S) / 2 + 0.05);
  expect(bridgeDeckHeight(beside.x, beside.z)).toBeNull();
  const beyond = fromBridgeLocal(f.half + 0.2, 0);
  expect(bridgeDeckHeight(beyond.x, beyond.z)).toBeNull();
});

test('bridge lanes: one each way, street to street over the deck, clear of the lamp posts at the sides', () => {
  const lanes = bridgeLanes();
  expect(lanes).toHaveLength(2);
  const f = harborBridgeFrame();
  const lampZ = (DECK_W / 2 - 0.3) * BRIDGE_S;
  for (const lane of lanes) {
    const xs = lane.points.map(([x, z]) => {
      const c = Math.cos(f.yaw);
      const s = Math.sin(f.yaw);
      const dx = x - f.x;
      const dz = z - f.z;
      return { lx: dx * c - dz * s, lz: dx * s + dz * c };
    });
    expect(Math.min(...xs.map((p) => p.lx))).toBeLessThan(-f.half);
    expect(Math.max(...xs.map((p) => p.lx))).toBeGreaterThan(f.half);
    for (const p of xs) {
      // a car of the default size keeps clear of the lamp posts
      expect(Math.abs(p.lz) + (1.8 * carScale(2)) / 2).toBeLessThan(lampZ - 0.01);
    }
  }
  // the two lanes are on opposite sides of the centre line
  const side = (lane: (typeof lanes)[0]) => Math.sign(fromBridgeLocalInverse(lane.points[0]).lz);
  expect(side(lanes[0])).not.toBe(side(lanes[1]));
});

function fromBridgeLocalInverse([x, z]: [number, number]) {
  const f = harborBridgeFrame();
  const c = Math.cos(f.yaw);
  const s = Math.sin(f.yaw);
  return { lx: (x - f.x) * c - (z - f.z) * s, lz: (x - f.x) * s + (z - f.z) * c };
}

test('a tap on the bridge puts the point on the deck, not on the water under it', async () => {
  const THREE = await import('three');
  const { groundPoint } = await import('../../src/world/roadHeight');
  const mid = fromBridgeLocal(0.3, 0);
  // looking down at the deck from the side, at an angle: the ray meets the deck first
  const origin = new THREE.Vector3(mid.x, 6, mid.z + 8);
  const ray = new THREE.Ray(origin, new THREE.Vector3(mid.x, DECK_TOP, mid.z).sub(origin).normalize());
  const p = groundPoint(ray)!;
  expect(p[0]).toBeCloseTo(mid.x, 3);
  expect(p[1]).toBeCloseTo(mid.z, 3);
  // away from the bridge the point is on the ground
  const far = new THREE.Ray(new THREE.Vector3(-60, 10, -40), new THREE.Vector3(0, -1, 0));
  expect(groundPoint(far)).toEqual([-60, -40]);
});
