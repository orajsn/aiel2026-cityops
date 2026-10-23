import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { useUiStore } from '../engine/ui';
import { ASSETS } from '../content/geo';
import { PinCardBody } from './PinCard';
import { VectorField } from './VectorField';
import { SLAB, SLAB_THICKNESS } from './Ground';

export type Face = 'none' | 'tables' | 'json' | 'graph' | 'vectors';

/** Layout of the under-city diorama (frame 04): one base, the database in the middle, two shapes each side. */
export const BASE_Y = -200;
export const DIO = {
  cx: SLAB.cx,
  cz: SLAB.cz + 40, // a little towards the camera so the shapes clear the slab's shadow
  spacing: 125,
};
const SHAPES: { id: Face; label: string; slot: number }[] = [
  { id: 'tables', label: 'Table', slot: -2 },
  { id: 'json', label: 'JSON', slot: -1 },
  { id: 'graph', label: 'Graph', slot: 1 },
  { id: 'vectors', label: 'Vectors', slot: 2 },
];
export function shapeX(face: Face): number {
  const s = SHAPES.find((x) => x.id === face);
  return DIO.cx + (s ? s.slot : 0) * DIO.spacing;
}

const DB_R = 46;
const DISC_H = 16;
const DISC_GAP = 3.5;
const DB_H = DISC_H * 3 + DISC_GAP * 2;
export const DB_TOP_Y = BASE_Y + 4 + DB_H;

function easeOut(t: number) {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

/**
 * The Oracle AI Database under the city with its four shapes, as in the reference frame:
 * the city slab above, three teal lines dropping into a red disc stack, and one base carrying
 * the table, the JSON card, the graph and the vector cloud. `face` lights one of them.
 */
export function DatabaseDiorama({ face }: { face: Face }) {
  const theme = useUiStore((s) => s.theme);
  const start = useRef(performance.now());
  const [t, setT] = useState(0);
  useFrame(() => {
    const k = Math.min(1, (performance.now() - start.current) / 3200);
    if (k !== t) setT(k);
  });

  const cx = DIO.cx;
  const cz = DIO.cz;
  const baseW = DIO.spacing * 4 + 150;

  return (
    <group name="database-diorama">
      {/* the base everything stands on */}
      <mesh position={[cx, BASE_Y, cz]}>
        <boxGeometry args={[baseW, 8, 120]} />
        <meshStandardMaterial color={theme.base} roughness={1} />
      </mesh>

      <Database cx={cx} cz={cz} appear={easeOut((t - 0.15) / 0.35)} />

      {/* city -> database: three lines from the slab underside */}
      {[-150, 0, 150].map((dx, i) => (
        <Connector
          key={dx}
          points={[
            [cx + dx, -SLAB_THICKNESS - 1, cz - 30],
            [cx + dx, -70, cz - 30],
            [cx, -70, cz - 30],
            [cx, DB_TOP_Y + 1, cz - 30],
          ]}
          reveal={easeOut((t - 0.45 - i * 0.06) / 0.3)}
          color={theme.data}
        />
      ))}
      {/* database -> each shape */}
      {SHAPES.map((s, i) => {
        const x = shapeX(s.id);
        const y = BASE_Y + 4 + 2;
        return (
          <Connector
            key={s.id}
            points={[
              [cx + Math.sign(s.slot) * DB_R, BASE_Y + 4 + DB_H * 0.55, cz],
              [x, BASE_Y + 4 + DB_H * 0.55, cz],
              [x, y + 40, cz],
            ]}
            reveal={easeOut((t - 0.7 - i * 0.05) / 0.3)}
            color={theme.data}
          />
        );
      })}

      {SHAPES.map((s, i) => (
        <Shape key={s.id} face={s.id} label={s.label} x={shapeX(s.id)} z={cz} appear={easeOut((t - 0.55 - i * 0.06) / 0.35)} active={face === s.id} />
      ))}
    </group>
  );
}

function Database({ cx, cz, appear }: { cx: number; cz: number; appear: number }) {
  const theme = useUiStore((s) => s.theme);
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    // the one ambient motion down here: the stack breathes very slightly
    const b = 1 + Math.sin(clock.elapsedTime * 0.8) * 0.006;
    ref.current.scale.set(appear, appear * b, appear);
  });
  return (
    <group ref={ref} position={[cx, BASE_Y + 4, cz]}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, i * (DISC_H + DISC_GAP) + DISC_H / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[DB_R, DB_R, DISC_H, 48]} />
            <meshStandardMaterial color={theme.red} roughness={0.55} />
          </mesh>
          <mesh position={[0, DISC_H / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[DB_R, 48]} />
            <meshStandardMaterial color="#DD6A5A" roughness={0.5} />
          </mesh>
        </group>
      ))}
      <Html position={[0, -16, 46]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none', opacity: appear }}>
        <div className="dio-label dio-label--db">Oracle AI Database</div>
      </Html>
    </group>
  );
}

