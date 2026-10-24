import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { ASSETS } from '../content/geo';
import { layoutCloud } from './vectorLayout';
import type { Vec3 } from './shots';

export type Face = 'tables' | 'json' | 'graph' | 'vectors';

const HB = ASSETS.find((a) => a.id === 'Harbor Bridge')!;

/** where each shape floats, relative to the database at the centre of the sky stage */
const SLOTS: Record<Face, { at: Vec3; label: string }> = {
  tables: { at: [-3.5, -0.2, 0.3], label: 'Table' },
  json: { at: [-1.8, 1.5, 0], label: 'JSON' },
  graph: { at: [1.8, 1.5, 0], label: 'Graph' },
  vectors: { at: [3.5, -0.2, 0.3], label: 'Vectors' },
};
const FACES = Object.keys(SLOTS) as Face[];

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
};

/**
 * One Oracle AI Database in the sky with its four shapes around it: a table, a JSON spec sheet, a graph
 * and a cloud of vectors, each wired to the same red stack. `face` lights one of them (0.5a to 0.5d);
 * none lit = the overview (0.5). All local units around `center`.
 */
export function SkyShapes({ center, face, t, red }: { center: Vec3; face: Face | null; t: number; red: string }) {
  return (
    <group position={center} name="sky-shapes">
      <Stack red={red} t={face ? 9999 : t} />
      {FACES.map((f, i) => {
        const appear = face ? 1 : ease((t - 900 - i * 250) / 600);
        const lit = face === f;
        const dim = face !== null && !lit;
        const at = SLOTS[f].at;
        return (
          <group key={f}>
            <Line points={[[0, 0.3, 0], [at[0] * 0.5, at[1] * 0.5 + 0.4, at[2] * 0.5], at]} color={lit ? '#2bb3c8' : '#1B8A9C'} lineWidth={lit ? 3 : 1.5} transparent opacity={(dim ? 0.25 : 0.8) * appear} />
            <group position={at} scale={Math.max(0.001, appear) * (lit ? 1.25 : 1)}>
              <Card dim={dim} lit={lit}>
                {f === 'tables' && <TableShape lit={lit} />}
                {f === 'json' && <JsonShape />}
                {f === 'graph' && <GraphShape lit={lit} />}
                {f === 'vectors' && <VectorsShape lit={lit} />}
              </Card>
              <Html position={[0, -1.05, 0]} center zIndexRange={[16, 0]} style={{ pointerEvents: 'none' }}>
                <div className={`sky-label ${lit ? 'tone-teal' : 'tone-grey'}`} style={{ opacity: (dim ? 0.45 : 1) * appear }}>
                  {SLOTS[f].label}
                </div>
              </Html>
            </group>
          </group>
        );
      })}
      <Html position={[0, -1.55, 0]} center zIndexRange={[16, 0]} style={{ pointerEvents: 'none' }}>
        <div className="sky-label tone-red" style={{ opacity: ease((t - 500) / 500) }}>
          Oracle AI Database
        </div>
      </Html>
    </group>
  );
}

