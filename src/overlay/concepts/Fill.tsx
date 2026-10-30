import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';

/**
 * A page's content inside the panel body (WidePanel, SidePanel): it takes all the height that is left and lays its
 * children out in a column, so they can share it out with flex (owner, 29 Oct: "not just white space, spread the
 * content"). With a large text size the content can be taller than the panel: then it is scaled down to fit, it never scrolls.
 */
/**
 * Nothing on a page scrolls or is cut off (owner, 30 Oct): content taller than its box is scaled down until it fits.
 * `outer` is the clipping box, `inner` the content inside it (height and width 100%).
 */
export function useFitZoom(outer: RefObject<HTMLElement>, inner: RefObject<HTMLElement>, dep: unknown) {
  useLayoutEffect(() => {
    const o = outer.current;
    const w = inner.current;
    if (!o || !w) return;
    const fit = () => {
      w.style.zoom = '1';
      const have = o.clientHeight;
      if (have <= 0) return;
      let z = 1;
      // the content's natural height at this scale; narrower text wraps less when scaled down, so go round a few times
      for (let n = 0; n < 4; n++) {
        const need = w.scrollHeight * z;
        if (need <= have + 1) break;
        z = Math.max(0.55, z * (have / need));
        w.style.zoom = String(z);
      }
    };
    fit();
    const ts = [200, 600, 1500, 3000, 5000, 8000].map((ms) => setTimeout(fit, ms));
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    ro?.observe(o);
    return () => (ts.forEach(clearTimeout), ro?.disconnect());
  }, [dep]);
}

export function Fill({ children, gap = 0, justify = 'flex-start', style, ...rest }: { children: ReactNode; gap?: number; justify?: CSSProperties['justifyContent']; style?: CSSProperties; [k: `data-${string}`]: string | undefined }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useFitZoom(outer, inner, children);
  return (
    <div ref={outer} data-fill {...rest} style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', pointerEvents: 'auto', ...style }}>
      <div ref={inner} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap, justifyContent: justify }}>
        {children}
      </div>
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
