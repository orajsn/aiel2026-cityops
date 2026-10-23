import assetsJson from './assets.json';

export const CENTRE = { lat: 13.7, lon: 100.55 };
/** 1 degree of longitude = 1000 scene units. */
export const UNITS_PER_DEG = 1000;

export type AssetType =
  | 'bridge'
  | 'substation'
  | 'pipeline'
  | 'water'
  | 'energy'
  | 'sensor'
  | 'comms'
  | 'civil'
  | 'ops';

export interface Asset {
  id: string;
  type: AssetType;
  district: string;
  criticality: 1 | 2 | 3 | 4 | 5;
  lat: number;
  lon: number;
  specs: Record<string, number | string>;
}

export const ASSETS = assetsJson as unknown as Asset[];

export function project(lat: number, lon: number): { x: number; z: number } {
  const x = (lon - CENTRE.lon) * UNITS_PER_DEG;
  // latitude degrees are slightly longer than longitude degrees at 13.7 N
  const z = -(lat - CENTRE.lat) * UNITS_PER_DEG / Math.cos((CENTRE.lat * Math.PI) / 180);
  return { x, z };
}

export function assetById(id: string): Asset | undefined {
  return ASSETS.find((a) => a.id === id);
}

export function assetPosition(id: string): { x: number; z: number } {
  const a = assetById(id);
  return a ? project(a.lat, a.lon) : { x: 0, z: 0 };
}
