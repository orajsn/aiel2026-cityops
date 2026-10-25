import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useTrafficStore } from '../engine/traffic';
import type { TrafficKind } from '../content/traffic';
import { groundPoint, roadHeight } from './roadHeight';

const LIFT = 0.06;
const COLOUR: Record<TrafficKind, string> = { boats: '#2bb3c8', cars: '#f4f1ea' };
const PICKED = '#ffd166';
/** how close (CSS px) a tap must be to a drawn point to pick it rather than add a new one */
const REACH = 18;
/** what a tap must not land on to count as a tap on the map: controls, the toolbars and the pages' cards and panels */
export const SOLID = 'button, input, select, textarea, label, a, [role="toolbar"], [role="dialog"], .stepper, .strip, .script, .jd__panel, .jd__tab, [class*="panel"], [class*="card"], [class*="__q"], [class*="pill"]';

export interface ScreenPoint {
  route: number;
  index: number;
  sx: number;
  sy: number;
}

/** the drawn point nearest to (x, y) on screen, if it is within `reach` px */
export function nearestPoint(points: ScreenPoint[], x: number, y: number, reach: number): { route: number; index: number } | null {
  let best: ScreenPoint | null = null;
  let bd = reach;
  for (const p of points) {
    const d = Math.hypot(p.sx - x, p.sy - y);
    if (d <= bd) (bd = d), (best = p);
  }
  return best ? { route: best.route, index: best.index } : null;
}

/**
 * Traffic mode in the scene: every route as a line on the map, the points of the routes being edited (the picked one
 * in yellow), and the pointer: press near a point and drag to move it (a tap picks it), tap anywhere else on the map
 * to add a point. While a point is dragged the camera stays still; any other drag is Camera mode's look and move.
 */
export function TrafficDraw() {
  const editing = useTrafficStore((s) => s.editing);
  const config = useTrafficStore((s) => s.config);
  const kind = useTrafficStore((s) => s.kind);
  const route = useTrafficStore((s) => s.route);
  const point = useTrafficStore((s) => s.point);
  const { gl, camera } = useThree();

  useEffect(() => {
    if (!editing) return;
    const el = gl.domElement;
    const onMap = (t: EventTarget | null) => !(t instanceof Element) || !t.closest(SOLID);
    const rayAt = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      const ray = new THREE.Raycaster();
      ray.setFromCamera(ndc, camera);
      return ray.ray;
    };
    // the current kind's points on screen (CSS px), for picking
    const onScreen = (): ScreenPoint[] => {
      const r = el.getBoundingClientRect();
      const st = useTrafficStore.getState();
      const v = new THREE.Vector3();
      const out: ScreenPoint[] = [];
      st.config[st.kind].routes.forEach((rt, ri) =>
        rt.points.forEach(([x, z], pi) => {
          v.set(x, roadHeight(x, z) + LIFT, z).project(camera);
          if (v.z > 1) return; // behind the camera
          out.push({ route: ri, index: pi, sx: r.left + ((v.x + 1) / 2) * r.width, sy: r.top + ((1 - v.y) / 2) * r.height });
        }),
      );
      return out;
    };

    let down: { x: number; y: number; t: number; id: number } | null = null;
    let drag: { id: number; moved: boolean } | null = null;
    const pd = (e: PointerEvent) => {
      if (!onMap(e.target)) return;
      const hit = nearestPoint(onScreen(), e.clientX, e.clientY, REACH);
      if (hit) {
        // grab the point: Camera mode must not turn the view meanwhile
        useTrafficStore.getState().selectPoint(hit);
        drag = { id: e.pointerId, moved: false };
        e.stopPropagation();
        return;
      }
      down = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
    };
    const pm = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      e.stopPropagation();
      const p = groundPoint(rayAt(e));
      if (p) {
        useTrafficStore.getState().movePoint(p);
        drag.moved = true;
      }
    };
    const pu = (e: PointerEvent) => {
      if (drag && e.pointerId === drag.id) {
        drag = null;
        e.stopPropagation();
        return;
      }
      const d = down;
      down = null;
      if (!d || e.pointerId !== d.id || !onMap(e.target)) return;
      // a tap, not a drag: less than 8 px and half a second
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 || performance.now() - d.t > 500) return;
      const p = groundPoint(rayAt(e));
      if (p) useTrafficStore.getState().addPoint(p);
    };
    // capture phase: these run before Camera mode's own listeners, so a point drag can keep the view still
    window.addEventListener('pointerdown', pd, true);
    window.addEventListener('pointermove', pm, true);
    window.addEventListener('pointerup', pu, true);
    window.addEventListener('pointercancel', pu, true);
    return () => {
      window.removeEventListener('pointerdown', pd, true);
      window.removeEventListener('pointermove', pm, true);
      window.removeEventListener('pointerup', pu, true);
      window.removeEventListener('pointercancel', pu, true);
    };
  }, [editing, gl, camera]);

  const lines = useMemo(() => {
    const out: { key: string; kind: TrafficKind; ri: number; pts: [number, number, number][]; colour: string; active: boolean; current: boolean }[] = [];
    (['boats', 'cars'] as TrafficKind[]).forEach((k) =>
      config[k].routes.forEach((r, i) =>
        out.push({ key: `${k}${i}`, kind: k, ri: i, pts: r.points.map(([x, z]) => [x, roadHeight(x, z) + LIFT, z]), colour: COLOUR[k], active: k === kind && i === route, current: k === kind }),
      ),
    );
    return out;
  }, [config, kind, route]);

  if (!editing) return null;
  return (
    <group name="traffic-draw">
      {lines.map((l) =>
        l.pts.length >= 2 ? <Line key={l.key} points={l.pts} color={l.colour} lineWidth={l.active ? 4 : 2} transparent opacity={l.active ? 1 : l.current ? 0.7 : 0.4} depthTest={false} renderOrder={20} /> : null,
      )}
      {lines
        .filter((l) => l.current)
        .flatMap((l) =>
          l.pts.map((p, i) => {
            const picked = !!point && point.route === l.ri && point.index === i;
            return (
              <PointMarker key={`${l.key}-${i}`} at={p} size={picked ? 1.8 : l.active ? 1 : 0.7} colour={picked ? PICKED : COLOUR[kind]} />
            );
          }),
        )}
    </group>
  );
}

/** a drawn point: about the same size on screen however far the camera is, so it is easy to see and to tap */
function PointMarker({ at, size, colour }: { at: [number, number, number]; size: number; colour: string }) {
  const m = useRef<THREE.Mesh>(null);
  const v = useMemo(() => new THREE.Vector3(...at), [at]);
  useFrame(({ camera }) => {
    if (m.current) m.current.scale.setScalar(camera.position.distanceTo(v) * 0.009 * size);
  });
  return (
    <mesh ref={m} position={at} renderOrder={21}>
      <sphereGeometry args={[1, 12, 10]} />
      <meshBasicMaterial color={colour} depthTest={false} toneMapped={false} />
    </mesh>
  );
}
