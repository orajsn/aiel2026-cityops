import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import { useUiStore } from '../engine/ui';
import { harborBridgeFrame } from './bridgeFrame';
import { KIT } from './kitLayout';

const DECK_TILE = 2.6; // road-bridge tile is 1 unit
const DECK_Y = 1.3;

/**
 * Harbor Bridge: Kenney road-bridge tiles on bridge-pillar piers across the river,
 * an inspector with a torch at Pier 3, and the two incident markers.
 */
export function HarborBridge({ inspector = false, markers = false }: { inspector?: boolean; markers?: boolean }) {
  const frame = useMemo(() => harborBridgeFrame(), []);
  const [deck, pillar] = useGLTF([`${KIT}/roads/road-bridge.glb`, `${KIT}/roads/bridge-pillar.glb`]);

  const tiles = useMemo(() => {
    const n = Math.ceil((frame.half * 2) / DECK_TILE);
    return Array.from({ length: n }, (_, i) => -frame.half + DECK_TILE / 2 + i * DECK_TILE);
  }, [frame.half]);
  const deckClones = useMemo(() => tiles.map(() => deck.scene.clone()), [tiles, deck]);
  const pillarClones = useMemo(() => Array.from({ length: 8 }, () => pillar.scene.clone()), [pillar]);

  // piers numbered 1..4 from the north bank (local -x) to the south bank (+x)
  const piers = [-0.6, -0.2, 0.2, 0.6].map((k) => k * frame.half);
  const pier3 = piers[2];
  const pier2 = piers[1];
  const theme = useUiStore((s) => s.theme);

  return (
    <group position={[frame.x, 0, frame.z]} rotation={[0, frame.yaw, 0]} name="harbor-bridge">
      {tiles.map((x, i) => (
        <primitive key={x} object={deckClones[i]} position={[x, DECK_Y - 0.5, 0]} rotation={[0, Math.PI / 2, 0]} scale={DECK_TILE} />
      ))}
      {piers.map((x, i) =>
        [-0.9, 0.9].map((z, j) => (
          <primitive key={`${i}-${j}`} object={pillarClones[i * 2 + j]} position={[x, -0.2, z]} scale={[9, (DECK_Y + 0.2) * 2, 9]} />
        )),
      )}
      {inspector && <Inspector x={pier3} y={DECK_Y + 0.3} />}
      {markers && (
        <>
          <Marker x={pier3} y={DECK_Y} label="Pier 3" sub="crack · this afternoon" color={theme.red} delayMs={1800} labelY={16} />
          <Marker x={pier2} y={DECK_Y} label="Pier 2" sub="corrosion · next session" color={theme.data} delayMs={3000} labelY={10} />
        </>
      )}
    </group>
  );
}

useGLTF.preload?.([`${KIT}/roads/road-bridge.glb`, `${KIT}/roads/bridge-pillar.glb`]);

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
    <group position={[x - 0.8, y, 1.1]} scale={0.6}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.35, 1.0, 4, 8]} />
        <meshStandardMaterial color="#f0a24a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#ffd9b0" roughness={0.8} />
      </mesh>
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
      <mesh ref={beam} visible={false} scale={[1, 0, 1]}>
        <cylinderGeometry args={[0.12, 0.12, 22, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.6, 0]} visible={false}>
        <ringGeometry args={[1.0, 1.3, 40]} />
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
