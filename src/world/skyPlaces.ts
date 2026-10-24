import { assetPosition } from '../content/geo';
import { projectToScreen } from './frame';
import { SHOTS, type Vec3 } from './shots';

/**
 * Where things stand on the sky stage over the Ops Center (SkyStage.tsx), shared with the HTML overlays
 * that write beside them. The data flows left to right: the database on the left, the language model on
 * the right, and words enter the model at its first layer (its left) and leave at its last (its right).
 */
const OPS = assetPosition('City Operations Control Center');
export const SKY_ANCHOR: Vec3 = [OPS.x, 9, OPS.z];
const A = SKY_ANCHOR;
export const OPS_TOP: Vec3 = [OPS.x, 1.2, OPS.z];

/** the sky camera's right, on the ground: the network faces the camera, so its first layer is on the left */
export const RIGHT: Vec3 = (() => {
  const [p, q] = [SHOTS.sky.position, SHOTS.sky.target];
  const f = [q[0] - p[0], q[2] - p[2]];
  const l = Math.hypot(f[0], f[1]) || 1;
  return [-f[1] / l, 0, f[0] / l];
})();
export const along = (p: Vec3, k: number): Vec3 => [p[0] + RIGHT[0] * k, p[1], p[2] + RIGHT[2] * k];
/** `k` to the camera's right of the anchor, `up` above it */
export const at = (k: number, up: number): Vec3 => along([A[0], A[1] + up, A[2]], k);

export const MODEL_SCALE = 1.25;
/** half the network's width (NeuralNet WIDTH 2.6) at MODEL_SCALE: where its first and last layers are */
const HALF = 1.35 * MODEL_SCALE;

/** Lab 2 pages 1 to 3: the model right of centre, the database and its vector space on the left */
export const MODEL: Vec3 = [A[0] + 3.0, A[1] + 0.3, A[2]];
export const MODEL_IN = along(MODEL, -HALF);
export const MODEL_OUT = along(MODEL, HALF);
export const DB: Vec3 = [A[0] - 2.8, A[1] - 1.4, A[2]];
export const CLOUD: Vec3 = [A[0] - 2.6, A[1] + 3.6, A[2]];
export const ENVELOPE: Vec3 = [A[0] + 0.1, A[1] + 1.4, A[2]];

/** Lab 2 pages 5 and 6: the database far left, the model far right, the tools or the four shapes between them */
export const DB_WIDE = at(-5.2, -1.0);
export const MODEL_WIDE = at(10.5, 1.2);
export const MODEL_WIDE_IN = along(MODEL_WIDE, -HALF);
export const MODEL_WIDE_OUT = along(MODEL_WIDE, HALF);

/** a world point's place on the sky camera's screen, x and y in -1..1 */
export function skyScreen(p: Vec3): { x: number; y: number } {
  const s = projectToScreen(SHOTS.sky.position, SHOTS.sky.target, p);
  return { x: s.x, y: s.y };
}
/** stage pixels (1920 x 1080) of a screen position */
export const px = (x: number) => ((x + 1) / 2) * 1920;
export const py = (y: number) => ((1 - y) / 2) * 1080;

/**
 * Lab 2 page 6: the four shapes the one query returns, two by two between the database and the model
 * (screen rectangles of the sky camera, like 0.5's board). Their names sit in a band at the top of each.
 */
export const UNIFIED_PANELS: { kind: 'table' | 'json' | 'graph' | 'vectors'; x0: number; x1: number; y0: number; y1: number }[] = [
  { kind: 'table', x0: -0.4, x1: -0.03, y0: 0.12, y1: 0.8 },
  { kind: 'json', x0: 0.01, x1: 0.38, y0: 0.12, y1: 0.8 },
  { kind: 'graph', x0: -0.4, x1: -0.03, y0: -0.62, y1: 0.06 },
  { kind: 'vectors', x0: 0.01, x1: 0.38, y0: -0.62, y1: 0.06 },
];
/** where the one brief stands (screen), under the model */
export const BRIEF_AT = { x: 0.65, y: -0.4 };

/** Lab 2 page 4: the folder of references, left of centre */
export const FOLDER = at(-2.2, 1.2);
