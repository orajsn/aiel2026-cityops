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

/**
 * Anti-aliasing (MSAA) draws every pixel about four times over. From 2K up the pixels are too small for jagged
 * edges to show, and at 4K it multiplies the heaviest part of a frame (owner, 28 Oct: 4K felt laggy), so it goes off.
 */
export function antialiasFor(resolution: Resolution, custom: Size): boolean {
  const dpr = fixedDpr(resolution, custom);
  return dpr === null || drawSize(dpr).w < 2560;
}

/** the frame rate the 3D view keeps, measured by FrameMeter (World.tsx), read by the readout */
export const FRAME = { fps: 0 };

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
  /** a small frame rate readout in the corner, to see what a setting costs on this machine */
  showFps: boolean;
  setShowFps(on: boolean): void;
  /** how big the text on screen is: the page panels, the caption and the Jupyter drawer's code and notes (1 = as designed) */
  textSize: number;
  setTextSize(k: number): void;
  setResolution(r: Resolution): void;
  /** sets the custom size and switches to it */
  setCustom(s: Size): void;
}

function storedFps(): boolean {
  try {
    return localStorage.getItem('cityops.fps') === 'on';
  } catch {
    return false;
  }
}

/** Settings › Text size (owner, 28 Oct): readable from the back of the room */
export const TEXT_SIZES = [0.9, 1, 1.1, 1.2, 1.3];

function storedTextSize(): number {
  try {
    const v = Number(localStorage.getItem('cityops.textSize'));
    return TEXT_SIZES.includes(v) ? v : 1;
  } catch {
    return 1;
  }
}

/** the CSS reads the text size from --text-zoom (styles.css: panels, caption, Jupyter drawer) */
function applyTextSize(k: number) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--text-zoom', String(k));
  // the page panels are laid out tight for 1080 px: they grow up to 115% and stay on the screen
  document.documentElement.style.setProperty('--panel-zoom', String(Math.min(k, 1.15)));
}

export const useGraphicsStore = create<GraphicsState>((set, get) => ({
  ...stored(),
  textSize: storedTextSize(),
  setTextSize: (textSize) => {
    try {
      localStorage.setItem('cityops.textSize', String(textSize));
    } catch {
      /* per-viewer convenience only */
    }
    applyTextSize(textSize);
    set({ textSize });
  },
  showFps: storedFps(),
  setShowFps: (showFps) => {
    try {
      localStorage.setItem('cityops.fps', showFps ? 'on' : 'off');
    } catch {
      /* per-viewer convenience only */
    }
    set({ showFps });
  },
  setResolution: (resolution) => {
    set({ resolution });
    store({ resolution, ...(resolution === 'custom' ? { custom: get().custom } : {}) });
  },
  setCustom: (custom) => {
    set({ resolution: 'custom', custom });
    store({ resolution: 'custom', custom });
  },
}));

/**
 * Anti-aliasing is fixed when the canvas is made, so it follows the resolution this page loaded with. Making a
 * new canvas to change it throws the old WebGL context away, and Chrome then refuses a new one (seen on the VM,
 * 28 Oct): the change waits for a reload instead (Settings says so).
 */
export const LOADED_AA = (() => {
  const { resolution, custom } = useGraphicsStore.getState();
  return antialiasFor(resolution, custom);
})();

applyTextSize(useGraphicsStore.getState().textSize);
