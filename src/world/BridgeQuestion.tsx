import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { DataShape, Label, type DataKind } from './DataShapes';
import { screenPoint } from './frame';
import { SHOTS, type Vec3 } from './shots';

/**
 * 0.4 · the question on the bridge: the problem. The answer exists, but in four separate places that do
 * not talk to each other: four panels with gaps between them, each its own system with its own data.
 * The inspector's question reaches towards each and stops short — the inspector has none of them.
 * Placed with the page's final (pushed-in) camera so the panels frame beside the crack.
 */
export const SILOS: { kind: DataKind; system: string; x0: number; x1: number; y0: number; y1: number }[] = [
  { kind: 'table', system: 'Asset register · table', x0: 0.0, x1: 0.46, y0: 0.06, y1: 0.64 },
  { kind: 'json', system: 'Spec documents · JSON', x0: 0.52, x1: 0.98, y0: 0.06, y1: 0.64 },
  { kind: 'graph', system: 'Network map · graph', x0: 0.0, x1: 0.46, y0: -0.64, y1: -0.06 },
  { kind: 'vectors', system: 'Inspection reports · vectors', x0: 0.52, x1: 0.98, y0: -0.64, y1: -0.06 },
];
// in open air between the camera and the bridge, so no deck or pier cuts through them
const DEPTH = 0.34;
/** shape size: fits its panel (a shape is ~2.7 units tall with its caption) */
const SHAPE_SCALE = 0.03;

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
};

export function BridgeQuestion() {
  const cam = SHOTS.pier3.push ?? SHOTS.pier3;
  const at = (x: number, y: number, d = DEPTH) => screenPoint(cam.position, cam.target, x, y, d);
  const ask: Vec3 = at(-0.3, 0.6);
  // one solid panel per system, slightly behind its shape
  const panels = useMemo(
    () =>
      SILOS.map((s) => {
        const d = DEPTH + 0.03;
        const c = [at(s.x0, s.y1, d), at(s.x1, s.y1, d), at(s.x1, s.y0, d), at(s.x0, s.y0, d)];
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(c.flat(), 3));
        g.setIndex([0, 3, 1, 1, 3, 2]);
        return g;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const panelMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  // the clock starts when the camera reaches the close-up (the move in from the city takes several seconds)
  const camera = useThree((st) => st.camera);
  const start = useRef<number | null>(null);
  const [, tick] = useState(0);
  const shapes = useRef<(THREE.Group | null)[]>([]);
  useEffect(() => void (start.current = null), []);
  useFrame(() => {
    if (start.current === null) {
      const there = camera.position.distanceTo(new THREE.Vector3(...cam.position)) < 0.04;
      if (there) start.current = performance.now() - 2900; // the question first, then the four places
    }
    const t = start.current === null ? 0 : performance.now() - start.current;
    shapes.current.forEach((g, i) => {
      if (g) g.scale.setScalar(Math.max(0.0001, SHAPE_SCALE * ease((t - 3300 - i * 300) / 600)));
    });
    panelMats.current.forEach((m, i) => {
      if (m) m.opacity = 0.93 * ease((t - 3200 - i * 300) / 500);
    });
    if (t < 7000) tick((n) => n + 1);
  });
  const t = start.current === null ? 0 : performance.now() - start.current;
  const askIn = ease((t - 2900) / 500);
  return (
    <group name="bridge-question">
      <Html position={ask} center zIndexRange={[25, 0]} style={{ pointerEvents: 'none' }}>
        <div className="q3d" style={{ opacity: askIn, transform: `translateY(${(1 - askIn) * 10}px)` }}>
          <div className="q3d__who">inspector · Harbor Bridge · Pier 3</div>
          <div className="q3d__text">“What do we know about this bridge, and what should I do?”</div>
        </div>
      </Html>
      {SILOS.map((s, i) => {
        const cx = (s.x0 + s.x1) / 2;
        const cy = (s.y0 + s.y1) / 2;
        const show = ease((t - 3300 - i * 300) / 600);
        // the question reaches towards each place and stops at a wall just short of the panels: no way in
        const stop: Vec3 = at(-0.05, [0.5, 0.2, -0.2, -0.5][i]);
        const reach = ease((t - 3900 - i * 300) / 700);
        const tip: Vec3 = [ask[0] + (stop[0] - ask[0]) * reach, ask[1] + (stop[1] - ask[1]) * reach, ask[2] + (stop[2] - ask[2]) * reach];
        return (
          <group key={s.kind}>
            <mesh geometry={panels[i]} renderOrder={5}>
              <meshBasicMaterial ref={(m) => (panelMats.current[i] = m)} color="#f7f5f1" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
            </mesh>
            <Line points={[ask, tip]} color="#9aa1aa" lineWidth={1.4} dashed dashSize={0.006} gapSize={0.004} transparent opacity={0.85 * show} />
            {reach > 0.98 && (
              <group position={stop} scale={0.03}>
                <Label text="✕" position={[0, 0, 0]} size={0.3} color="#e2604c" weight={700} />
              </group>
            )}
            <group position={at(cx, cy + 0.02)} ref={(g) => (shapes.current[i] = g)} scale={0.0001}>
              <DataShape kind={s.kind} lit caption={s.system} />
            </group>
          </group>
        );
      })}
    </group>
  );
}
