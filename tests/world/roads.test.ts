import { roadRibbons, roadSegments, nearestRoad, ribbonGeometry } from '../../src/world/roads';
import { CITY_BOUNDS } from '../../src/world/cityLayout';

test('roads cover the city box with thousands of segments', () => {
  const segs = roadSegments();
  expect(segs.length).toBeGreaterThan(5000);
  const inside = segs.filter((s) => s.ax >= CITY_BOUNDS.minX && s.ax <= CITY_BOUNDS.maxX && s.az >= CITY_BOUNDS.minZ && s.az <= CITY_BOUNDS.maxZ);
  expect(inside.length / segs.length).toBeGreaterThan(0.9);
});

test('ribbons are built for every class and have geometry', () => {
  const ribbons = roadRibbons();
  expect(ribbons.length).toBeGreaterThan(1000);
  const g = ribbonGeometry(ribbons[0].pts, 1, 0.06);
  expect(g.getAttribute('position').count).toBe(ribbons[0].pts.length * 2);
  expect(ribbons.some((r) => r.elevated)).toBe(true);
});

test('nearestRoad finds a street near Sathorn', () => {
  // Sathorn / Silom is dense: a point there is within a few units of a primary or secondary road
  const near = nearestRoad(-12, -28, 10);
  expect(near).not.toBeNull();
  expect(near!.gap).toBeLessThan(6);
});