/** the red stack: three discs rising one after another */
function Stack({ red, t }: { red: string; t: number }) {
  return (
    <group position={[0, -1.1, 0]}>
      {[0, 1, 2].map((i) => {
        const k = ease((t - i * 180) / 700);
        return (
          <mesh key={i} position={[0, i * 0.5 - (1 - k) * 0.6, 0]} scale={[1, Math.max(0.001, k), 1]} castShadow>
            <cylinderGeometry args={[1.15, 1.15, 0.4, 48]} />
            <meshStandardMaterial color={red} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

/** a pale backing card the shape sits on; teal edge when lit, faded when another shape is lit */
function Card({ children, dim, lit }: { children: React.ReactNode; dim: boolean; lit: boolean }) {
  return (
    <group>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[1.7, 1.5, 0.06]} />
        <meshStandardMaterial color={lit ? '#f4fbfc' : '#eef0f2'} roughness={0.8} transparent opacity={dim ? 0.35 : 0.95} />
      </mesh>
      {lit && (
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[1.82, 1.62, 0.02]} />
          <meshBasicMaterial color="#2bb3c8" toneMapped={false} />
        </mesh>
      )}
      <group visible={!dim}>{children}</group>
    </group>
  );
}

/** rows and columns; when lit, the rows fill in one by one */
function TableShape({ lit }: { lit: boolean }) {
  const rows = useRef<THREE.Group>(null);
  const start = useRef(performance.now());
  useEffect(() => void (start.current = performance.now()), [lit]);
  useFrame(() => {
    rows.current?.children.forEach((r, i) => {
      const k = lit ? ease((performance.now() - start.current - i * 220) / 400) : 1;
      r.scale.x = Math.max(0.001, k);
    });
  });
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 0.2, 0.04]} />
        <meshStandardMaterial color="#1B8A9C" />
      </mesh>
      <group ref={rows}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[-0.7, 0.22 - i * 0.24, 0]}>
            {[0, 1, 2].map((c) => (
              <mesh key={c} position={[0.24 + c * 0.47, 0, 0]}>
                <boxGeometry args={[0.42, 0.17, 0.03]} />
                <meshStandardMaterial color={c === 0 && i === 0 ? '#e2604c' : '#cfd6dc'} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

/** the Harbor Bridge spec sheet as JSON, drawn on a canvas (real keys and values from the asset) */
function JsonShape() {
  const tex = useMemo(() => {
    const c = Object.assign(document.createElement('canvas'), { width: 420, height: 360 });
    const g = c.getContext('2d')!;
    g.fillStyle = '#0f1823';
    g.fillRect(0, 0, 420, 360);
    g.font = '24px "JetBrains Mono", monospace';
    const entries = Object.entries(HB.specs);
    const lines = ['{', ...entries.map(([k, v], i) => `  "${k}": ${JSON.stringify(v)}${i < entries.length - 1 ? ',' : ''}`), '}'];
    lines.forEach((l, i) => {
      g.fillStyle = i === 0 || i === lines.length - 1 ? '#e9eef2' : '#2bb3c8';
      g.fillText(l, 22, 46 + i * 40);
    });
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh>
      <planeGeometry args={[1.45, 1.24]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

/** nodes and links; when lit, a pulse runs along the links */
function GraphShape({ lit }: { lit: boolean }) {
  const nodes: Vec3[] = [[0, 0.1, 0.05], [-0.5, 0.45, 0.05], [0.5, 0.45, 0.05], [-0.55, -0.35, 0.05], [0.45, -0.4, 0.05]];
  const pulse = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!pulse.current) return;
    pulse.current.visible = lit;
    const i = Math.floor(clock.elapsedTime * 1.2) % 4;
    const k = (clock.elapsedTime * 1.2) % 1;
    const a = nodes[0];
    const b = nodes[i + 1];
    pulse.current.position.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, 0.08);
  });
  return (
    <group>
      {nodes.slice(1).map((n, i) => (
        <Line key={i} points={[nodes[0], n]} color="#1B8A9C" lineWidth={2} />
      ))}
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[i === 0 ? 0.13 : 0.09, 16, 16]} />
          <meshStandardMaterial color={i === 0 ? '#e2604c' : '#1B8A9C'} />
        </mesh>
      ))}
      <mesh ref={pulse}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** a small cloud of points in three clusters; slowly turning when lit */
function VectorsShape({ lit }: { lit: boolean }) {
  const pts = useMemo(() => layoutCloud(140, 11).map((p) => [p[0] * 0.018, p[1] * 0.018, p[2] * 0.006 + 0.1] as Vec3), []);
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current && lit) g.current.rotation.y += dt * 0.5;
  });
  return (
    <group ref={g}>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <octahedronGeometry args={[0.025, 0]} />
          <meshBasicMaterial color="#1B8A9C" />
        </mesh>
      ))}
    </group>
  );
}
