import { riverGeometry, isWater, distanceToRiver } from '../../src/world/river';
import { assetPosition } from '../../src/content/geo';

test('river ribbon spans the city north to south', () => {
  const g = riverGeometry(50);
  expect(g.getAttribute('position').count).toBe(102);
  g.computeBoundingBox();
  const bb = g.boundingBox!;
  expect(bb.max.z - bb.min.z).toBeGreaterThan(200);
  expect(Number.isFinite(bb.min.x)).toBe(true);
});

test('Harbor Bridge stands on the river', () => {
  const p = assetPosition('Harbor Bridge');
  expect(distanceToRiver(p.x, p.z).d).toBeLessThan(12);
  expect(isWater(p.x, p.z, 4)).toBe(true);
});

test('Substation Gamma is on dry land', () => {
  const p = assetPosition('Substation Gamma');
  expect(isWater(p.x, p.z)).toBe(false);
});
