import { create } from 'zustand';
import { STAGE_H, STAGE_W } from '../Stage';

/**
 * How many pixels the 3D view draws (owner, 27 Oct). Auto draws what the screen shows (Stage.tsx, renderDpr);
 * the presets draw exactly their size, whatever the window, and the browser scales the picture to fit. The
 * event screen is 3840 x 2160 inside its side banners, so 4K is the show setting there. Always 16:9: the
 * stage is. Remembered on this device only.
 */
export type Resolution = 'auto' | 'fhd' | '2k' | '4k' | 'custom';
export interface Size {
  w: number;
  h: number;
}

export const PRESETS: Record<'fhd' | '2k' | '4k', Size> = {
  fhd: { w: 1920, h: 1080 },
  '2k': { w: 2560, h: 1440 },
  '4k': { w: 3840, h: 2160 },
};
/** custom sizes stay between 640 x 360 and 8K wide */
const MIN_W = 640;
const MAX_W = 7680;

/** the canvas pixel ratio for a fixed resolution (the canvas is laid out at 1920x1080), or null for Auto */
export function fixedDpr(resolution: Resolution, custom: Size): number | null {
  if (resolution === 'auto') return null;
  const s = resolution === 'custom' ? custom : PRESETS[resolution];
  // a size that is not 16:9 fits inside it
  const k = Math.min(s.w / STAGE_W, s.h / STAGE_H) || 1;
  return Math.min(MAX_W / STAGE_W, Math.max(MIN_W / STAGE_W, k));
}

/** the pixels the 3D view draws at this pixel ratio */
export const drawSize = (dpr: number): Size => ({ w: Math.round(STAGE_W * dpr), h: Math.round(STAGE_H * dpr) });

const KEY = 'cityops.resolution';

function stored(): { resolution: Resolution; custom: Size } {
  const fallback = { resolution: 'auto' as Resolution, custom: { ...PRESETS['4k'] } };
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (v && ['auto', 'fhd', '2k', '4k', 'custom'].includes(v.resolution)) return { resolution: v.resolution, custom: v.custom ?? fallback.custom };
  } catch {
    /* storage blocked or unreadable: Auto */
  }
  return fallback;
}

function store(v: { resolution: Resolution; custom?: Size }) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* per-viewer convenience only */
  }
}

export interface GraphicsState {
  resolution: Resolution;
  custom: Size;
  setResolution(r: Resolution): void;
  /** sets the custom size and switches to it */
  setCustom(s: Size): void;
}

export const useGraphicsStore = create<GraphicsState>((set, get) => ({
  ...stored(),
  setResolution: (resolution) => {
    set({ resolution });
    store({ resolution, ...(resolution === 'custom' ? { custom: get().custom } : {}) });
  },
  setCustom: (custom) => {
    set({ resolution: 'custom', custom });
    store({ resolution: 'custom', custom });
  },
}));
