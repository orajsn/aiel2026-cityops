import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { applyWalls, layoutCloud, layoutDocuments, nearestK } from './vectorLayout';
import type { Vec3 } from './shots';
import { easeInOut } from './shots';

export interface VectorFieldProps {
  n?: number;
  seed?: number;
  phase: 'documents' | 'embedded';
  query?: Vec3;
  k?: number;
  walls?: Record<string, string>;
  tags?: Record<string, string>[];
  position?: Vec3;
  /** Where the document stack sits relative to the cloud centre. */
  documentsOffset?: Vec3;
  tweenMs?: number;
}

const TEAL = new THREE.Color('#1B8A9C');
const DIM = new THREE.Color('#1a2a33');
const RED = new THREE.Color('#C74634');
const PAPER = new THREE.Color('#9fb3bf');

/**
 * 600 narratives as points. `documents` is a stacked grid; `embedded` is the star field.
 * The change of phase tweens every point over `tweenMs` with a small stagger.
 * The nearest `k` to `query` glow red with lines to the query point; `walls` dim the rest.
 */
export function VectorField({
  n = 600,
  seed = 7,
  phase,
  query,
  k = 5,
  walls,
  tags,
  position = [0, 0, 0],
  documentsOffset = [0, 0, 0],
  tweenMs = 1500,
}: VectorFieldProps) {
  const cloud = useMemo(() => layoutCloud(n, seed), [n, seed]);
  const docs = useMemo(
    () => layoutDocuments(n).map((p) => [p[0] + documentsOffset[0], p[1] + documentsOffset[1], p[2] + documentsOffset[2]] as Vec3),
    [n, documentsOffset],
  );
  const near = useMemo(() => (query && phase === 'embedded' ? new Set(nearestK(cloud, query, k)) : new Set<number>()), [cloud, query, k, phase]);
  const pass = useMemo(() => (walls && tags ? applyWalls(cloud, tags, walls) : null), [cloud, walls, tags]);

  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const from = useRef<'documents' | 'embedded'>(phase);
  const to = useRef<'documents' | 'embedded'>(phase);
  const start = useRef(performance.now());
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    if (to.current !== phase) {
      from.current = to.current;
      to.current = phase;
      start.current = performance.now();
    }
  }, [phase]);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < n; i++) {
      const c = near.has(i) ? RED : pass && !pass[i] ? DIM : phase === 'documents' ? PAPER : TEAL;
      m.setColorAt(i, color.copy(c));
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [near, pass, phase, n, color]);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const el = performance.now() - start.current;
    const a = from.current === 'documents' ? docs : cloud;
    const b = to.current === 'documents' ? docs : cloud;
    for (let i = 0; i < n; i++) {
      const stag = (i / n) * 400;
      const t = easeInOut(Math.max(0, Math.min(1, (el - stag) / tweenMs)));
      const p = a[i];
      const q = b[i];
      dummy.position.set(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t);
      const s = near.has(i) ? 1.9 : pass && !pass[i] ? 0.6 : 1;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    // one slow ambient drift of the whole field once embedded
    if (group.current && to.current === 'embedded') group.current.rotation.y += dt * 0.035;
  });

  return (
    <group position={position}>
      <group ref={group} name="vector-field">
        <instancedMesh ref={mesh} args={[undefined, undefined, n]} frustumCulled={false}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
        {query && phase === 'embedded' && (
          <>
            <mesh position={query}>
              <sphereGeometry args={[1.1, 16, 16]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            {[...near].map((i) => (
              <Line key={i} points={[query, cloud[i]]} color="#C74634" lineWidth={1.5} transparent opacity={0.9} />
            ))}
          </>
        )}
      </group>
    </group>
  );
}
