import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { useUiStore } from '../engine/ui';
import { harborBridgeFrame } from './bridgeFrame';

/** structure scale: the map is real scale (1 unit ~ 108 m); the bridge is drawn a few times larger than life so it reads */
const S = 0.22;
const DECK_Y = 1.6;
const DECK_W = 2.4;
const DECK_T = 0.36;
const PYLON_H = 11;

const CONCRETE = '#d9d4c9';
const DECK = '#8d93a0';
const RAIL = '#f1ece2';
const STEEL = '#e9e2d2';

/**
 * Harbor Bridge, built for close-ups: a straight deck between the banks with ramps down to the
 * streets, kerbs and railings, lamp posts, two pylons with cable fans, piers with caps in the water,
 * a maintenance platform with stairs on Pier 3, the inspector, and the two incident markers.
 * Always part of the city; `inspector` and `markers` only add the story props.
 */
export function HarborBridge({ inspector = false, markers = false }: { inspector?: boolean; markers?: boolean }) {
  const f0 = useMemo(() => harborBridgeFrame(), []);
  // work in structure units inside a group scaled by S, so spans still match the world
  const f = useMemo(() => ({ ...f0, water: f0.water / S, ramp: f0.ramp / S }), [f0]);
  const theme = useUiStore((s) => s.theme);

  // six piers across the water, numbered 1..6 from the north bank; Pier 3 and Pier 2 carry the story
  const piers = [-0.78, -0.47, -0.16, 0.16, 0.47, 0.78].map((k) => k * f.water);
  const pier3 = piers[2];
  const pier2 = piers[1];
  const pylons = [-0.32, 0.32].map((k) => k * f.water);

  const cables = useMemo(() => {
    const out: [number, number, number][][] = [];
    for (const px of pylons) {
      for (let i = 1; i <= 7; i++) {
        const dx = 0.5 + i * ((f.water * 0.3) / 7);
        for (const sgn of [-1, 1]) {
          out.push([
            [px, DECK_Y + PYLON_H - 0.4 - i * 0.55, 0],
            [px + sgn * dx, DECK_Y + DECK_T / 2, 0],
          ]);
        }
      }
    }
    return out;
  }, [f.water]);

  const lamps = useMemo(() => {
    const out: number[] = [];
    for (let x = -f.water + 1.5; x < f.water; x += 2.6) out.push(x);
    return out;
  }, [f.water]);

  const rampLen = f.ramp;
  const rampAngle = Math.atan2(DECK_Y - 0.1, rampLen);

  return (
    <group position={[f.x, 0, f.z]} rotation={[0, f.yaw, 0]} scale={S} name="harbor-bridge">
      {/* deck over water */}
      <mesh position={[0, DECK_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[f.water * 2, DECK_T, DECK_W]} />
        <meshStandardMaterial color={DECK} roughness={1} />
      </mesh>
      {/* kerbs and railings */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[0, DECK_Y + DECK_T / 2 + 0.06, s * (DECK_W / 2 - 0.14)]}>
            <boxGeometry args={[f.water * 2, 0.12, 0.28]} />
            <meshStandardMaterial color={CONCRETE} roughness={1} />
          </mesh>
          <mesh position={[0, DECK_Y + DECK_T / 2 + 0.5, s * (DECK_W / 2 - 0.08)]}>
            <boxGeometry args={[f.water * 2, 0.05, 0.05]} />
            <meshStandardMaterial color={RAIL} roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* ramps on both banks, descending to street level */}
      {[-1, 1].map((s) => (
        <group key={`r${s}`} position={[s * (f.water + rampLen / 2), (DECK_Y + 0.1) / 2, 0]} rotation={[0, 0, -s * rampAngle]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[Math.hypot(rampLen, DECK_Y - 0.1), DECK_T, DECK_W]} />
            <meshStandardMaterial color={DECK} roughness={1} />
          </mesh>
          {[-1, 1].map((k) => (
            <mesh key={k} position={[0, DECK_T / 2 + 0.06, k * (DECK_W / 2 - 0.14)]}>
              <boxGeometry args={[Math.hypot(rampLen, DECK_Y - 0.1), 0.12, 0.28]} />
              <meshStandardMaterial color={CONCRETE} roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
      {/* street-level approach strips beyond the ramps */}
      {[-1, 1].map((s) => (
        <mesh key={`a${s}`} position={[s * (f.water + rampLen + 5), 0.1, 0]} receiveShadow>
          <boxGeometry args={[10, 0.1, DECK_W]} />
          <meshStandardMaterial color={DECK} roughness={1} />
        </mesh>
      ))}
      {/* lamp posts */}
      {lamps.map((x, i) => (
        <group key={i} position={[x, DECK_Y + DECK_T / 2, (i % 2 ? 1 : -1) * (DECK_W / 2 - 0.3)]}>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 1.1, 6]} />
            <meshStandardMaterial color={RAIL} roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#fff2c8" toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* piers: shaft in the water with a cap under the deck */}
      {piers.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, (DECK_Y - 0.3) / 2 - 0.4, 0]} castShadow>
            <boxGeometry args={[0.9, DECK_Y - 0.3 + 0.8, 1.6]} />
            <meshStandardMaterial color={CONCRETE} roughness={1} />
          </mesh>
          <mesh position={[0, DECK_Y - 0.3, 0]} castShadow>
            <boxGeometry args={[1.1, 0.24, DECK_W + 0.2]} />
            <meshStandardMaterial color={CONCRETE} roughness={1} />
          </mesh>
        </group>
      ))}
      {/* pylons: two legs each side of the deck, joined above */}
      {pylons.map((x, i) => (
        <group key={`p${i}`} position={[x, 0, 0]}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0, (DECK_Y + PYLON_H) / 2 - 0.4, s * (DECK_W / 2 + 0.25)]} castShadow>
              <boxGeometry args={[0.5, DECK_Y + PYLON_H + 0.8, 0.36]} />
              <meshStandardMaterial color={STEEL} roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, DECK_Y + PYLON_H - 0.2, 0]} castShadow>
            <boxGeometry args={[0.55, 0.5, DECK_W + 0.9]} />
            <meshStandardMaterial color={STEEL} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {cables.map((pts, i) => (
        <Line key={i} points={pts} color="#f3ead6" lineWidth={1} />
      ))}
      {/* maintenance platform on Pier 3 with a stair down the shaft */}
      <group position={[pier3, DECK_Y - 0.95, DECK_W / 2 + 0.55]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.08, 0.9]} />
          <meshStandardMaterial color="#b9bcc4" roughness={1} />
        </mesh>
        {[[-0.78, 0], [0.78, 0], [0, 0.43]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.22, z]}>
            <boxGeometry args={[x === 0 ? 1.6 : 0.03, 0.4, z === 0 ? 0.9 : 0.03]} />
            <meshStandardMaterial color="#8a8f98" roughness={1} />
          </mesh>
        ))}
        <mesh position={[0.95, 0.25, -0.4]} rotation={[0, 0, 0.9]}>
          <boxGeometry args={[0.06, 1.2, 0.35]} />
          <meshStandardMaterial color="#8a8f98" roughness={1} />
        </mesh>
      </group>
      {inspector && <Inspector x={pier3 + 0.2} y={DECK_Y - 0.91} z={DECK_W / 2 + 0.55} />}
      {markers && (
        <>
          <Marker x={pier3} y={DECK_Y} label="Pier 3" sub="crack · this afternoon" color={theme.red} delayMs={1800} labelY={7} />
          <Marker x={pier2} y={DECK_Y} label="Pier 2" sub="corrosion · next session" color={theme.data} delayMs={3000} labelY={4.5} />
        </>
      )}
    </group>
  );
}

