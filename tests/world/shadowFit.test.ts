import { vi } from 'vitest';
vi.mock('@react-three/drei', () => ({ useGLTF: Object.assign(() => ({ scene: null }), { preload: () => {} }) }));
import * as THREE from 'three';
import { SHADOW, SUN_POS, shadowRedraw } from '../../src/world/Lighting';
import { MORNING, EVENING } from '../../src/world/timeOfDay';
import { BKK } from '../../src/world/BangkokCity';

/** the map's corners, and the Ops room's east edge, in world units */
const hx = 7765 * BKK.scale;
const hz = 4309 * BKK.scale;
const corners = [
  [BKK.x - hx, BKK.z - hz],
  [BKK.x + hx, BKK.z - hz],
  [BKK.x - hx, BKK.z + hz],
  [BKK.x + hx, BKK.z + hz],
].map(([x, z]) => new THREE.Vector3(x, 0, z));

// owner, 28 Oct (Intel GPU: shadows were the largest cost): the shadow area fits the map instead of 640 x 640 units
test('the sun’s shadow area covers the whole map for the morning, afternoon and evening sun, and not much more', () => {
  for (const sun of [MORNING.sunPos, SUN_POS, EVENING.sunPos]) {
    const cam = new THREE.OrthographicCamera(-SHADOW.half, SHADOW.half, SHADOW.half, -SHADOW.half, SHADOW.near, SHADOW.far);
    cam.position.copy(new THREE.Vector3(...SHADOW.center).add(new THREE.Vector3(...sun)));
    cam.lookAt(new THREE.Vector3(...SHADOW.center));
    cam.updateMatrixWorld();
    cam.updateProjectionMatrix();
    for (const c of corners) {
      const p = c.clone().project(cam);
      expect(Math.abs(p.x), `${sun}`).toBeLessThanOrEqual(1);
      expect(Math.abs(p.y), `${sun}`).toBeLessThanOrEqual(1);
      expect(Math.abs(p.z), `${sun}`).toBeLessThanOrEqual(1);
    }
  }
  // sharper than before (640 units over 2048 texels) with a quarter of the texels
  expect((SHADOW.half * 2) / SHADOW.size).toBeLessThan(640 / 2048 / 1.5);
  expect(SHADOW.size).toBeLessThanOrEqual(1024);
});

test('the shadow area is centred on the map', async () => {
  const { BKK: b } = await import('../../src/world/BangkokCity');
  expect(SHADOW.center[0]).toBeCloseTo(b.x);
  expect(SHADOW.center[2]).toBeCloseTo(b.z);
});

// owner, 28 Oct: the lag is in the camera moves. The sun's shadows do not depend on the camera, so while it moves
// they are redrawn every third frame instead of every frame
test('during a camera move the shadows redraw every third frame, and every second frame when the camera holds', () => {
  const frames = (moving: boolean) => Array.from({ length: 9 }, (_, i) => shadowRedraw(moving, i)).filter(Boolean).length;
  expect(frames(false)).toBe(5);
  expect(frames(true)).toBe(3);
});
