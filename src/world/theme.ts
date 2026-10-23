/**
 * Every colour and light level the world uses, in one place, so the look can switch
 * between the light Redwood illustration style and the dark night style with the T key.
 */
export type ThemeName = 'light' | 'night';

export interface Theme {
  name: ThemeName;
  bg: string;
  skyTop: string;
  skyHorizon: string;
  fogDensity: number;
  ground: string;
  /** side faces of the city slab */
  slabEdge: string;
  /** the base the database and the four shapes stand on */
  base: string;
  grid: boolean;
  waterBase: string;
  waterGlow: string;
  /** tint multiplied onto the kit building colours */
  buildingTint: string;
  buildingEdges: boolean;
  ambient: number;
  hemiSky: string;
  hemiGround: string;
  hemi: number;
  sun: string;
  sunIntensity: number;
  shadows: boolean;
  bloom: boolean;
  toneMapped: boolean;
  pin: string;
  pinHero: string;
  data: string;
  red: string;
  coreBody: string;
}

export const THEMES: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    bg: '#F2DCC8',
    skyTop: '#D9E2EA',
    skyHorizon: '#F2DCC8',
    fogDensity: 0.0036,
    ground: '#E9E1D2',
    slabEdge: '#D8CDBB',
    base: '#E9E3D6',
    grid: false,
    waterBase: '#86B4CC',
    waterGlow: '#EBD6BE',
    buildingTint: '#FFF0DF',
    buildingEdges: false,
    ambient: 0.45,
    hemiSky: '#FFE6CC',
    hemiGround: '#B8AFA6',
    hemi: 0.75,
    sun: '#FFD2A0',
    sunIntensity: 2.0,
    shadows: true,
    bloom: false,
    toneMapped: false,
    pin: '#1B8A9C',
    pinHero: '#C74634',
    data: '#1B8A9C',
    red: '#C74634',
    coreBody: '#C74634',
  },
  night: {
    name: 'night',
    bg: '#0B0E14',
    skyTop: '#0B0E14',
    skyHorizon: '#141b27',
    fogDensity: 0.005,
    ground: '#0c1119',
    slabEdge: '#141b27',
    base: '#182230',
    grid: true,
    waterBase: '#07161d',
    waterGlow: '#1B8A9C',
    buildingTint: '#3c4a5c',
    buildingEdges: true,
    ambient: 0.15,
    hemiSky: '#22303f',
    hemiGround: '#0B0E14',
    hemi: 0.5,
    sun: '#cfe0f5',
    sunIntensity: 0.9,
    shadows: false,
    bloom: true,
    toneMapped: true,
    pin: '#1B8A9C',
    pinHero: '#C74634',
    data: '#1B8A9C',
    red: '#C74634',
    coreBody: '#0c2f38',
  },
};

const KEY = 'cityops.theme';

export function storedTheme(): ThemeName {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'night' ? 'night' : 'light';
  } catch {
    return 'light';
  }
}

export function storeTheme(t: ThemeName): void {
  try {
    window.localStorage.setItem(KEY, t);
  } catch {
    /* storage blocked */
  }
}

/** Mirror the theme onto the document so the CSS overlays follow. */
export function applyThemeToDocument(t: ThemeName): void {
  document.documentElement.setAttribute('data-theme', t);
}
