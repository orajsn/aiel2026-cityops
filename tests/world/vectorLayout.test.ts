import { layoutCloud, nearestK, applyWalls } from '../../src/world/vectorLayout';

test('layoutCloud is deterministic per seed and differs across seeds', () => {
  expect(layoutCloud(10, 1)).toEqual(layoutCloud(10, 1));
  expect(layoutCloud(10, 1)).not.toEqual(layoutCloud(10, 2));
  expect(layoutCloud(10, 1)).toHaveLength(10);
});

test('layoutCloud points sit inside the radius-30 sphere', () => {
  for (const [x, y, z] of layoutCloud(200, 7)) expect(Math.hypot(x, y, z)).toBeLessThanOrEqual(30.001);
});

test('nearestK sorts indices by distance to the query', () => {
  const pts: [number, number, number][] = [
    [10, 0, 0],
    [1, 0, 0],
    [5, 0, 0],
  ];
  expect(nearestK(pts, [0, 0, 0], 2)).toEqual([1, 2]);
  expect(nearestK(pts, [0, 0, 0], 5)).toEqual([1, 2, 0]);
});

test('applyWalls keeps only points whose tags match every filter key', () => {
  const pts: [number, number, number][] = [[0, 0, 0], [1, 0, 0], [2, 0, 0]];
  const tags = [
    { asset: 'Harbor Bridge', category: 'corrosion' },
    { asset: 'Substation Gamma', category: 'corrosion' },
    { asset: 'Harbor Bridge', category: 'crack' },
  ];
  expect(applyWalls(pts, tags, { asset: 'Harbor Bridge' })).toEqual([true, false, true]);
  expect(applyWalls(pts, tags, { asset: 'Harbor Bridge', category: 'corrosion' })).toEqual([true, false, false]);
});
