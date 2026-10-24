import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { DataShape, type DataKind } from './DataShapes';
import { screenPoint } from './frame';
import { SHOTS, type Vec3 } from './shots';

/**
 * 0.4 · the question on the bridge. The inspector's question floats over them; the four shapes the answer
 * lives in hang in the air beside the pier, each joined to the question by a dashed line — all in the same
 * 3D space as the bridge. Placed with the page's final (pushed-in) camera so they frame around the crack.
 */
const KINDS: { kind: DataKind; x: number; y: number }[] = [
  { kind: 'table', x: 0.3, y: 0.34 },
  { kind: 'json', x: 0.72, y: 0.34 },
  { kind: 'graph', x: 0.3, y: -0.3 },
  { kind: 'vectors', x: 0.72, y: -0.3 },
];
// in open air between the camera and the bridge, so no deck or pier cuts through them
const DEPTH = 0.34;
const SHAPE_SCALE = 0.037;

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
};

export function BridgeQuestion() {
  const cam = SHOTS.pier3.push ?? SHOTS.pier3;
  const at = (x: number, y: number) => screenPoint(cam.position, cam.target, x, y, DEPTH);
  const at2 = (x: number, y: number, d: number) => screenPoint(cam.position, cam.target, x, y, d);
  const ask: Vec3 = at(-0.2, 0.6);
  // a solid backing behind the four shapes, so the bridge does not show through their words
  const panel = useMemo(() => {
    const d = DEPTH + 0.03;
    const c = [at2(-0.06, 0.66, d), at2(0.98, 0.66, d), at2(0.98, -0.68, d), at2(-0.06, -0.68, d)];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(c.flat(), 3));
    g.setIndex([0, 3, 1, 1, 3, 2]);
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const panelMat = useRef<THREE.MeshBasicMaterial>(null);
  // the clock starts when the camera reaches the close-up (the move in from the city takes several seconds)
  const camera = useThree((st) => st.camera);
  const start = useRef<number | null>(null);
  const [, tick] = useState(0);
  const shapes = useRef<(THREE.Group | null)[]>([]);
  useEffect(() => void (start.current = null), []);
  useFrame(() => {
    if (start.current === null) {
      const there = camera.position.distanceTo(new THREE.Vector3(...cam.position)) < 0.04;
      if (there) start.current = performance.now() - 2900; // the question first, then the shapes
    }
    const t = start.current === null ? 0 : performance.now() - start.current;
    shapes.current.forEach((g, i) => {
      // after the inspector reaches the crack and the camera has pushed in (~3 s), one shape at a time
      if (g) g.scale.setScalar(Math.max(0.0001, SHAPE_SCALE * ease((t - 3300 - i * 300) / 600)));
    });
    if (panelMat.current) panelMat.current.opacity = 0.9 * ease((t - 3200) / 600);
    if (t < 6000) tick((n) => n + 1);
  });
  const t = start.current === null ? 0 : performance.now() - start.current;
  const askIn = ease((t - 2900) / 500);
  return (
    <group name="bridge-question">
      <mesh geometry={panel} renderOrder={5}>
        <meshBasicMaterial ref={panelMat} color="#f7f5f1" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <Html position={ask} center zIndexRange={[25, 0]} style={{ pointerEvents: 'none' }}>
        <div className="q3d" style={{ opacity: askIn, transform: `translateY(${(1 - askIn) * 10}px)` }}>
          <div className="q3d__who">inspector · Harbor Bridge · Pier 3</div>
          <div className="q3d__text">“What do we know about this bridge, and what should I do?”</div>
        </div>
      </Html>
      {KINDS.map((k, i) => {
        const p = at(k.x, k.y);
        const show = ease((t - 3300 - i * 300) / 600);
        return (
          <group key={k.kind}>
            <Line points={[ask, p]} color="#1B8A9C" lineWidth={1.4} dashed dashSize={0.007} gapSize={0.005} transparent opacity={0.8 * show} />
            <group position={p} ref={(g) => (shapes.current[i] = g)} scale={0.0001}>
              <DataShape kind={k.kind} lit />
            </group>
          </group>
        );
      })}
    </group>
  );
}
