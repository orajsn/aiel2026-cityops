import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { ASSETS, assetPosition, project } from '../content/geo';
import { useUiStore } from '../engine/ui';
import { FlowArc } from './FlowArc';
import { VectorField } from './VectorField';
import { layoutCloud, nearestK } from './vectorLayout';
import type { Vec3 } from './shots';

/**
 * The sky stage: where the AI ideas are explained, floating above City Operations Control Center
 * (the question starts there and the answer must land there). It grows in when a page needs it
 * and shrinks away when the story goes back to the bridge.
 *
 * Acts (Lab 2):
 *  - model:    only the model is up there; the question rises to it and nothing comes back from the city.
 *  - embed:    the database appears; documents rise into it from the pins and become a cloud of points;
 *              the question becomes one point and its 5 nearest light up.
 *  - envelope: those 5 fly into an envelope with the question, the envelope goes to the model,
 *              and the answer comes down to the Ops Center.
 */
export type SkyAct = 'model' | 'embed' | 'envelope';

const OPS = assetPosition('City Operations Control Center');
export const SKY_ANCHOR: Vec3 = [OPS.x, 9, OPS.z];
const A = SKY_ANCHOR;
const MODEL: Vec3 = [A[0] - 3.4, A[1], A[2]];
const DB: Vec3 = [A[0] + 2.6, A[1] - 1.4, A[2]];
const CLOUD: Vec3 = [A[0] + 3.2, A[1] + 3.6, A[2]];
const CLOUD_SCALE = 0.075;
const ENVELOPE: Vec3 = [A[0] - 0.4, A[1] + 1.6, A[2]];
const OPS_TOP: Vec3 = [OPS.x, 1.2, OPS.z];
/** the question as a point in the cloud's own space (near the "structural" cluster) */
const QUERY: Vec3 = [8, 6, -4];

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/** ms since `act` last changed, ticking every frame */
function useActClock(act: SkyAct | null) {
  const start = useRef(performance.now());
  const [t, setT] = useState(0);
  useEffect(() => {
    start.current = performance.now();
    setT(0);
  }, [act]);
  useFrame(() => setT(performance.now() - start.current));
  return t;
}

export function SkyStage({ act }: { act: SkyAct | null }) {
  const theme = useUiStore((s) => s.theme);
  const root = useRef<THREE.Group>(null);
  const shown = useRef(0);
  const [visible, setVisible] = useState(false);
  const t = useActClock(act);

  // grow in / shrink away
  useFrame((_, dt) => {
    const target = act ? 1 : 0;
    shown.current += (target - shown.current) * Math.min(1, dt * 3.2);
    const s = ease(shown.current);
    if (root.current) root.current.scale.setScalar(Math.max(0.0001, s));
    const v = shown.current > 0.01;
    if (v !== visible) setVisible(v);
  });

  const sources = useMemo<Vec3[]>(
    () =>
      ASSETS.filter((a) => a.id !== 'City Operations Control Center')
        .filter((_, i) => i % 3 === 0)
        .map((a) => {
          const p = project(a.lat, a.lon);
          return [p.x, 1.1, p.z] as Vec3;
        }),
    [],
  );
  const cloud = useMemo(() => layoutCloud(600, 7), []);
  const near = useMemo(() => nearestK(cloud, QUERY, 5), [cloud]);
  const nearWorld = useMemo<Vec3[]>(
    () => near.map((i) => [CLOUD[0] + cloud[i][0] * CLOUD_SCALE, CLOUD[1] + cloud[i][1] * CLOUD_SCALE, CLOUD[2] + cloud[i][2] * CLOUD_SCALE]),
    [near, cloud],
  );

  const hasDb = act === 'embed' || act === 'envelope';
  const embedded = act === 'envelope' || (act === 'embed' && t > 2600);
  const showQuery = act === 'envelope' || (act === 'embed' && t > 4200);

  // envelope act: 5 points fly in (0.8-2.0 s), the envelope travels to the model (2.4-3.6 s), the answer comes down (3.8 s)
  const fly = act === 'envelope' ? ease((t - 800) / 1200) : 0;
  const travel = act === 'envelope' ? ease((t - 2400) / 1200) : 0;
  const envPos: Vec3 = [ENVELOPE[0] + (MODEL[0] + 0.9 - ENVELOPE[0]) * travel, ENVELOPE[1] + (MODEL[1] + 0.2 - ENVELOPE[1]) * travel, ENVELOPE[2]];

  return (
    <group name="sky-stage" visible={visible}>
      {/* scale about the anchor so the stage grows out of its own centre */}
      <group position={A}>
        <group ref={root}>
          <group position={[-A[0], -A[1], -A[2]]}>
            <ModelOrb lit={act === 'envelope' && t > 3600} doubt={act === 'model' && t > 2600} labelled={visible} />
            {hasDb && <SkyDatabase color={theme.red} appearMs={0} t={t} />}
            {hasDb && (
              <group position={CLOUD} scale={CLOUD_SCALE}>
                <VectorField phase={embedded ? 'embedded' : 'documents'} query={showQuery ? QUERY : undefined} k={5} spin={false} documentsOffset={[0, -14, 0]} tweenMs={1400} />
              </group>
            )}
            {act === 'envelope' && (
              <>
                {nearWorld.map((p, i) => (
                  <mesh key={i} position={[p[0] + (envPos[0] - p[0]) * fly, p[1] + (envPos[1] - p[1]) * fly, p[2] + (envPos[2] - p[2]) * fly]} visible={travel < 0.05}>
                    <sphereGeometry args={[0.09, 10, 10]} />
                    <meshBasicMaterial color={theme.red} toneMapped={false} />
                  </mesh>
                ))}
                <Envelope position={envPos} sealed={fly >= 1} />
                {visible && <SkyLabel position={[ENVELOPE[0], ENVELOPE[1] + 0.9, ENVELOPE[2]]} text="5 documents + the question · context is data, not instructions" show={t > 1800 && travel < 0.2} />}
              </>
            )}
          </group>
        </group>
      </group>
      {/* flows between the city and the stage (outside the scaled group so they stay anchored to the city) */}
      {visible && act === 'model' && <FlowArc key="q-up" from={OPS_TOP} to={MODEL} lift={1.5} radius={0.05} durationMs={1600} delayMs={700} fadeMs={900} color="#ffffff" />}
      {visible && act === 'embed' &&
        sources.map((s, i) => <FlowArc key={`doc-${i}`} from={s} to={DB} lift={2.5} radius={0.04} durationMs={1300} delayMs={500 + i * 180} fadeMs={600} color={theme.data} />)}
      {visible && act === 'envelope' && <FlowArc key="answer" from={MODEL} to={OPS_TOP} lift={1.2} radius={0.06} durationMs={1500} delayMs={3800} persist color={theme.data} />}
      {visible && <SkyLabel position={[MODEL[0], MODEL[1] - 1.3, MODEL[2]]} text="llama3.2 · knows the world, not your city" show={act === 'model' && t > 2600} tone="grey" />}
      {visible && <SkyLabel position={[DB[0], DB[1] - 1.2, DB[2]]} text="Oracle AI Database · 384 numbers per text" show={act === 'embed' && t > 2800} />}
      {visible && <SkyLabel position={[OPS_TOP[0], OPS_TOP[1] + 0.8, OPS_TOP[2]]} text="answer from the envelope only" show={act === 'envelope' && t > 5300} />}
    </group>
  );
}

