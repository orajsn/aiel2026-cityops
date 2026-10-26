import { useEffect, useState, type ReactNode } from 'react';

export const STAGE_W = 1920;
export const STAGE_H = 1080;

/** how much the stage is scaled to fit a window of this size (letterboxed) */
export const stageScale = (w: number, h: number) => Math.min(w / STAGE_W, h / STAGE_H);

/** the most canvas pixels per CSS pixel we ever draw, even on very sharp screens */
export const MAX_DPR = 1.5;

/**
 * The 3D canvas is laid out at 1920x1080 and then CSS-scaled, so its pixel ratio has to carry that scale:
 * it then draws exactly the device pixels the stage covers on this screen (1366x768 on a small laptop,
 * 1920x1080 on the projector), capped at MAX_DPR times the stage size.
 */
export const renderDpr = (w: number, h: number, deviceDpr: number) => Math.min(MAX_DPR, stageScale(w, h) * deviceDpr);

/** the stage scale for the current window, kept up to date on resize */
export function useStageScale(): number {
  const [scale, setScale] = useState(() => stageScale(window.innerWidth, window.innerHeight));
  useEffect(() => {
    const fit = () => setScale(stageScale(window.innerWidth, window.innerHeight));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return scale;
}

/** the canvas pixel ratio for the current window and screen (see renderDpr) */
export function useRenderDpr(): number {
  const scale = useStageScale();
  // devicePixelRatio changes with browser zoom and when the window moves to another screen; both fire resize
  return Math.min(MAX_DPR, scale * (window.devicePixelRatio || 1));
}

/**
 * A fixed 1920x1080 stage, scaled to fit the window and letterboxed, so every overlay,
 * font size and camera framing is designed once in projector pixels.
 */
export function Stage({ children }: { children: ReactNode }) {
  const scale = useStageScale();
  return (
    <div className="letterbox">
      <div
        id="stage"
        className="stage"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
