import { useEffect, useState, type ComponentProps } from 'react';
import { Html } from '@react-three/drei';

/**
 * drei's Html puts its element at the top left of the screen until the first frame has placed it, which showed as a flash of
 * the label in the corner when a page changed (owner, 3 Nov). This holds it invisible for two frames after it mounts.
 */
export function useReady(frames = 2): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let n = 0;
    let id = 0;
    const tick = () => {
      if (++n >= frames) setReady(true);
      else id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [frames]);
  return ready;
}

export function ReadyHtml(props: ComponentProps<typeof Html>) {
  const ready = useReady();
  const style = (props.style ?? {}) as React.CSSProperties;
  return <Html {...props} style={{ ...style, opacity: ready ? (style.opacity ?? 1) : 0 }} />;
}
