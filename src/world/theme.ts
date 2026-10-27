/**
 * Every colour and light level the world uses, in one place, so the look can switch
 * between the skies in Settings (or the T key): the warm afternoon of the light Redwood illustration style,
 * a clear blue midday sky, and the dark night style.
 */
export type ThemeName = 'light' | 'clear' | 'night' | 'time';

/** the order the T key goes through, and the names Settings shows */
export const SKIES: { id: ThemeName; label: string }[] = [
  { id: 'light', label: 'Afternoon' },
  { id: 'clear', label: 'Clear blue' },
  { id: 'night', label: 'Night' },
  // the sky follows the show from morning to evening (timeOfDay.ts)
  { id: 'time', label: 'Time of day' },
];

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

const BASE: Record<Exclude<ThemeName, 'time'>, Theme> = {
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
  // owner, 25 Oct: a clear blue sky as an option; the overlays keep the light panels
  clear: {
    name: 'clear',
    bg: '#CFE2F0',
    skyTop: '#6FA8DC',
    skyHorizon: '#D4E6F3',
    fogDensity: 0.0032,
    ground: '#E4E2DA',
    slabEdge: '#CFCBC0',
    base: '#E6E6E2',
    grid: false,
    waterBase: '#4F95C2',
    waterGlow: '#D8ECF8',
    buildingTint: '#FFFFFF',
    buildingEdges: false,
    ambient: 0.5,
    hemiSky: '#CFE4FF',
    hemiGround: '#B3AFA8',
    hemi: 0.8,
    sun: '#FFF6E8',
    sunIntensity: 2.2,
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

/**
 * Time of day: the Afternoon look, which TimeOfDay.tsx then moves through the day every frame. Its swatch in
 * Settings runs from the morning sky down to the evening horizon.
 */
export const THEMES: Record<ThemeName, Theme> = { ...BASE, time: { ...BASE.light, name: 'time', skyTop: '#7DB3E0', skyHorizon: '#F2AC6E' } };

const KEY = 'cityops.theme';

export function storedTheme(): ThemeName {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'night' || v === 'clear' || v === 'time' ? v : 'light';
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
  document.documentElement.setAttribute('data-theme', t === 'night' ? 'night' : 'light');
}