/** The inspector: hi-vis vest, hard hat, torch beam on the pier face. */
function Inspector({ x, y, z }: { x: number; y: number; z: number }) {
  const beam = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (beam.current) beam.current.rotation.y = 0.2 + Math.sin(clock.elapsedTime * 0.5) * 0.2;
  });
  return (
    <group position={[x, y, z]} scale={0.22} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.9, 1.2, 0.5]} />
        <meshStandardMaterial color="#d8e040" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.7, 0.45]} />
        <meshStandardMaterial color="#3b4150" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.32, 12, 12]} />
        <meshStandardMaterial color="#ffd9b0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.18, 0]} castShadow>
        <sphereGeometry args={[0.36, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      <mesh ref={beam} position={[0.55, 1.3, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.9, 3.2, 20, 1, true]} />
        <meshBasicMaterial color="#fff0c0" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Marker({ x, y, label, sub, color, delayMs, labelY = 5 }: { x: number; y: number; label: string; sub: string; color: string; delayMs: number; labelY?: number }) {
  const beam = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const start = useRef(performance.now() + delayMs);
  const html = useRef<HTMLDivElement>(null);
  useFrame(({ clock }) => {
    const k = Math.max(0, Math.min(1, (performance.now() - start.current) / 700));
    const e = 1 - Math.pow(1 - k, 3);
    if (beam.current) {
      beam.current.scale.set(1, e, 1);
      beam.current.visible = e > 0.001;
    }
    const phase = (clock.elapsedTime * 0.6) % 1;
    if (ring.current && ringMat.current) {
      ring.current.visible = k >= 1;
      const s = 1 + phase * 2.5;
      ring.current.scale.set(s, s, 1);
      ringMat.current.opacity = (1 - phase) * 0.8;
    }
    if (html.current) html.current.style.opacity = String(k);
  });
  return (
    <group position={[x, y, 0]}>
      <mesh ref={beam} visible={false} scale={[1, 0, 1]}>
        <cylinderGeometry args={[0.06, 0.06, 9, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]} visible={false}>
        <ringGeometry args={[0.6, 0.8, 40]} />
        <meshBasicMaterial ref={ringMat} color={color} transparent opacity={0.8} depthWrite={false} toneMapped={false} />
      </mesh>
      <Html position={[0, labelY, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={html} className="marker-label" style={{ borderColor: color, opacity: 0 }}>
          <div className="marker-label__pier mono" style={{ color }}>{label}</div>
          <div className="marker-label__sub">{sub}</div>
        </div>
      </Html>
    </group>
  );
}
