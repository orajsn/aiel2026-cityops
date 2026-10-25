import * as THREE from 'three';
import { BRIDGE_S, DECK_T, DECK_Y, bridgeDeckHeight } from './bridgeFrame';
import { terrainHeight } from './terrain';

/** where a car drives at (x, z): on Harbor Bridge the deck (ramps included), anywhere else the map's ground */
export function roadHeight(x: number, z: number): number {
  const g = terrainHeight(x, z);
  const d = bridgeDeckHeight(x, z);
  return d === null ? g : Math.max(g, d);
}

/**
 * Where a tap lands on the map: on Harbor Bridge's deck if the ray meets it (so a point tapped on the bridge is on
 * the bridge, not on the water under it), otherwise on the ground, refined on the road's height.
 */
export function groundPoint(ray: THREE.Ray): [number, number] | null {
  const hit = new THREE.Vector3();
  const top = (DECK_Y + DECK_T / 2) * BRIDGE_S;
  if (ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -top), hit)) {
    const d = bridgeDeckHeight(hit.x, hit.z);
    if (d !== null && Math.abs(d - top) < 1e-6) return [hit.x, hit.z];
  }
  let h = 0;
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  for (let i = 0; i < 4; i++) {
    plane.constant = -h;
    if (!ray.intersectPlane(plane, hit)) return null;
    h = roadHeight(hit.x, hit.z);
  }
  return [hit.x, hit.z];
}
