import raw from '../content/senayanDistrict.json';
import type { Bounds, Point, Polygons, SenayanData } from './senayanTypes';

function requireCondition(condition: boolean, path: string): asserts condition {
  if (!condition) throw new Error(`Invalid Senayan map data: ${path}`);
}

function object(value: unknown, path: string): asserts value is Record<string, unknown> {
  requireCondition(typeof value === 'object' && value !== null && !Array.isArray(value), path);
}

function array(value: unknown, path: string): asserts value is unknown[] {
  requireCondition(Array.isArray(value), path);
}

function finite(value: unknown, path: string): asserts value is number {
  requireCondition(typeof value === 'number' && Number.isFinite(value), path);
}

function stringFields(value: Record<string, unknown>, fields: string[], path: string) {
  for (const field of fields) requireCondition(typeof value[field] === 'string', `${path}.${field}`);
}

function point(value: unknown, path: string): asserts value is Point {
  array(value, path);
  requireCondition(value.length === 2, path);
  value.forEach((coordinate, i) => finite(coordinate, `${path}[${i}]`));
}

function bounds(value: unknown, path: string): asserts value is Bounds {
  array(value, path);
  requireCondition(value.length === 4, path);
  value.forEach((coordinate, i) => finite(coordinate, `${path}[${i}]`));
  requireCondition(Number(value[0]) <= Number(value[2]) && Number(value[1]) <= Number(value[3]), path);
}

function line(value: unknown, path: string, minimum = 2): asserts value is Point[] {
  array(value, path);
  requireCondition(value.length >= minimum, path);
  value.forEach((coordinate, i) => point(coordinate, `${path}[${i}]`));
}

function polygons(value: unknown, path: string): asserts value is Polygons {
  array(value, path);
  requireCondition(value.length > 0, path);
  value.forEach((polygon, i) => {
    array(polygon, `${path}[${i}]`);
    requireCondition(polygon.length > 0, `${path}[${i}]`);
    polygon.forEach((ring, k) => line(ring, `${path}[${i}][${k}]`, 3));
  });
}

/** Validate the generated JSON at its boundary instead of suppressing TypeScript checks. */
export function assertSenayanData(value: unknown): asserts value is SenayanData {
  object(value, 'root');
  for (const key of ['buildings', 'roads', 'water', 'land', 'trees']) array(value[key], key);
  const buildings = value.buildings;
  array(buildings, 'buildings');
  buildings.forEach((building, i) => {
    const p = `buildings[${i}]`;
    object(building, p);
    stringFields(building, ['id', 'name', 'height_basis'], p);
    polygons(building.polygons, `${p}.polygons`);
    finite(building.height, `${p}.height`);
    finite(building.height_m, `${p}.height_m`);
    requireCondition(building.height > 0 && building.height_m > 0, `${p}.height`);
    if (building.levels !== null) finite(building.levels, `${p}.levels`);
    requireCondition(typeof building.landmark === 'boolean', `${p}.landmark`);
    requireCondition(building.kind === null || typeof building.kind === 'string', `${p}.kind`);
    point(building.center, `${p}.center`);
    bounds(building.bounds, `${p}.bounds`);
  });

  const roads = value.roads;
  array(roads, 'roads');
  roads.forEach((road, i) => {
    const p = `roads[${i}]`;
    object(road, p);
    stringFields(road, ['id', 'name', 'kind'], p);
    line(road.line, `${p}.line`);
    finite(road.width, `${p}.width`);
    requireCondition(road.width > 0, `${p}.width`);
    finite(road.layer, `${p}.layer`);
    requireCondition(typeof road.bridge === 'boolean' && typeof road.oneway === 'boolean', p);
  });

  const waters = value.water;
  array(waters, 'water');
  waters.forEach((water, i) => {
    const p = `water[${i}]`;
    object(water, p);
    stringFields(water, ['id', 'name'], p);
    if (water.polygons !== undefined) {
      polygons(water.polygons, `${p}.polygons`);
      requireCondition(water.line === undefined && water.width === undefined && water.width_basis === undefined, p);
    } else {
      line(water.line, `${p}.line`);
      finite(water.width, `${p}.width`);
      requireCondition(water.width > 0, `${p}.width`);
      stringFields(water, ['width_basis'], p);
    }
  });

  const land = value.land;
  array(land, 'land');
  land.forEach((area, i) => {
    const p = `land[${i}]`;
    object(area, p);
    stringFields(area, ['id', 'name', 'kind'], p);
    polygons(area.polygons, `${p}.polygons`);
  });
  object(value.landmarks, 'landmarks');
  for (const [id, landmark] of Object.entries(value.landmarks)) {
    object(landmark, `landmarks.${id}`);
    stringFields(landmark, ['name'], `landmarks.${id}`);
    point(landmark.center, `landmarks.${id}.center`);
    bounds(landmark.bounds, `landmarks.${id}.bounds`);
    polygons(landmark.polygons, `landmarks.${id}.polygons`);
  }
  const trees = value.trees;
  array(trees, 'trees');
  trees.forEach((tree, i) => point(tree, `trees[${i}]`));

  object(value.meta, 'meta');
  stringFields(value.meta, ['source', 'license', 'source_url', 'retrieved', 'height_note'], 'meta');
  finite(value.meta.units_per_metre, 'meta.units_per_metre');
  requireCondition(value.meta.units_per_metre > 0, 'meta.units_per_metre');
  finite(value.meta.world_yaw, 'meta.world_yaw');
  for (const key of ['bridge_lonlat', 'world_anchor', 'road_axis_EN']) point(value.meta[key], `meta.${key}`);
  bounds(value.meta.bounds, 'meta.bounds');
}

export function readSenayanData(value: unknown): SenayanData {
  assertSenayanData(value);
  return value;
}

const data = readSenayanData(raw);
export default data;
