import DATA from './senayanData';
import type { Point } from './senayanTypes';

/** The projected extent of the bundled OSM district, not the legacy Bangkok mesh. */
export const SENAYAN_BOUNDS = DATA.meta.bounds;

/** Stable map-frame score used by the camera checks; a 3-world-unit edge margin. */
export function senayanEdgeVisibility(x: number, z: number): number {
  const [west, north, east, south] = SENAYAN_BOUNDS;
  const distance = Math.min(x - west, east - x, z - north, south - z);
  return Math.max(0, Math.min(1, distance / 3));
}

/** Project longitude/latitude into the same local crossing frame as the bundled data. */
export function projectSenayan(lon: number, lat: number): Point {
  const meta = DATA.meta;
  const [originLon, originLat] = meta.bridge_lonlat;
  const east = (lon - originLon) * 111320 * Math.cos((originLat * Math.PI) / 180);
  const north = (lat - originLat) * 111320;
  const [axisEast, axisNorth] = meta.road_axis_EN;
  const localX = (east * axisEast + north * axisNorth) * meta.units_per_metre;
  const localZ = (east * axisNorth - north * axisEast) * meta.units_per_metre;
  const cosine = Math.cos(meta.world_yaw);
  const sine = Math.sin(meta.world_yaw);
  return [
    meta.world_anchor[0] + localX * cosine + localZ * sine,
    meta.world_anchor[1] - localX * sine + localZ * cosine,
  ];
}
