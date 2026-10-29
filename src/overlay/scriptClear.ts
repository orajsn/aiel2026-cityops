import { useLayoutEffect, useState } from 'react';
import { useUiStore } from '../engine/ui';

/**
 * How far up from the stage's bottom edge a panel must stop to stay clear of the presenter script (stage pixels),
 * measured from the script itself, so a long script or a larger text size still never sits under a panel.
 * null when the script is off or this page has none: the panel may then run down to the corner buttons.
 */
export function useScriptClear(gap = 18): number | null {
  const scriptOpen = useUiStore((s) => s.scriptOpen);
  const [clear, setClear] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = scriptOpen ? document.querySelector<HTMLElement>('.script') : null;
    const box = el?.offsetParent as HTMLElement | null | undefined;
    if (!el || !box) {
      setClear(null);
      return;
    }
    const measure = () => setClear(box.clientHeight - el.offsetTop + gap);
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [scriptOpen, gap]);
  return clear;
}
