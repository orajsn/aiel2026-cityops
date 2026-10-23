import { harborBridgeFrame, toBridgeLocal } from '../../src/world/bridgeFrame';
import { RIVER_CURVE, distanceToRiver } from '../../src/world/river';

/** world direction of the deck (bridge-local +x), same convention as the group's rotation.y */
function deckDir() {
  const f = harborBridgeFrame();
  return { x: Math.cos(f.yaw), z: -Math.sin(f.yaw) };
}

test('the deck runs across the river, not along it', () => {
  const f = harborBridgeFrame();
  const tan = RIVER_CURVE.getTangentAt(distanceToRiver(f.x, f.z).t);
  const d = deckDir();
  // the real Taksin bridge crosses the flow at roughly 75-90 degrees
  expect(Math.abs(d.x * tan.x + d.z * tan.z)).toBeLessThan(Math.sin((25 * Math.PI) / 180));
});

test('the deck lies on the real Taksin bridge', () => {
  const f = harborBridgeFrame();
  // deck centre over the river, measured on the model's aerial texture
  expect(Math.hypot(f.x - -38.19, f.z - -19.52)).toBeLessThan(0.2);
  // the deck heads east-south-east along the real road, ~13 degrees off due east (both ramp feet on it)
  const d = deckDir();
  expect((Math.atan2(d.z, d.x) * 180) / Math.PI).toBeCloseTo(13.3, 0);
});

test('bridge-local coordinates round-trip the deck axis', () => {
  const f = harborBridgeFrame();
  const d = deckDir();
  const p = toBridgeLocal(f.x + d.x * 2, f.z + d.z * 2);
  expect(p.lx).toBeCloseTo(2, 6);
  expect(p.lz).toBeCloseTo(0, 6);
});

test('the ramps come down onto the ground of each bank, not into it or above it', async () => {
  const { BRIDGE } = await import('../../src/world/bridgeFrame');
  // ground heights measured on the model along the deck axis, 2.4 units out from the centre
  expect(BRIDGE.footY.west).toBeCloseTo(0.062, 2);
  expect(BRIDGE.footY.east).toBeCloseTo(0.116, 2);
});
