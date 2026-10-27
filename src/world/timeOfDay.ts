import * as THREE from 'three';
import { THEMES } from './theme';
import { SUN_POS } from './Lighting';

/**
 * Time of day (owner, 27 Oct; Settings › Sky › Time of day): the show runs from a clear morning on its first page,
 * through the afternoon look in the middle, to a golden evening on its last page. Time follows the page, not
 * the clock, so every rehearsal looks the same. The sun crosses from the east to low in the west, so the live
 * shadows turn and lengthen. The evening glow stays amber, never Oracle Red: red is for the one alert.
 */
export interface SkyStop {
  bg: string;
  skyTop: string;
  skyHorizon: string;
  fogDensity: number;
  ambient: number;
  hemiSky: string;
  hemiGround: string;
  hemi: number;
  sun: string;
  sunIntensity: number;
  /** where the sun light sits (the city looks roughly north, so +x is east) */
  sunPos: [number, number, number];
}

export const MORNING: SkyStop = {
  bg: '#D6E6F2',
  skyTop: '#7DB3E0',
  skyHorizon: '#E3EEF5',
  fogDensity: 0.003,
  ambient: 0.5,
  hemiSky: '#D6E8FF',
  hemiGround: '#B3AFA8',
  hemi: 0.8,
  sun: '#F4F8FF',
  sunIntensity: 2.0,
  sunPos: [200, 75, 90],
};

/** the afternoon is the Afternoon sky, with its sun where Lighting.tsx puts it */
const l = THEMES.light;
export const AFTERNOON: SkyStop = {
  bg: l.bg,
  skyTop: l.skyTop,
  skyHorizon: l.skyHorizon,
  fogDensity: l.fogDensity,
  ambient: l.ambient,
  hemiSky: l.hemiSky,
  hemiGround: l.hemiGround,
  hemi: l.hemi,
  sun: l.sun,
  sunIntensity: l.sunIntensity,
  sunPos: SUN_POS,
};

export const EVENING: SkyStop = {
  bg: '#EDB78C',
  skyTop: '#8EA3C2',
  skyHorizon: '#F2AC6E',
  fogDensity: 0.0042,
  ambient: 0.36,
  hemiSky: '#FFCB9C',
  hemiGround: '#8E8076',
  hemi: 0.7,
  sun: '#FFA552',
  sunIntensity: 2.1,
  sunPos: [-230, 38, 70],
};

/** where in the day a page sits: 0 on the first page, 1 on the last */
export const showTime = (index: number, total: number) => (total > 1 ? Math.min(1, Math.max(0, index / (total - 1))) : 0);

export interface Sky {
  bg: THREE.Color;
  skyTop: THREE.Color;
  skyHorizon: THREE.Color;
  fogDensity: number;
  ambient: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemi: number;
  sun: THREE.Color;
  sunIntensity: number;
  sunPos: THREE.Vector3;
}

const COLOURS = ['bg', 'skyTop', 'skyHorizon', 'hemiSky', 'hemiGround', 'sun'] as const;
const NUMBERS = ['fogDensity', 'ambient', 'hemi', 'sunIntensity'] as const;

/** a fresh Sky to blend into (one per caller, reused every frame) */
export function newSky(): Sky {
  return {
    bg: new THREE.Color(),
    skyTop: new THREE.Color(),
    skyHorizon: new THREE.Color(),
    fogDensity: 0,
    ambient: 0,
    hemiSky: new THREE.Color(),
    hemiGround: new THREE.Color(),
    hemi: 0,
    sun: new THREE.Color(),
    sunIntensity: 0,
    sunPos: new THREE.Vector3(),
  };
}

const ca = new THREE.Color();
const cb = new THREE.Color();

/** the sky at time t (0 morning, 0.5 afternoon, 1 evening), written into `out` */
export function skyAt(t: number, out: Sky = newSky()): Sky {
  const k = Math.min(1, Math.max(0, t));
  const [a, b, f] = k <= 0.5 ? [MORNING, AFTERNOON, k / 0.5] : [AFTERNOON, EVENING, (k - 0.5) / 0.5];
  // ease each half, so the look lingers near morning, afternoon and evening
  const e = f * f * (3 - 2 * f);
  for (const key of COLOURS) out[key].copy(ca.set(a[key])).lerp(cb.set(b[key]), e);
  for (const key of NUMBERS) out[key] = a[key] + (b[key] - a[key]) * e;
  out.sunPos.set(...a.sunPos).lerp(new THREE.Vector3(...b.sunPos), e);
  return out;
}
