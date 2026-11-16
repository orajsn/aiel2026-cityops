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

/** Senayan keeps edge smoothing at each resolution; DPR changes resize the renderer. */
export function antialiasFor(_resolution?: Resolution, _custom?: Size): boolean { return true; }

/** the frame rate the 3D view keeps, measured by FrameMeter (World.tsx), read by the readout */
export const FRAME = { fps: 0 };

const KEY = 'cityops.jakarta.v4.resolution';

function stored(): { resolution: Resolution; custom: Size } {
  const fallback = { resolution: 'auto' as Resolution, custom: { ...PRESETS['2k'] } };
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

export interface ActualBuffer extends Size { antialias: boolean }

export interface GraphicsState {
  actualBuffer: ActualBuffer | null;
  setActualBuffer(size: ActualBuffer): void;
  resolution: Resolution;
  custom: Size;
  /** a small frame rate readout in the corner, to see what a setting costs on this machine */
  showFps: boolean;
  setShowFps(on: boolean): void;
  /** how big the text on screen is: the page panels, the caption and the Jupyter drawer's code and notes (1 = as designed) */
  textSize: number;
  /** which bridge model stands at the crossing: Harbor Bridge, or the Bhumibol Bridge model on preview (owner, 28 Oct) */
  bridge: 'harbor' | 'bhumibol';
  setBridge(b: 'harbor' | 'bhumibol'): void;
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

/** Settings › Text size (owner, 28 Oct): readable from the back of the room, any size from 75% to 150% */
export const TEXT_MIN = 0.75;
export const TEXT_MAX = 1.5;

/** a text size in range, to the nearest percent (a typed 200 becomes 150%, a typed 50 becomes 75%) */
export const clampTextSize = (k: number) => (Number.isFinite(k) ? Math.round(Math.min(TEXT_MAX, Math.max(TEXT_MIN, k)) * 100) / 100 : 1);

function storedTextSize(): number {
  try {
    const v = localStorage.getItem('cityops.textSize');
    return v === null ? 1 : clampTextSize(Number(v));
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

function storedBridge(): 'harbor' | 'bhumibol' {
  try {
    return localStorage.getItem('cityops.bridge') === 'bhumibol' ? 'bhumibol' : 'harbor';
  } catch {
    return 'harbor';
  }
}

export const useGraphicsStore = create<GraphicsState>((set, get) => ({
  ...stored(),
  actualBuffer: null,
  setActualBuffer: actualBuffer => set({ actualBuffer }),
  bridge: storedBridge(),
  setBridge: (bridge) => {
    try {
      localStorage.setItem('cityops.bridge', bridge);
    } catch {
      /* per-viewer convenience only */
    }
    set({ bridge });
  },
  textSize: storedTextSize(),
  setTextSize: (k) => {
    const textSize = clampTextSize(k);
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

/** Kept for callers that inspect the renderer's startup AA configuration. */
export const LOADED_AA = (() => {
  const { resolution, custom } = useGraphicsStore.getState();
  return antialiasFor(resolution, custom);
})();

applyTextSize(useGraphicsStore.getState().textSize);
