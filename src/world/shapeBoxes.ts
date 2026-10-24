export type DataKind = 'table' | 'json' | 'graph' | 'vectors';

/**
 * Each data shape's extent in its own units [x0, x1, y0, y1], words included, so a panel can fit the
 * whole shape inside itself (0.5): nothing moves or reads outside its panel.
 */
export const SHAPE_BOX: Record<DataKind, [number, number, number, number]> = {
  table: [-1.25, 1.62, -0.62, 0.92],
  json: [-1.6, 1.4, -1.25, 1.08],
  graph: [-4.0, 3.3, -1.4, 1.25],
  vectors: [-2.3, 2.3, -1.1, 1.1],
};
