import * as THREE from 'three';

/** The map's ground mesh is a regular grid (65 x 65 over the whole model): heights in world units. */
export interface TerrainGrid {
  x0: number;
  z0: number;
  dx: number;
  dz: number;
  nx: number;
  nz: number;
  /** row-major, index = iz * nx + ix */
  h: Float32Array;
}

let grid: TerrainGrid | null = null;

export function setTerrainGrid(g: TerrainGrid | null): void {
  grid = g;
}

/** Ground (or water surface) height of the map at (x, z), bilinear on the grid; 0 until the map has loaded. */
export function terrainHeight(x: number, z: number): number {
  if (!grid) return 0;
  const { x0, z0, dx, dz, nx, nz, h } = grid;
  const fx = Math.max(0, Math.min(nx - 1, (x - x0) / dx));
  const fz = Math.max(0, Math.min(nz - 1, (z - z0) / dz));
  const ix = Math.min(nx - 2, Math.floor(fx));
  const iz = Math.min(nz - 2, Math.floor(fz));
  const u = fx - ix;
  const v = fz - iz;
  const a = h[iz * nx + ix];
  const b = h[iz * nx + ix + 1];
  const c = h[(iz + 1) * nx + ix];
  const d = h[(iz + 1) * nx + ix + 1];
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

/** Build the grid from the map's ground mesh (any vertex order), in world space. */
export function terrainGridFromMesh(mesh: THREE.Mesh): TerrainGrid | null {
  mesh.updateWorldMatrix(true, false);
  const pos = mesh.geometry.getAttribute('position');
  const v = new THREE.Vector3();
  const pts: [number, number, number][] = [];
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
    pts.push([v.x, v.y, v.z]);
  }
  // group coordinates into columns / rows, tolerating float noise far below one grid step
  const lines = (vals: number[]) => {
    const sorted = [...vals].sort((a, b) => a - b);
    const span = sorted[sorted.length - 1] - sorted[0] || 1;
    const eps = span * 1e-4;
    const out: number[] = [];
    for (const v of sorted) if (!out.length || v - out[out.length - 1] > eps) out.push(v);
    return { out, eps };
  };
  const X = lines(pts.map((p) => p[0]));
  const Z = lines(pts.map((p) => p[2]));
  const nx = X.out.length;
  const nz = Z.out.length;
  if (nx < 2 || nz < 2 || nx * nz !== pts.length) return null; // not a regular grid
  const dx = (X.out[nx - 1] - X.out[0]) / (nx - 1);
  const dz = (Z.out[nz - 1] - Z.out[0]) / (nz - 1);
  const h = new Float32Array(nx * nz);
  for (const [x, y, z] of pts) {
    const ix = Math.round((x - X.out[0]) / dx);
    const iz = Math.round((z - Z.out[0]) / dz);
    h[iz * nx + ix] = y;
  }
  return { x0: X.out[0], z0: Z.out[0], dx, dz, nx, nz, h };
}
