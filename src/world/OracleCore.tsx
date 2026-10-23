import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ASSETS } from '../content/geo';
import { PinCardBody } from './PinCard';
import { VectorField } from './VectorField';
import { CORE_POS } from './shots';

export type Face = 'none' | 'tables' | 'json' | 'graph' | 'vectors';

const R = 40;

const HALO_VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vV;
  void main() {
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vV = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const HALO_FRAG = /* glsl */ `
  uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
  void main() {
    float f = pow(1.0 - max(0.0, dot(normalize(vN), normalize(vV))), 2.5);
    gl_FragColor = vec4(uColor * f * 0.9, f * 0.6);
  }
`;

const FACES: { id: Face; label: string; pos: [number, number, number] }[] = [
  { id: 'tables', label: 'Tables', pos: [-R - 4, 0, 0] },
  { id: 'json', label: 'JSON', pos: [R + 4, 0, 0] },
  { id: 'graph', label: 'Graph', pos: [0, R + 4, 0] },
  { id: 'vectors', label: 'Vectors', pos: [0, 0, R + 4] },
];

/**
 * The Oracle AI Database: one glowing teal engine under the city with four faces.
 * The active face glows and plays its reveal; the graph face is drawn on the map above (GraphLines).
 */
export function OracleCore({ face }: { face: Face }) {
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const innerMat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, dt) => {
    // one slow drift of the outer wire shell; the inner body breathes
    if (shell.current) shell.current.rotation.y += dt * 0.06;
    if (inner.current) {
      const b = 1 + Math.sin(clock.elapsedTime * 0.8) * 0.012;
      inner.current.scale.setScalar(b);
    }
    if (innerMat.current) innerMat.current.emissiveIntensity = face === 'none' ? 0.35 : 0.5;
  });

  return (
    <group position={CORE_POS} name="oracle-core">
      <mesh ref={inner}>
        <icosahedronGeometry args={[R * 0.82, 1]} />
        <meshStandardMaterial
          ref={innerMat}
          color="#0c2f38"
          emissive="#1B8A9C"
          emissiveIntensity={0.35}
          roughness={0.45}
          metalness={0.35}
          flatShading
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[R, 1]} />
        <meshBasicMaterial color="#2fb3c7" wireframe transparent opacity={0.35} />
      </mesh>
      <pointLight color="#1B8A9C" intensity={2.5} distance={260} decay={1.2} />
      <directionalLight position={[-60, 80, 120]} intensity={1.6} color="#dff6fa" />
      {/* fresnel halo */}
      <mesh>
        <icosahedronGeometry args={[R * 1.08, 2]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uColor: { value: new THREE.Color('#1B8A9C') } }}
          vertexShader={HALO_VERT}
          fragmentShader={HALO_FRAG}
        />
      </mesh>

      {FACES.map((f) => (
        <FaceMarker key={f.id} pos={f.pos} label={f.label} active={face === f.id} />
      ))}

      {face === 'tables' && <TablesReveal />}
      {face === 'json' && <JsonReveal />}
      {face === 'vectors' && <VectorsReveal />}
    </group>
  );
}

function FaceMarker({ pos, label, active }: { pos: [number, number, number]; label: string; active: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const s = active ? 1 + Math.sin(clock.elapsedTime * 2) * 0.08 : 1;
    ring.current.scale.setScalar(s);
    ring.current.lookAt(0, 0, 0);
  });
  return (
    <group position={pos}>
      <mesh ref={ring}>
        <torusGeometry args={[3.2, 0.25, 8, 40]} />
        <meshBasicMaterial color={active ? '#C74634' : '#2fb3c7'} transparent opacity={active ? 1 : 0.5} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={120} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`face-label${active ? ' active' : ''}`}>{label}</div>
      </Html>
    </group>
  );
}

/** Narratives stack as documents, then fly into the star field: the vector face. */
function VectorsReveal() {
  const [phase, setPhase] = useState<'documents' | 'embedded'>('documents');
  useEffect(() => {
    const t = setTimeout(() => setPhase('embedded'), 900);
    return () => clearTimeout(t);
  }, []);
  return <VectorField phase={phase} n={600} position={[-10, -6, R + 34]} documentsOffset={[-70, 0, 0]} tweenMs={1800} />;
}

/** Rows of thin bars rise beside the core: the relational face. */
function TablesReveal() {
  const rows = 7;
  const cols = 9;
  const start = useRef(performance.now());
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(() => {
    const el = performance.now() - start.current;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const k = Math.max(0, Math.min(1, (el - i * 25) / 450));
      const e = 1 - Math.pow(1 - k, 3);
      m.scale.set(1, e, 1);
      m.visible = e > 0.001;
    });
  });
  const cells = useMemo(() => Array.from({ length: rows * cols }, (_, i) => i), []);
  return (
    <group position={[-R - 34, -10, 18]} rotation={[0, 0.5, 0]}>
      {cells.map((i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const key = c === 0;
        return (
          <mesh key={i} ref={(m) => (refs.current[i] = m)} position={[(c - cols / 2) * 5, 0, (r - rows / 2) * 4]}>
            <boxGeometry args={[4, key ? 3 : 1.6, 0.5]} />
            <meshStandardMaterial color={key ? '#C74634' : '#1B8A9C'} emissive={key ? '#C74634' : '#1B8A9C'} emissiveIntensity={key ? 0.9 : 0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Five spec cards fan out: the JSON face. */
function JsonReveal() {
  const picks = useMemo(
    () => ['Harbor Bridge', 'Substation Gamma', 'Pipeline North-7', 'Northern Reservoir', 'City Operations Control Center']
      .map((id) => ASSETS.find((a) => a.id === id)!)
      .filter(Boolean),
    [],
  );
  return (
    <group position={[R + 22, 4, 18]}>
      {picks.map((a, i) => {
        const ang = (i - 2) * 0.32;
        return (
          <group key={a.id} position={[Math.sin(ang) * 20 + i * 2, (i - 2) * 3, Math.cos(ang) * 20 - 20]} rotation={[0, -0.5 - ang * 0.8, 0]}>
            <Html transform distanceFactor={34} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
              <div className="json-card" style={{ animationDelay: `${i * 120}ms` }}>
                <PinCardBody asset={a} />
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