function Connector({ points, reveal, color }: { points: [number, number, number][]; reveal: number; color: string }) {
  const ref = useRef<any>(null);
  useFrame(() => {
    if (ref.current) ref.current.material.opacity = 0.9 * reveal;
  });
  const end = points[points.length - 1];
  const startP = points[0];
  return (
    <group>
      <Line ref={ref} points={points} color={color} lineWidth={1.6} transparent opacity={0} />
      {[startP, end].map((p, i) => (
        <mesh key={i} position={p} scale={reveal}>
          <sphereGeometry args={[2.8, 12, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** One of the four shapes on the base, with its label and its active-face reveal. */
function Shape({ face, label, x, z, appear, active }: { face: Face; label: string; x: number; z: number; appear: number; active: boolean }) {
  const theme = useUiStore((s) => s.theme);
  const g = useRef<THREE.Group>(null);
  const lift = useRef(0);
  useFrame((_, dt) => {
    if (!g.current) return;
    lift.current += ((active ? 6 : 0) - lift.current) * Math.min(1, dt * 4);
    g.current.position.set(x, BASE_Y + 4 + lift.current, z);
    g.current.scale.setScalar(appear);
  });
  return (
    <group ref={g} position={[x, BASE_Y + 4, z]} scale={0}>
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -lift.current + 0.3, 0]}>
          <ringGeometry args={[40, 44, 48]} />
          <meshBasicMaterial color={theme.data} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      )}
      {face === 'tables' && <TableShape active={active} />}
      {face === 'json' && <JsonShape active={active} />}
      {face === 'graph' && <GraphShape active={active} />}
      {face === 'vectors' && <VectorsShape active={active} />}
      <Html position={[0, -14, 50]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`dio-label${active ? ' active' : ''}`}>{label}</div>
      </Html>
    </group>
  );
}

const CARD_W = 60;
const CARD_H = 44;

function TableShape({ active }: { active: boolean }) {
  const theme = useUiStore((s) => s.theme);
  const rows = 4;
  const cols = 3;
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const since = useRef(0);
  useEffect(() => {
    if (active) since.current = performance.now();
  }, [active]);
  useFrame(() => {
    const el = active ? (performance.now() - since.current) / 1000 : 0;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const k = active ? easeOut(el * 2.2 - i * 0.18) : 1;
      m.scale.set(k, 1, 1);
    });
  });
  const cellW = (CARD_W - 4) / cols - 1.5;
  const cellH = (CARD_H - 4) / rows - 1.5;
  return (
    <group rotation={[-0.25, 0, 0]} position={[0, CARD_H / 2 + 1, 0]}>
      <mesh castShadow>
        <boxGeometry args={[CARD_W, CARD_H, 1.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = -CARD_W / 2 + 2 + c * (cellW + 1.5) + cellW / 2;
        const y = CARD_H / 2 - 2 - r * (cellH + 1.5) - cellH / 2;
        const header = r === 0;
        return (
          <mesh key={i} ref={(m) => (refs.current[i] = m)} position={[x, y, 0.75]}>
            <planeGeometry args={[cellW, cellH]} />
            <meshBasicMaterial color={header ? theme.data : i % 5 === 2 ? '#8fcbd6' : '#dfeff2'} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function JsonShape({ active }: { active: boolean }) {
  const hb = useMemo(() => ASSETS.find((a) => a.id === 'Harbor Bridge')!, []);
  return (
    <group rotation={[-0.25, 0, 0]} position={[0, CARD_H / 2 + 1, 0]}>
      <mesh castShadow>
        <boxGeometry args={[CARD_W * 0.72, CARD_H * 1.15, 1.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <Html center transform distanceFactor={60} position={[0, 0, 0.8]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div className="dio-json">{'{ }'}</div>
      </Html>
      {active && (
        <Html position={[0, CARD_H * 0.8, 0]} center zIndexRange={[25, 0]} style={{ pointerEvents: 'none' }}>
          <div className="dio-card">
            <PinCardBody asset={hb} />
          </div>
        </Html>
      )}
    </group>
  );
}

function GraphShape({ active }: { active: boolean }) {
  const theme = useUiStore((s) => s.theme);
  const nodes = useMemo<[number, number, number][]>(
    () => [
      [-14, 10, -4],
      [12, 22, 2],
      [16, 4, 6],
      [-2, 30, -8],
    ],
    [],
  );
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 2],
    [1, 3],
  ];
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    if (ref.current) ref.current.rotation.y += dt * (active ? 0.35 : 0.08);
    if (active && ref.current) ref.current.position.y = 8 + Math.sin(clock.elapsedTime * 1.5) * 0.8;
  });
  return (
    <group ref={ref} position={[0, 8, 0]} scale={1.5}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <sphereGeometry args={[4.2, 20, 20]} />
          <meshStandardMaterial color={theme.data} roughness={0.5} />
        </mesh>
      ))}
      {edges.map(([a, b], i) => (
        <Line key={i} points={[nodes[a], nodes[b]]} color={theme.data} lineWidth={2.2} />
      ))}
    </group>
  );
}

function VectorsShape({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<'documents' | 'embedded'>('embedded');
  useEffect(() => {
    if (!active) return;
    setPhase('documents');
    const id = setTimeout(() => setPhase('embedded'), 700);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <group position={[0, 34, 0]} scale={1.3}>
      <VectorField n={220} seed={3} phase={phase} documentsOffset={[0, 0, 0]} tweenMs={1600} />
    </group>
  );
}
