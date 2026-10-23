import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { assetPosition } from '../content/geo';
import { RIVER_CURVE, distanceToRiver, riverHalfWidth } from './river';

/**
 * Diorama placeholder for Harbor Bridge: a deck across the river on four piers,
 * an inspector figure with a torch at Pier 3, and the two incident markers.
 * Replaced by the hand-built diorama with Kenney/Quaternius characters later.
 */
export function HarborBridge({ inspector = false, markers = false }: { inspector?: boolean; markers?: boolean }) {
  const frame = useMemo(() => {
    const p = assetPosition('Harbor Bridge');
    const { t } = distanceToRiver(p.x, p.z);
    const c = RIVER_CURVE.getPointAt(t);
    const tan = RIVER_CURVE.getTangentAt(t);
    const half = riverHalfWidth(t) + 12;
    const yaw = Math.atan2(tan.x, tan.z); // deck runs across the river: rotate so local x is the river normal
    return { x: c.x, z: c.z, half, yaw: yaw + Math.PI / 2 };
  }, []);

  // piers numbered 1..4 from the north bank (local -x) to the south bank (+x)
  const piers = [-0.6, -0.2, 0.2, 0.6].map((k) => k * frame.half);
  const pier3 = piers[2];
  const pier2 = piers[1];
  const deckY = 7;

  return (
    <group position={[frame.x, 0, frame.z]} rotation={[0, frame.yaw, 0]} name="harbor-bridge">
      {/* deck */}
      <mesh position={[0, deckY, 0]}>
        <boxGeometry args={[frame.half * 2 + 8, 0.8, 7]} />
        <meshStandardMaterial color="#1a2432" roughness={0.9} />
      </mesh>
      {/* deck edge lights */}
      {[-3.3, 3.3].map((z) => (
        <mesh key={z} position={[0, deckY + 0.5, z]}>
          <boxGeometry args={[frame.half * 2 + 8, 0.12, 0.12]} />
          <meshBasicMaterial color="#2fb3c7" toneMapped={false} />
        </mesh>
      ))}
      {/* piers */}
      {piers.map((x, i) => (
        <mesh key={i} position={[x, deckY / 2, 0]}>
          <cylinderGeometry args={[1.4, 1.8, deckY, 10]} />
          <meshStandardMaterial color="#141c28" roughness={1} />
        </mesh>
      ))}
      {/* towers */}
      {[pier2, pier3].map((x, i) => (
        <mesh key={`t${i}`} position={[x, deckY + 9, 0]}>
          <boxGeometry args={[1.2, 18, 1.2]} />
          <meshStandardMaterial color="#1c2736" roughness={0.9} />
        </mesh>
      ))}
      {inspector && <Inspector x={pier3} y={deckY + 0.4} />}
      {markers && (
        <>
          <Marker x={pier3} y={deckY} label="Pier 3" sub="crack · this afternoon" color="#C74634" delayMs={1800} labelY={34} />
          <Marker x={pier2} y={deckY} label="Pier 2" sub="corrosion · next session" color="#8fd3de" delayMs={3000} labelY={20} />
        </>
      )}
    </group>
  );
}

/** A simple figure with a torch: body, head, and a soft cone of light on the pier. */
function Inspector({ x, y }: { x: number; y: number }) {
  const cone = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.SpotLight>(null);
  useFrame(({ clock }) => {
    // the torch sweeps slowly across the bearing: the scene's one ambient motion
    const s = Math.sin(clock.elapsedTime * 0.5) * 0.25;
    if (cone.current) cone.current.rotation.z = -0.9 + s;
    if (light.current) light.current.target.position.set(x + 2.5 + s * 3, y - 4, 0);
  });
  return (
    <group position={[x - 1.6, y, 2.2]}>
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.35, 1.0, 4, 8]} />
        <meshStandardMaterial color="#f0a24a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#ffd9b0" roughness={0.8} />
      </mesh>
      {/* torch cone */}
      <mesh ref={cone} position={[0.4, 1.3, 0]} rotation={[0, 0, -0.9]}>
        <coneGeometry args={[1.6, 5, 24, 1, true]} />
        <meshBasicMaterial color="#ffe6b0" transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <spotLight ref={light} position={[0.4, 1.3, 0]} angle={0.45} penumbra={0.6} intensity={60} distance={14} color="#ffe6b0" />
    </group>
  );
}

function Marker({ x, y, label, sub, color, delayMs, labelY = 26 }: { x: number; y: number; label: string; sub: string; color: string; delayMs: number; labelY?: number }) {
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
      <mesh ref={beam} position={[0, 0, 0]} visible={false} scale={[1, 0, 1]}>
        <cylinderGeometry args={[0.15, 0.15, 44, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.6, 0]} visible={false}>
        <ringGeometry args={[1.6, 2, 40]} />
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
