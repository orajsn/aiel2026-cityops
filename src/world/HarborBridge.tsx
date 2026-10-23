import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { useUiStore } from '../engine/ui';
import { harborBridgeFrame } from './bridgeFrame';

const DECK_Y = 1.4; // matches the elevated road ribbon

/**
 * Harbor Bridge: a cable-stayed bridge built on the real river crossing the roads already draw.
 * Two pylons, fans of cables, piers under the deck, a maintenance platform with the inspector
 * at Pier 3, and the two incident markers.
 */
export function HarborBridge({ inspector = false, markers = false }: { inspector?: boolean; markers?: boolean }) {
  const frame = useMemo(() => harborBridgeFrame(), []);
  const theme = useUiStore((s) => s.theme);

  const piers = [-0.7, -0.42, -0.14, 0.14, 0.42, 0.7].map((k) => k * frame.half);
  const pylons = [-0.3, 0.3].map((k) => k * frame.half);
  const pier3 = piers[3];
  const pier2 = piers[2];
  const pylonH = 12;

  const cables = useMemo(() => {
    const out: [number, number, number][][] = [];
    for (const px of pylons) {
      for (let i = 1; i <= 6; i++) {
        const dx = (i * (frame.half * 0.3)) / 6 + 0.6;
        for (const sgn of [-1, 1]) {
          out.push([
            [px, DECK_Y + pylonH - i * 0.8, 0],
            [px + sgn * dx, DECK_Y + 0.1, 0],
          ]);
        }
      }
    }
    return out;
  }, [frame.half]);

  return (
    <group position={[frame.x, 0, frame.z]} rotation={[0, frame.yaw, 0]} name="harbor-bridge">
      {piers.map((x, i) => (
        <mesh key={i} position={[x, DECK_Y / 2, 0]} castShadow>
          <boxGeometry args={[0.5, DECK_Y, 1.3]} />
          <meshStandardMaterial color="#cfcac0" roughness={1} />
        </mesh>
      ))}
      {pylons.map((x, i) => (
        <group key={`p${i}`} position={[x, 0, 0]}>
          {[-0.7, 0.7].map((z) => (
            <mesh key={z} position={[0, (DECK_Y + pylonH) / 2, z]} castShadow>
              <boxGeometry args={[0.45, DECK_Y + pylonH, 0.3]} />
              <meshStandardMaterial color="#e9e2d2" roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, DECK_Y + pylonH - 0.3, 0]} castShadow>
            <boxGeometry args={[0.5, 0.5, 1.7]} />
            <meshStandardMaterial color="#e9e2d2" roughness={0.9} />
          </mesh>
        </group>
      ))}
      {cables.map((pts, i) => (
        <Line key={i} points={pts} color="#f0e6d2" lineWidth={1} />
      ))}
      {/* maintenance platform on Pier 3, as in the reference frame */}
      <group position={[pier3, DECK_Y * 0.45, 0.95]}>
        <mesh castShadow>
          <boxGeometry args={[1.3, 0.08, 0.7]} />
          <meshStandardMaterial color="#b9bcc4" roughness={1} />
        </mesh>
        {[-0.62, 0.62].map((x) => (
          <mesh key={x} position={[x, 0.2, 0]}>
            <boxGeometry args={[0.03, 0.4, 0.7]} />
            <meshStandardMaterial color="#8a8f98" roughness={1} />
          </mesh>
        ))}
      </group>
      {inspector && <Inspector x={pier3} y={DECK_Y * 0.45 + 0.04} />}
      {markers && (
        <>
          <Marker x={pier3} y={DECK_Y} label="Pier 3" sub="crack · this afternoon" color={theme.red} delayMs={1800} labelY={7} />
          <Marker x={pier2} y={DECK_Y} label="Pier 2" sub="corrosion · next session" color={theme.data} delayMs={3000} labelY={4.5} />
        </>
      )}
    </group>
  );
}

/** A simple figure in hi-vis with a torch on the platform. */
function Inspector({ x, y }: { x: number; y: number }) {
  const cone = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (cone.current) cone.current.rotation.z = -0.9 + Math.sin(clock.elapsedTime * 0.5) * 0.25;
  });
  return (
    <group position={[x + 0.2, y, 1.0]} scale={0.32}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.35, 1.0, 4, 8]} />
        <meshStandardMaterial color="#d6e24a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#ffd9b0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.32, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
      <mesh ref={cone} position={[-0.5, 1.3, 0]} rotation={[0, 0, 0.9]}>
        <coneGeometry args={[1.4, 4, 24, 1, true]} />
        <meshBasicMaterial color="#ffe6b0" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Marker({ x, y, label, sub, color, delayMs, labelY = 10 }: { x: number; y: number; label: string; sub: string; color: string; delayMs: number; labelY?: number }) {
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
        <cylinderGeometry args={[0.08, 0.08, 14, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]} visible={false}>
        <ringGeometry args={[0.7, 0.95, 40]} />
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
