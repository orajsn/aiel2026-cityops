import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useTrafficStore } from '../engine/traffic';
import type { TrafficKind } from '../content/traffic';
import { terrainHeight } from './terrain';

const LIFT = 0.06;
/** what a tap must not land on to count as a tap on the map: controls, the toolbars and the pages' cards and panels */
export const SOLID = 'button, input, select, textarea, label, a, [role="toolbar"], [role="dialog"], .stepper, .strip, .script, .jd__panel, .jd__tab, [class*="panel"], [class*="card"], [class*="__q"], [class*="pill"]';
const COLOUR: Record<TrafficKind, string> = { boats: '#2bb3c8', cars: '#f4f1ea' };

/** where a click lands on the map: the ray meets the ground (refined twice on the terrain's height) */
export function groundPoint(ray: THREE.Ray): [number, number] | null {
  let h = 0;
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  for (let i = 0; i < 3; i++) {
    plane.constant = -h;
    if (!ray.intersectPlane(plane, hit)) return null;
    h = terrainHeight(hit.x, hit.z);
  }
  return [hit.x, hit.z];
}

/**
 * Traffic mode in the scene: every route as a line on the map (the one being drawn brighter, with its points),
 * and a tap or click on the map adds a point to it. A drag is left to Camera mode's look and move.
 */
export function TrafficDraw() {
  const editing = useTrafficStore((s) => s.editing);
  const config = useTrafficStore((s) => s.config);
  const kind = useTrafficStore((s) => s.kind);
  const route = useTrafficStore((s) => s.route);
  const { gl, camera } = useThree();

  useEffect(() => {
    if (!editing) return;
    const el = gl.domElement;
    let down: { x: number; y: number; t: number; id: number } | null = null;
    // the page's overlay layers cover the canvas (and take pointer events), so a tap counts as a map tap unless
    // it lands on a real control or panel
    const onMap = (t: EventTarget | null) => !(t instanceof Element) || !t.closest(SOLID);
    const pd = (e: PointerEvent) => {
      if (!onMap(e.target)) return;
      down = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
    };
    const pu = (e: PointerEvent) => {
      const d = down;
      down = null;
      if (!d || e.pointerId !== d.id || !onMap(e.target)) return;
      // a tap, not a drag: less than 8 px and half a second
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 || performance.now() - d.t > 500) return;
      // the stage is CSS-scaled: map the click through the canvas's on-screen rect
      const r = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      const ray = new THREE.Raycaster();
      ray.setFromCamera(ndc, camera);
      const p = groundPoint(ray.ray);
      if (p) useTrafficStore.getState().addPoint(p);
    };
    window.addEventListener('pointerdown', pd);
    window.addEventListener('pointerup', pu);
    return () => {
      window.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointerup', pu);
    };
  }, [editing, gl, camera]);

  const lines = useMemo(() => {
    const out: { key: string; pts: [number, number, number][]; colour: string; active: boolean }[] = [];
    (['boats', 'cars'] as TrafficKind[]).forEach((k) =>
      config[k].routes.forEach((r, i) =>
        out.push({ key: `${k}${i}`, pts: r.points.map(([x, z]) => [x, terrainHeight(x, z) + LIFT, z]), colour: COLOUR[k], active: k === kind && i === route }),
      ),
    );
    return out;
  }, [config, kind, route]);

  if (!editing) return null;
  return (
    <group name="traffic-draw">
      {lines.map((l) =>
        l.pts.length >= 2 ? <Line key={l.key} points={l.pts} color={l.colour} lineWidth={l.active ? 4 : 2} transparent opacity={l.active ? 1 : 0.55} depthTest={false} renderOrder={20} /> : null,
      )}
      {lines
        .filter((l) => l.active)
        .flatMap((l) => l.pts)
        .map((p, i) => (
          <mesh key={i} position={p} renderOrder={21}>
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshBasicMaterial color={COLOUR[kind]} depthTest={false} toneMapped={false} />
          </mesh>
        ))}
    </group>
  );
}
