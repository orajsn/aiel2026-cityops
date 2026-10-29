import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * A page's content inside the panel body (WidePanel, SidePanel): it takes all the height that is left and lays its
 * children out in a column, so they can share it out with flex (owner, 29 Oct: "not just white space, spread the
 * content"). With a large text size the content can be taller than the panel: then it scrolls, it is never clipped.
 */
export function Fill({ children, gap = 0, justify = 'flex-start', style, ...rest }: { children: ReactNode; gap?: number; justify?: CSSProperties['justifyContent']; style?: CSSProperties; [k: `data-${string}`]: string | undefined }) {
  return (
    <div data-fill {...rest} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap, justifyContent: justify, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'thin', pointerEvents: 'auto', ...style }}>
      {children}
    </div>
  );
}

/**
 * A drawing laid out at a fixed size (absolute positions, SVG paths): it is scaled to the space it is given, centred,
 * as large as fits (never past `max`). Used for the few pictures whose parts are placed by coordinates.
 */
export function FitBox({ w, h, max = 1.25, children, style }: { w: number; h: number; max?: number; children: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const fit = () => {
      // clientWidth/Height are in the panel's own (unzoomed) pixels, as w and h are
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (cw > 0 && ch > 0) setK(Math.min(max, cw / w, ch / h));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, max]);
  return (
    <div ref={ref} data-fitbox style={{ flex: '1 1 0', minHeight: Math.round(h * 0.6), position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <div style={{ width: w * k, height: h * k, flex: 'none', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0' }}>{children}</div>
      </div>
    </div>
  );
}
