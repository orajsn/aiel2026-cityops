import { setTerrainGrid, terrainHeight } from '../../src/world/terrain';

test('terrain height interpolates the map ground grid, and is 0 before the map loads', () => {
  expect(terrainHeight(0, 0)).toBe(0);
  // 3 x 3 grid over x 0..2, z 0..2, heights rising with x
  setTerrainGrid({ x0: 0, z0: 0, dx: 1, dz: 1, nx: 3, nz: 3, h: Float32Array.from([0, 1, 2, 0, 1, 2, 0, 1, 2]) });
  expect(terrainHeight(0.5, 1)).toBeCloseTo(0.5, 6);
  expect(terrainHeight(1.75, 0.2)).toBeCloseTo(1.75, 6);
  expect(terrainHeight(-5, 1)).toBeCloseTo(0, 6); // clamped at the edge
});

test('a ground mesh with float noise in its vertex positions is still read as a grid', async () => {
  const THREE = await import('three');
  const { terrainGridFromMesh } = await import('../../src/world/terrain');
  const g = new THREE.PlaneGeometry(64, 32, 64, 32).rotateX(-Math.PI / 2);
  const p = g.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    // values sitting on a rounding boundary, nudged either way: the TerraMesh file has this kind of noise
    p.setX(i, p.getX(i) + 0.0005 + (i % 7 === 0 ? 2e-4 : -2e-4));
    p.setY(i, p.getX(i) * 0.01);
  }
  const grid = terrainGridFromMesh(new THREE.Mesh(g));
  expect(grid).not.toBeNull();
  expect(grid!.nx).toBe(65);
  expect(grid!.nz).toBe(33);
});