/** the model: a pale orb with a slow ring; grey with a question mark when it has nothing to go on, teal when it has the evidence */
function ModelOrb({ lit, doubt, labelled }: { lit: boolean; doubt: boolean; labelled: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const col = useMemo(() => new THREE.Color(), []);
  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.z = clock.elapsedTime * 0.4;
    if (mat.current) {
      col.set(lit ? '#1B8A9C' : doubt ? '#9aa1aa' : '#e8eef2');
      mat.current.color.lerp(col, 0.06);
      mat.current.emissive.copy(mat.current.color).multiplyScalar(0.35);
    }
  });
  return (
    <group position={MODEL}>
      <mesh castShadow>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial ref={mat} color="#e8eef2" roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.15, 0.025, 8, 64]} />
        <meshBasicMaterial color="#1B8A9C" transparent opacity={0.7} />
      </mesh>
      {/* HTML does not inherit 3D visibility: only mount the name while the stage is up */}
      {labelled && (
        <Html position={[0, 1.25, 0]} center zIndexRange={[16, 0]} style={{ pointerEvents: 'none' }}>
          <div className="sky-name mono">{doubt ? 'llama3.2 · ?' : 'llama3.2'}</div>
        </Html>
      )}
    </group>
  );
}

/** the Oracle database: three red discs, rising in one after another */
function SkyDatabase({ color, t }: { color: string; appearMs: number; t: number }) {
  return (
    <group position={DB}>
      {[0, 1, 2].map((i) => {
        const k = ease((t - i * 180) / 700);
        return (
          <mesh key={i} position={[0, i * 0.42 - (1 - k) * 0.6, 0]} scale={[1, Math.max(0.001, k), 1]} castShadow>
            <cylinderGeometry args={[1.05, 1.05, 0.34, 48]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        );
      })}
      <Line points={[[0, -0.4, 0], [0, -DB[1] + 1.2, 0]]} color="#1B8A9C" lineWidth={1} transparent opacity={0.35} dashed dashSize={0.25} gapSize={0.2} />
    </group>
  );
}

function Envelope({ position, sealed }: { position: Vec3; sealed: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.6, 0.08]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.05, 0.05]} rotation={[0, 0, Math.PI / 4]} scale={[1, 1, 1]} visible={sealed}>
        <boxGeometry args={[0.5, 0.5, 0.01]} />
        <meshStandardMaterial color="#e6dfd0" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.02, 0.07]} visible={sealed}>
        <circleGeometry args={[0.08, 20]} />
        <meshBasicMaterial color="#C74634" />
      </mesh>
    </group>
  );
}

function SkyLabel({ position, text, show, tone = 'teal' }: { position: Vec3; text: string; show: boolean; tone?: 'teal' | 'grey' }) {
  return (
    <Html position={position} center zIndexRange={[16, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`sky-label tone-${tone}`} style={{ opacity: show ? 1 : 0 }}>
        {text}
      </div>
    </Html>
  );
}
