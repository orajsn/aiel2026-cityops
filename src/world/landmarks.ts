import { project } from '../content/geo';

export type LandmarkKind = 'prang' | 'palace' | 'pixelTower' | 'spireTower' | 'obelisk' | 'goldMount' | 'pylon' | 'crane' | 'park';

export interface Landmark {
  id: string;
  kind: LandmarkKind;
  lat: number;
  lon: number;
  /** radius kept free of kit buildings, scene units */
  clear: number;
  /** rotation about y, radians */
  yaw?: number;
}

/** Real Bangkok landmarks, drawn stylised at their real coordinates. */
export const LANDMARKS: Landmark[] = [
  { id: 'Wat Arun', kind: 'prang', lat: 13.7437, lon: 100.4889, clear: 3.2 },
  { id: 'Grand Palace', kind: 'palace', lat: 13.75, lon: 100.4913, clear: 4.5, yaw: 0.3 },
  { id: 'Golden Mount', kind: 'goldMount', lat: 13.7538, lon: 100.5067, clear: 2.6 },
  { id: 'MahaNakhon', kind: 'pixelTower', lat: 13.7236, lon: 100.5285, clear: 2.4 },
  { id: 'Baiyoke Tower', kind: 'spireTower', lat: 13.7544, lon: 100.5404, clear: 2.2 },
  { id: 'Victory Monument', kind: 'obelisk', lat: 13.7649, lon: 100.5382, clear: 2.2 },
  { id: 'Rama VIII Bridge', kind: 'pylon', lat: 13.7695, lon: 100.499, clear: 2.0 },
  { id: 'Lumphini Park', kind: 'park', lat: 13.7308, lon: 100.5417, clear: 6.0 },
  { id: 'Port crane 1', kind: 'crane', lat: 13.7025, lon: 100.573, clear: 1.6, yaw: 0.9 },
  { id: 'Port crane 2', kind: 'crane', lat: 13.7005, lon: 100.578, clear: 1.6, yaw: 0.9 },
  { id: 'Port crane 3', kind: 'crane', lat: 13.6985, lon: 100.583, clear: 1.6, yaw: 0.9 },
];

const placed = LANDMARKS.map((l) => ({ ...project(l.lat, l.lon), clear: l.clear }));

/** True when (x, z) is inside a landmark's clearance. */
export function nearLandmark(x: number, z: number): boolean {
  return placed.some((p) => Math.hypot(x - p.x, z - p.z) < p.clear);
}
