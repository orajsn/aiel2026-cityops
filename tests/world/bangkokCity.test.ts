import { vi } from 'vitest';
vi.mock('@react-three/drei', () => ({ useGLTF: () => ({ scene: null }) }));
import * as THREE from 'three';
import { BKK, HAZE, bangkokCovers, hazeAt } from '../../src/world/BangkokCity';
import { project } from '../../src/content/geo';

// Fitted on Sanam Luang and Lumphini Park, checked against OSM roads and the river: the model is ~15 x 8 km.
test('the model covers the Taksin crossing and the old city', () => {
  const taksin = project(13.7196, 100.5124);
  const sanamLuang = project(13.7555, 100.4927);
  expect(bangkokCovers(taksin.x, taksin.z)).toBe(true);
  expect(bangkokCovers(sanamLuang.x, sanamLuang.z)).toBe(true);
});

test('the Khlong Toei port is outside the model', () => {
  const port = project(13.705, 100.56);
  expect(bangkokCovers(port.x, port.z)).toBe(false);
});

test('the model is not mirrored', () => {
  expect('mirrorZ' in BKK).toBe(false);
});

test('the map fades into the haze over its last few units, so its cut edge never shows', async () => {
  const { edgeVisibility, EDGE_FADE } = await import('../../src/world/BangkokCity');
  expect(edgeVisibility(BKK.x, BKK.z)).toBe(1);
  const taksin = project(13.7196, 100.5124);
  expect(edgeVisibility(taksin.x, taksin.z)).toBeGreaterThan(0.2); // the hero crossing stays readable
  expect(edgeVisibility(BKK.x, BKK.z + 4309 * BKK.scale)).toBe(0); // the south edge itself is pure haze
  expect(EDGE_FADE.north).toBeGreaterThan(10);
  expect(EDGE_FADE.south).toBeLessThan(2); // Harbor Bridge is 4.7 units from the south edge: frames need that ground
});

// owner, 28 Oct: from a low camera the far city stayed sharp up to the map's edge; it now fades into the haze
// near the horizon line, the way real air looks, while anything seen from above stays clear
describe('horizon haze', () => {
  const cam = new THREE.Vector3(-38.6, 3.45, -12.6); // page 2's saved camera
  const at = (dz: number, y = 0) => new THREE.Vector3(-38.6, y, -12.6 - dz);
  test('from page 2’s low camera: the near city is clear, the far edge is mostly haze', () => {
    expect(hazeAt(cam, at(25))).toBeLessThan(0.1);
    expect(hazeAt(cam, at(80))).toBeGreaterThan(0.5);
    expect(hazeAt(cam, at(80))).toBeLessThanOrEqual(HAZE.max);
  });
  test('seen from above, the same far edge stays clear', () => {
    expect(hazeAt(new THREE.Vector3(-38.6, 60, -12.6), at(80))).toBeLessThan(0.05);
  });
  test('the bridge in a close shot stays clear', () => {
    expect(hazeAt(new THREE.Vector3(-38, 1.2, -16), new THREE.Vector3(-38.2, 0.3, -19.5))).toBeLessThan(0.05);
  });
});
