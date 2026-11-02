import type * as THREE from 'three';
import type { Vec3 } from './shots';

/**
 * The live camera's right and up, as world vectors. The sky stage's cards, rings and tables used to be placed with the sky shot's
 * own right (skyPlaces `at`), which is wrong as soon as the owner saves another angle for a page (Camera mode): "to the right of
 * the database" must mean right on the screen, whatever the camera does.
 */
export interface Basis {
  right: Vec3;
  up: Vec3;
}
export const basisOf = (camera: THREE.Camera): Basis => {
  const e = camera.matrixWorld.elements;
  return { right: [e[0], e[1], e[2]], up: [e[4], e[5], e[6]] };
};
/** `anchor`, moved `dx` to the screen's right and `dy` up on the screen (world units) */
export const offset = (b: Basis, anchor: Vec3, dx: number, dy: number): Vec3 => [
  anchor[0] + b.right[0] * dx + b.up[0] * dy,
  anchor[1] + b.right[1] * dx + b.up[1] * dy,
  anchor[2] + b.right[2] * dx + b.up[2] * dy,
];
