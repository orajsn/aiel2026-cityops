import { BRIDGE, BRIDGE_S, DECK_W, harborBridgeFrame, toBridgeLocal, fromBridgeLocal } from '../../src/world/bridgeFrame';
import DATA from '../../src/world/senayanData';
import { SHOTS } from '../../src/world/shots';
import * as THREE from 'three';

const mappedRoad = DATA.roads.find((road) => road.id === 'way/498447364')!;
const mappedRiver = DATA.water.find((water) => water.id === 'way/28931504');

function nearestRiverSegment() {
  if (!mappedRiver?.line) throw new Error('The Senayan fixture must retain the Kali Grogol centreline');
  const frame = harborBridgeFrame();
  let best = { distance: Infinity, dx: 0, dz: 0 };
  for (let i = 1; i < mappedRiver.line.length; i++) {
    const [ax, az] = mappedRiver.line[i - 1];
    const [bx, bz] = mappedRiver.line[i];
    const dx = bx - ax;
    const dz = bz - az;
    const length = Math.hypot(dx, dz);
    if (!length) continue;
    const t = Math.max(0, Math.min(1, ((frame.x - ax) * dx + (frame.z - az) * dz) / (length * length)));
    const distance = Math.hypot(frame.x - ax - t * dx, frame.z - az - t * dz);
    if (distance < best.distance) best = { distance, dx: dx / length, dz: dz / length };
  }
  return best;
}

test('the crossing stays anchored to the mapped Senayan road and Kali Grogol intersection', () => {
  const frame = harborBridgeFrame();
  expect(mappedRoad).toBeDefined();
  expect(mappedRoad.bridge).toBe(true);
  expect(frame.x).toBeCloseTo(DATA.meta.world_anchor[0], 6);
  expect(frame.z).toBeCloseTo(DATA.meta.world_anchor[1], 6);
  for (const [x, z] of mappedRoad.line) expect(Math.abs(toBridgeLocal(x, z).lz)).toBeLessThan(0.001);
  const tangent = nearestRiverSegment();
  expect(tangent.distance).toBeLessThan(0.001);
  const dot = Math.cos(frame.yaw) * tangent.dx - Math.sin(frame.yaw) * tangent.dz;
  expect(Math.abs(dot)).toBeLessThan(Math.sin(25 * Math.PI / 180));
});

test('mapped plan dimensions remain approximately14.56m by4m at the district scale', () => {
  const length = mappedRoad.line.slice(1).reduce((sum, point, i) => sum + Math.hypot(point[0] - mappedRoad.line[i][0], point[1] - mappedRoad.line[i][1]), 0);
  const scale = DATA.meta.units_per_metre;
  expect(length / scale).toBeCloseTo(14.56, 1);
  expect(harborBridgeFrame().water * 2).toBeCloseTo(length, 3);
  expect(DECK_W * BRIDGE_S).toBeCloseTo(mappedRoad.width, 6);
  expect(mappedRoad.width / scale).toBeCloseTo(4, 6);
});

test('bridge-local coordinates round-trip both the deck axis and inspection-side offsets', () => {
  for (const [lx, lz] of [[0, 0], [-2.1, 0], [1.4, 0.3], [-0.61, 0.38], [0.61, 0.38]]) {
    const world = fromBridgeLocal(lx, lz);
    const local = toBridgeLocal(world.x, world.z);
    expect(local.lx).toBeCloseTo(lx, 10);
    expect(local.lz).toBeCloseTo(lz, 10);
  }
});

test('two bank abutment stations leave the canal clear and have no cable towers', () => {
  if (!mappedRiver?.line) throw new Error('Missing river centreline');
  const supports = [...new Set(BRIDGE.piers)];
  expect(supports).toHaveLength(2);
  expect(Math.min(...supports)).toBeLessThan(0);
  expect(Math.max(...supports)).toBeGreaterThan(0);
  for (const x of supports) expect(Math.abs(x) - BRIDGE.pierW / 2).toBeGreaterThan(mappedRiver.width / 2);
  expect(BRIDGE.pylonPiers).toHaveLength(0);
});

test('damage and actor platforms stay on matching exposed abutment faces', () => {
  const damages = [BRIDGE.damage.crack, BRIDGE.damage.corrosion];
  damages.forEach((damage, i) => {
    const platform = BRIDGE.platforms[i];
    expect(damage.x).toBe(platform.x);
    expect(damage.z).toBeGreaterThan(BRIDGE.pierD / 2);
    expect(damage.z - BRIDGE.pierD / 2).toBeLessThan(0.002);
    expect(damage.y).toBeGreaterThan(platform.y);
    expect(damage.y).toBeLessThan(BRIDGE.clearanceY);
    expect(platform.z - platform.d / 2).toBeGreaterThanOrEqual(BRIDGE.pierD / 2 - 1e-9);
    expect(platform.y).toBeGreaterThan(BRIDGE.waterY);
  });
});

test('accepted bridge and inspection cameras still frame their geometric subjects', () => {
  const frame = harborBridgeFrame();
  expect(SHOTS.bridge.target[0]).toBeCloseTo(frame.x, 6);
  expect(SHOTS.bridge.target[2]).toBeCloseTo(frame.z, 6);
  for (const [damage, shot] of [
    [BRIDGE.damage.crack, SHOTS.pier3.push!],
    [BRIDGE.damage.corrosion, SHOTS['pier2-close']],
  ] as const) {
    const point = fromBridgeLocal(damage.x, damage.z);
    const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 3000);
    camera.position.set(...shot.position);
    camera.lookAt(...shot.target);
    camera.updateMatrixWorld();
    const screen = new THREE.Vector3(point.x, damage.y, point.z).project(camera);
    expect(Math.abs(screen.x)).toBeLessThan(0.85);
    expect(Math.abs(screen.y)).toBeLessThan(0.85);
    expect(screen.z).toBeGreaterThan(-1);
    expect(screen.z).toBeLessThan(1);
    expect(shot.position[1]).toBeGreaterThan(BRIDGE.waterY);
  }
});
