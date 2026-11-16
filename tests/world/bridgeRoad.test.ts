import { BRIDGE, BRIDGE_S, DECK_T, DECK_Y, DECK_W, bridgeDeckHeight, bridgeLanes, fromBridgeLocal, toBridgeLocal, harborBridgeFrame } from '../../src/world/bridgeFrame';
import DATA from '../../src/world/senayanData';

const DECK_TOP = (DECK_Y + DECK_T / 2) * BRIDGE_S;
const heightAt = (lx: number, lz = 0) => { const p = fromBridgeLocal(lx, lz); return bridgeDeckHeight(p.x, p.z); };

test('the bridge road follows the slab top across the mapped crossing', () => {
  const frame = harborBridgeFrame();
  for (const x of [-frame.water + 0.001, 0, frame.water - 0.001]) {
    for (const z of [-0.14, 0, 0.14]) expect(heightAt(x, z)).toBeCloseTo(DECK_TOP, 6);
  }
  expect(DECK_TOP).toBeGreaterThan(BRIDGE.clearanceY);
});

test('both approaches join the deck continuously and descend to the district street height', () => {
  const frame = harborBridgeFrame();
  for (const side of [-1, 1]) {
    const heights = Array.from({ length: 11 }, (_, i) => heightAt(side * (frame.water + (frame.ramp - 1e-7) * i / 10))!);
    expect(heights[0]).toBeCloseTo(DECK_TOP, 6);
    for (let i = 1; i < heights.length; i++) expect(heights[i]).toBeLessThanOrEqual(heights[i - 1]);
    expect(heights[heights.length - 1]).toBeCloseTo(side < 0 ? BRIDGE.footY.west : BRIDGE.footY.east, 6);
    expect(Math.abs(heightAt(side * (frame.water - 1e-6))! - heightAt(side * (frame.water + 1e-6))!)).toBeLessThan(1e-6);
  }
  expect((DECK_TOP - BRIDGE.footY.west) / frame.ramp).toBeLessThan(0.13);
});

test('only the actual deck and approach corridor overrides the district ground height', () => {
  const frame = harborBridgeFrame();
  expect(heightAt(0, DECK_W * BRIDGE_S / 2 + 0.001)).toBeNull();
  expect(heightAt(0, -DECK_W * BRIDGE_S / 2 - 0.001)).toBeNull();
  expect(heightAt(frame.half + 0.001)).toBeNull();
  expect(heightAt(-frame.half - 0.001)).toBeNull();
});

test('the single-lane centre path crosses each slope boundary and reaches both streets', () => {
  const [lane, ...extra] = bridgeLanes();
  expect(extra).toHaveLength(0);
  const frame = harborBridgeFrame();
  const local = lane.points.map(([x, z]) => toBridgeLocal(x, z));
  expect(local[0].lx).toBeCloseTo(-frame.half, 6);
  expect(local[local.length - 1].lx).toBeCloseTo(frame.half, 6);
  for (let i = 1; i < local.length; i++) expect(local[i].lx).toBeGreaterThan(local[i - 1].lx);
  for (const point of local) expect(point.lz).toBeCloseTo(0, 6);
  for (const boundary of [-frame.water, frame.water]) expect(local.some((point) => Math.abs(point.lx - boundary) < 1e-6)).toBe(true);
  // A normal1.8m car centred on the crossing fits between its outer rail lines.
  const carHalfWidth = 1.8 * DATA.meta.units_per_metre / 2;
  expect(carHalfWidth).toBeLessThan(DECK_W * BRIDGE_S / 2 - 0.03);
});

test('a map tap on the bridge selects its deck rather than the lower canal or terrain', async () => {
  const THREE = await import('three');
  const { groundPoint } = await import('../../src/world/roadHeight');
  const mid = fromBridgeLocal(0.3, 0);
  const origin = new THREE.Vector3(mid.x, 6, mid.z + 8);
  const ray = new THREE.Ray(origin, new THREE.Vector3(mid.x, DECK_TOP, mid.z).sub(origin).normalize());
  const p = groundPoint(ray)!;
  expect(p[0]).toBeCloseTo(mid.x, 3);
  expect(p[1]).toBeCloseTo(mid.z, 3);
  const far = new THREE.Ray(new THREE.Vector3(-60, 10, -40), new THREE.Vector3(0, -1, 0));
  expect(groundPoint(far)).toEqual([-60, -40]);
});
