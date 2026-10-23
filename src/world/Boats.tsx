import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RIVER_CURVE, riverHalfWidth } from './river';

interface BoatSpec {
  t: number;
  speed: number;
  side: number;
  kind: 'ferry' | 'barge';
}

const BOATS: BoatSpec[] = [
  { t: 0.3, speed: 0.0035, side: -0.4, kind: 'ferry' },
  { t: 0.42, speed: -0.0028, side: 0.35, kind: 'barge' },
  { t: 0.55, speed: 0.003, side: -0.3, kind: 'ferry' },
  { t: 0.66, speed: -0.0025, side: 0.4, kind: 'barge' },
  { t: 0.74, speed: 0.0032, side: -0.35, kind: 'ferry' },
];

/** A few boats drifting along the river: the city's slow ambient motion. */
export function Boats() {
  return (
    <group name="boats">
      {BOATS.map((b, i) => (
        <Boat key={i} spec={b} />
      ))}
    </group>
  );
}

function Boat({ spec }: { spec: BoatSpec }) {
  const g = useRef<THREE.Group>(null);
  const t = useRef(spec.t);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    t.current += spec.speed * dt;
    if (t.current > 0.9) t.current = 0.25;
    if (t.current < 0.25) t.current = 0.9;
    const p = RIVER_CURVE.getPointAt(t.current, tmp);
    const tan = RIVER_CURVE.getTangentAt(t.current);
    const w = riverHalfWidth(t.current);
    const nx = -tan.z;
    const nz = tan.x;
    if (g.current) {
      g.current.position.set(p.x + nx * 0.9 * spec.side, 0.03, p.z + nz * 0.9 * spec.side);
      g.current.rotation.y = Math.atan2(tan.x, tan.z) + (spec.speed < 0 ? Math.PI : 0);
    }
  });
  const ferry = spec.kind === 'ferry';
  return (
    <group ref={g} scale={0.14}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[ferry ? 1.1 : 1.4, 0.6, ferry ? 3.6 : 5.5]} />
        <meshStandardMaterial color={ferry ? '#f4f1ea' : '#4d5f73'} roughness={0.9} />
      </mesh>
      {ferry ? (
        <mesh position={[0, 0.85, -0.3]} castShadow>
          <boxGeometry args={[0.8, 0.5, 2.0]} />
          <meshStandardMaterial color="#1B8A9C" roughness={0.9} />
        </mesh>
      ) : (
        <>
          <mesh position={[0, 0.8, 0.4]} castShadow>
            <boxGeometry args={[1.2, 0.45, 3]} />
            <meshStandardMaterial color="#c9a37a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.0, -2]} castShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#f4f1ea" roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
}
