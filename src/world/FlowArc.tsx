import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { arcCurve } from './arc';
import type { Vec3 } from './shots';

export interface FlowArcProps {
  from: Vec3;
  to: Vec3;
  color?: string;
  lift?: number;
  radius?: number;
  /** Travel time for the light along the arc. */
  durationMs?: number;
  /** Fade time after landing. */
  fadeMs?: number;
  /** Delay before the arc starts. */
  delayMs?: number;
  /** Keep the arc drawn after landing (no fade). */
  persist?: boolean;
  onDone?: () => void;
}

const SEG = 64;

/**
 * A light that travels along an arc, drawing the tube behind it (setDrawRange),
 * then lands with a dot and a ring that expands and fades.
 */
export function FlowArc({
  from,
  to,
  color = '#1B8A9C',
  lift = 30,
  radius = 0.6,
  durationMs = 1400,
  fadeMs = 700,
  delayMs = 0,
  persist = false,
  onDone,
}: FlowArcProps) {
  const curve = useMemo(() => arcCurve(from, to, lift), [from, to, lift]);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, SEG, radius, 5, false), [curve, radius]);
  const indexCount = tube.index ? tube.index.count : 0;
  const col = useMemo(() => new THREE.Color(color), [color]);

  const tubeMat = useRef<THREE.MeshBasicMaterial>(null);
  const head = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const start = useRef(performance.now() + delayMs);
  const done = useRef(false);

  useFrame(() => {
    const now = performance.now();
    const t = (now - start.current) / durationMs;
    const p = Math.max(0, Math.min(1, t));
    // ease-out so the light slows as it lands
    const e = 1 - Math.pow(1 - p, 2.2);
    tube.setDrawRange(0, Math.floor(indexCount * e));
    if (head.current) {
      const pos = curve.getPointAt(e);
      head.current.position.copy(pos);
      head.current.visible = p > 0 && p < 1;
    }
    const landed = t >= 1;
    const after = landed ? (now - start.current - durationMs) / fadeMs : 0;
    if (ring.current && ringMat.current) {
      ring.current.visible = landed && after < 1;
      const k = Math.min(1, after);
      const s = 1 + 2 * k;
      ring.current.scale.set(s, s, 1);
      ringMat.current.opacity = (1 - k) * 0.8;
    }
    if (tubeMat.current && !persist) tubeMat.current.opacity = landed ? Math.max(0, 0.75 * (1 - after)) : 0.75;
    if (landed && after >= 1 && !done.current) {
      done.current = true;
      onDone?.();
    }
  });

  return (
    <group name="flow-arc">
      <mesh geometry={tube}>
        <meshBasicMaterial ref={tubeMat} color={col} transparent opacity={0.75} depthWrite={false} />
      </mesh>
      <mesh ref={head} visible={false}>
        <sphereGeometry args={[radius * 2.2, 10, 10]} />
        <meshBasicMaterial color={col.clone().multiplyScalar(1.6)} toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={[to[0], to[1] + 0.2, to[2]]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.22, 0.3, 40]} />
        <meshBasicMaterial ref={ringMat} color={col} transparent opacity={0.8} depthWrite={false} />
      </mesh>
    </group>
  );
}
