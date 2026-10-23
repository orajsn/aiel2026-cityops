/**
 * Every colour and light level the world uses, in one place, so the look can switch
 * between the light Redwood illustration style and the dark night style with the T key.
 */
export type ThemeName = 'light' | 'night';

export interface Theme {
  name: ThemeName;
  bg: string;
  fogDensity: number;
  ground: string;
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
    bg: '#EEF2F4',
    fogDensity: 0.0011,
    ground: '#E3E7E3',
    grid: false,
    waterBase: '#9CC5D4',
    waterGlow: '#C9E6EE',
    buildingTint: '#ffffff',
    buildingEdges: false,
    ambient: 0.55,
    hemiSky: '#ffffff',
    hemiGround: '#b9c4c9',
    hemi: 0.7,
    sun: '#fff4e0',
    sunIntensity: 1.6,
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
    fogDensity: 0.0024,
    ground: '#0c1119',
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
