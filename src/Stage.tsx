import { useEffect, useState, type ReactNode } from 'react';

export const STAGE_W = 1920;
export const STAGE_H = 1080;

/**
 * A fixed 1920x1080 stage, scaled to fit the window and letterboxed, so every overlay,
 * font size and camera framing is designed once in projector pixels.
 */
export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
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
