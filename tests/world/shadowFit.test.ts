import * as THREE from 'three';
import { SHADOW, SUN_POS, fitShadowFrustum, shadowRedraw } from '../../src/world/Lighting';

test('shadow fitting follows the visible ground rather than the old Bangkok map centre', () => {
  const position = new THREE.Vector3(80, 40, -20);
  const direction = new THREE.Vector3(0, -1, -1).normalize();
  const fit = fitShadowFrustum(position, direction, 2048);
  const texel = fit.half * 2 / 2048;
  expect(Math.abs(fit.center.x - 80)).toBeLessThanOrEqual(texel / 2);
  expect(Math.abs(fit.center.z + 60)).toBeLessThanOrEqual(texel / 2);
  expect(fit.center.y).toBe(0);
  const camera = new THREE.OrthographicCamera(-fit.half, fit.half, fit.half, -fit.half, SHADOW.near, SHADOW.far);
  camera.position.copy(fit.center.clone().add(new THREE.Vector3(...SUN_POS)));
  camera.lookAt(fit.center); camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  for (const offset of [-10, 0, 10]) {
    const p = fit.center.clone().add(new THREE.Vector3(offset, 0, offset)).project(camera);
    expect(Math.abs(p.x)).toBeLessThan(1); expect(Math.abs(p.y)).toBeLessThan(1); expect(Math.abs(p.z)).toBeLessThan(1);
  }
});
test('close-ups use a tighter shadow area; low/high viewpoints remain bounded and finite', () => {
  const close = fitShadowFrustum(new THREE.Vector3(0, 2, 0), new THREE.Vector3(0, -1, 0), 2048);
  const wide = fitShadowFrustum(new THREE.Vector3(0, 90, 0), new THREE.Vector3(0, -.5, -1).normalize(), 2048);
  expect(close.half).toBeLessThan(wide.half);
  expect((close.half * 2) / 2048).toBeLessThan((wide.half * 2) / 2048);
  const horizon = fitShadowFrustum(new THREE.Vector3(0, 1000, 0), new THREE.Vector3(0, 0, -1), 4096);
  expect(horizon.half).toBe(180); expect(horizon.center.toArray().every(Number.isFinite)).toBe(true);
  expect(SHADOW.size).toBe(2048);
});
test('Balanced redraws every second frame; High redraws each frame', () => {
  const frames = (preset: 'balanced' | 'high') => Array.from({ length: 9 }, (_, i) => shadowRedraw(true, i, preset)).filter(Boolean).length;
  expect(frames('balanced')).toBe(5); expect(frames('high')).toBe(9);
});
