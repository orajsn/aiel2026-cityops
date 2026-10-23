import * as THREE from 'three';
import type { Vec3 } from './shots';

/** A cubic bezier from `from` to `to`, with both control points lifted `lift` above the chord. */
export function arcCurve(from: Vec3, to: Vec3, lift: number): THREE.CubicBezierCurve3 {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const c1 = a.clone().lerp(b, 0.25);
  const c2 = a.clone().lerp(b, 0.75);
  const top = Math.max(a.y, b.y) + lift;
  c1.y = top;
  c2.y = top;
  return new THREE.CubicBezierCurve3(a, c1, c2, b);
}
