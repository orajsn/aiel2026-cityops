import { screenPoint } from './frame';
import { SHOTS, type Vec3 } from './shots';
import { SHAPE_BOX, type DataKind } from './shapeBoxes';

/**
 * 0.5 · the answer: what the inspector's question needs, four panels around one Oracle AI Database.
 * Panels are screen rectangles (x, y in -1..1) of the sky camera, the same 2 x 2 order as 0.4's separate
 * places, so each piece flies up from its place by the bridge into its panel. The centre column is the database.
 */
export const BOARD: { kind: DataKind; need: string; shape: string; x0: number; x1: number; y0: number; y1: number }[] = [
  { kind: 'table', need: 'the asset record', shape: 'table', x0: -0.96, x1: -0.24, y0: 0.1, y1: 0.8 },
  { kind: 'json', need: 'its spec sheet', shape: 'JSON', x0: 0.24, x1: 0.96, y0: 0.1, y1: 0.8 },
  { kind: 'graph', need: 'what it depends on', shape: 'graph', x0: -0.96, x1: -0.24, y0: -0.74, y1: -0.04 },
  { kind: 'vectors', need: 'similar past reports', shape: 'vectors', x0: 0.24, x1: 0.96, y0: -0.74, y1: -0.04 },
];
/** how far in front of the sky camera the panels float: open air, well above the roofs */
export const BOARD_DEPTH = 8;
/** room at each panel's top for its name (HTML, CoreCaption) and around its edges */
export const HEADER_H = 0.12;
const PAD = 0.035;
/** where the database sits on screen */
export const STACK_AT = { x: 0, y: 0.24 };

export type Panel = (typeof BOARD)[number];

export function panelContent(p: Panel) {
  return { x0: p.x0 + PAD, x1: p.x1 - PAD, y0: p.y0 + PAD, y1: p.y1 - HEADER_H };
}

/** the world point at a screen position of the sky camera, `depth` in front of it */
export function boardPoint(x: number, y: number, depth = BOARD_DEPTH): Vec3 {
  const c = SHOTS.sky;
  return screenPoint(c.position, c.target, x, y, depth);
}

const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

type Rect = { x0: number; x1: number; y0: number; y1: number };

/**
 * The scale and placement that fit a shape's whole box inside a screen rectangle, centred. `at(x, y)` is
 * the world point at a screen position, at the depth the shape floats (any camera).
 */
export function fitShapeIn(kind: DataKind, c: Rect, at: (x: number, y: number) => Vec3, box = SHAPE_BOX[kind]) {
  const o = at(0, 0);
  const ux = dist(o, at(1, 0)); // world units per screen unit, sideways and up
  const uy = dist(o, at(0, 1));
  const [x0, x1, y0, y1] = box;
  const scale = Math.min(((c.x1 - c.x0) * ux) / (x1 - x0), ((c.y1 - c.y0) * uy) / (y1 - y0));
  const cx = (c.x0 + c.x1) / 2;
  const cy = (c.y0 + c.y1) / 2;
  const bx = (x0 + x1) / 2;
  const by = (y0 + y1) / 2;
  const toWorld = (x: number, y: number): Vec3 => at(cx + ((x - bx) * scale) / ux, cy + ((y - by) * scale) / uy);
  return { scale, origin: toWorld(0, 0), toWorld };
}

/** a 0.5 shape, fitted inside its panel below the panel name */
export function fitShape(kind: DataKind, p: Panel) {
  return fitShapeIn(kind, panelContent(p), (x, y) => boardPoint(x, y));
}
