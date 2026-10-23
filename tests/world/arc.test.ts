import { arcCurve } from '../../src/world/arc';

test('arc endpoints match and the middle is lifted', () => {
  const c = arcCurve([0, 0, 0], [100, 0, 0], 40);
  const p0 = c.getPoint(0);
  const p1 = c.getPoint(1);
  const mid = c.getPoint(0.5);
  expect(p0.x).toBeCloseTo(0);
  expect(p1.x).toBeCloseTo(100);
  expect(mid.y).toBeGreaterThanOrEqual(0 + 40 * 0.5);
});
