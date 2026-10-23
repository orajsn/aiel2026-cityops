import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { project } from '../content/geo';
import { LANDMARKS, type Landmark } from './landmarks';

const CREAM = '#f3ecdc';
const GOLD = '#d9b24c';
const ROOF = '#c8522f';
const ROOF2 = '#2f7d5a';
const GLASS = '#6f8fb0';
const CONCRETE = '#d6d9de';
const STEEL = '#4f6a8a';
const GREEN = '#7fbf7a';

/** Stylised Bangkok landmarks in the Kenney palette, placed at their real coordinates. */
export function Landmarks() {
  const items = useMemo(() => LANDMARKS.map((l) => ({ l, p: project(l.lat, l.lon) })), []);
  return (
    <group name="landmarks">
      {items.map(({ l, p }) => (
        <group key={l.id} position={[p.x, 0, p.z]} rotation={[0, l.yaw ?? 0, 0]}>
          <LandmarkMesh l={l} />
        </group>
      ))}
    </group>
  );
}

function LandmarkMesh({ l }: { l: Landmark }) {
  switch (l.kind) {
    case 'prang':
      return <Prang />;
    case 'palace':
      return <Palace />;
    case 'goldMount':
      return <GoldMount />;
    case 'pixelTower':
      return <PixelTower />;
    case 'spireTower':
      return <SpireTower />;
    case 'obelisk':
      return <Obelisk />;
    case 'pylon':
      return <Pylon />;
    case 'crane':
      return <Crane />;
    case 'park':
      return <Park />;
    case 'wheel':
      return <Wheel />;
    case 'dome':
      return <DomeTower />;
    case 'twin':
      return <TwinTowers />;
    case 'hotel':
      return <Hotel />;
  }
}

function Box({ p, s, c, shadow = true }: { p: [number, number, number]; s: [number, number, number]; c: string; shadow?: boolean }) {
  return (
    <mesh position={p} castShadow={shadow} receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={0.95} />
    </mesh>
  );
}

/** Wat Arun: a tall central prang on a terrace, four small prangs around it. */
function Prang() {
  const tiers = [
    [1.6, 0.5],
    [1.3, 0.6],
    [1.0, 0.7],
    [0.75, 0.8],
    [0.5, 1.0],
    [0.28, 0.9],
  ];
  let y = 0.4;
  const main = tiers.map(([r, h], i) => {
    const el = (
      <mesh key={i} position={[0, y + h / 2, 0]} castShadow>
        <cylinderGeometry args={[r * 0.82, r, h, 8]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
    );
    y += h;
    return el;
  });
  const small = [
    [1.9, 1.9],
    [-1.9, 1.9],
    [1.9, -1.9],
    [-1.9, -1.9],
  ] as const;
  return (
    <group>
      <Box p={[0, 0.2, 0]} s={[5.4, 0.4, 5.4]} c={CONCRETE} />
      {main}
      <mesh position={[0, y + 0.35, 0]} castShadow>
        <coneGeometry args={[0.22, 0.7, 8]} />
        <meshStandardMaterial color={GOLD} roughness={0.5} metalness={0.3} />
      </mesh>
      {small.map(([x, z], i) => (
        <group key={i} position={[x, 0.4, z]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.55, 1.8, 8]} />
            <meshStandardMaterial color={CREAM} roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.0, 0]}>
            <coneGeometry args={[0.14, 0.5, 8]} />
            <meshStandardMaterial color={GOLD} roughness={0.5} metalness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** A tiered temple roof hall: body, two roof tiers, a gable ridge. */
function Hall({ p, w, d, roof }: { p: [number, number, number]; w: number; d: number; roof: string }) {
  return (
    <group position={p}>
      <Box p={[0, 0.5, 0]} s={[w, 1, d]} c={CREAM} />
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[w * 1.1, 0.7, d * 1.15]} />
        <meshStandardMaterial color={roof} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <boxGeometry args={[w * 0.7, 0.5, d * 0.8]} />
        <meshStandardMaterial color={roof} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.35, 0]} castShadow>
        <boxGeometry args={[w * 0.35, 0.3, d * 0.55]} />
        <meshStandardMaterial color={GOLD} roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}

/** Grand Palace and Wat Phra Kaew: a white wall, halls with orange and green roofs, a gold chedi. */
function Palace() {
  return (
    <group>
      <Box p={[0, 0.15, 0]} s={[8.5, 0.3, 7]} c={CONCRETE} />
      <Box p={[0, 0.5, -3.4]} s={[8.5, 0.6, 0.2]} c={CREAM} />
      <Box p={[0, 0.5, 3.4]} s={[8.5, 0.6, 0.2]} c={CREAM} />
      <Box p={[-4.2, 0.5, 0]} s={[0.2, 0.6, 7]} c={CREAM} />
      <Box p={[4.2, 0.5, 0]} s={[0.2, 0.6, 7]} c={CREAM} />
      <Hall p={[-2.2, 0.3, -1.2]} w={2.6} d={1.6} roof={ROOF} />
      <Hall p={[1.4, 0.3, 1.4]} w={3.2} d={1.8} roof={ROOF2} />
      <Hall p={[2.3, 0.3, -1.6]} w={1.8} d={1.2} roof={ROOF} />
      <group position={[-2.3, 0.3, 1.8]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.9, 1.8, 16]} />
          <meshStandardMaterial color={GOLD} roughness={0.45} metalness={0.4} />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <coneGeometry args={[0.55, 1.6, 16]} />
          <meshStandardMaterial color={GOLD} roughness={0.45} metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/** Golden Mount: a green hill with a gold chedi on top. */
function GoldMount() {
  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[2.4, 1.8, 10]} />
        <meshStandardMaterial color={GREEN} roughness={1} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.6, 0.8, 16]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[0.45, 1.4, 16]} />
        <meshStandardMaterial color={GOLD} roughness={0.45} metalness={0.4} />
      </mesh>
    </group>
  );
}

/** MahaNakhon: a glass tower with a spiral of missing "pixels". */
function PixelTower() {
  const notches: [number, number, number][] = [
    [0.55, 2.0, 0.55],
    [-0.55, 3.4, 0.55],
    [-0.55, 4.8, -0.55],
    [0.55, 6.2, -0.55],
    [0.55, 7.6, 0.55],
    [-0.55, 8.6, 0.55],
  ];
  return (
    <group>
      <Box p={[0, 5, 0]} s={[2.0, 10, 2.0]} c={GLASS} />
      {notches.map((n, i) => (
        <Box key={i} p={n} s={[1.0, 0.8, 1.0]} c={CONCRETE} />
      ))}
      <Box p={[0, 10.25, 0]} s={[1.2, 0.5, 1.2]} c={CONCRETE} />
    </group>
  );
}

/** Baiyoke Tower II: slim tower, crown and antenna. */
function SpireTower() {
  return (
    <group>
      <Box p={[0, 5.5, 0]} s={[1.5, 11, 1.5]} c={'#c9b8a6'} />
      <mesh position={[0, 11.4, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.8, 16]} />
        <meshStandardMaterial color={GOLD} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 13.2, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 3, 8]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Victory Monument: an obelisk on a round base in a roundabout. */
function Obelisk() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.0, 0.3, 32]} />
        <meshStandardMaterial color={GREEN} roughness={1} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1.0, 0.5, 16]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.32, 3.8, 4]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Rama VIII: a single inverted-Y pylon with a fan of cables. */
function Pylon() {
  const cables = Array.from({ length: 7 }, (_, i) => [[0, 6.5 - i * 0.35, 0], [2.2 + i * 1.1, 1.6, 0]] as [number, number, number][]);
  return (
    <group>
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[0.5, 7, 0.9]} />
        <meshStandardMaterial color={GOLD} roughness={0.6} metalness={0.2} />
      </mesh>
      {cables.map((pts, i) => (
        <Line key={i} points={pts} color="#e8d8a6" lineWidth={1} />
      ))}
      {cables.map((pts, i) => (
        <Line key={`m${i}`} points={[pts[0], [-pts[1][0], pts[1][1], pts[1][2]]]} color="#e8d8a6" lineWidth={1} />
      ))}
    </group>
  );
}

/** A port gantry crane: two legs, a beam, a boom over the water. */
function Crane() {
  return (
    <group scale={1.5}>
      <Box p={[-1.0, 1.6, 0]} s={[0.25, 3.2, 0.25]} c={STEEL} />
      <Box p={[1.0, 1.6, 0]} s={[0.25, 3.2, 0.25]} c={STEEL} />
      <Box p={[-1.0, 1.6, 0.9]} s={[0.25, 3.2, 0.25]} c={STEEL} />
      <Box p={[1.0, 1.6, 0.9]} s={[0.25, 3.2, 0.25]} c={STEEL} />
      <Box p={[0, 3.3, 0.45]} s={[2.6, 0.3, 1.2]} c={STEEL} />
      <Box p={[0, 3.55, -1.4]} s={[0.3, 0.3, 4.2]} c={STEEL} />
      <Box p={[0, 4.1, 0.45]} s={[0.6, 0.8, 0.6]} c={STEEL} />
    </group>
  );
}

/** Lumphini Park: a green lawn with a pond and a ring of trees. */
function Park() {
  const trees = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return [Math.cos(a) * 4.6, Math.sin(a) * 3.6] as const;
  });
  return (
    <group>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[5.6, 5.6, 0.16, 40]} />
        <meshStandardMaterial color={GREEN} roughness={1} />
      </mesh>
      <mesh position={[0.8, 0.17, -0.4]}>
        <cylinderGeometry args={[1.8, 1.8, 0.06, 32]} />
        <meshStandardMaterial color="#9CC5D4" roughness={0.6} />
      </mesh>
      {trees.map(([x, z], i) => (
        <group key={i} position={[x, 0.16, z]}>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.7, 6]} />
            <meshStandardMaterial color="#8a6a4a" roughness={1} />
          </mesh>
          <mesh position={[0, 0.95, 0]} castShadow>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshStandardMaterial color="#4f9a5c" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Asiatique: a Ferris wheel on the riverbank. */
function Wheel() {
  const spokes = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);
  return (
    <group position={[0, 0, 0]}>
      {[-0.6, 0.6].map((z) => (
        <mesh key={z} position={[0, 1.4, z]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[0.5, 2.8, 4]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.9} />
        </mesh>
      ))}
      <group position={[0, 3.0, 0]}>
        <mesh castShadow>
          <torusGeometry args={[2.6, 0.08, 8, 48]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {spokes.map((a, i) => (
          <mesh key={i} rotation={[0, 0, a]} position={[Math.cos(a) * 1.3, Math.sin(a) * 1.3, 0]}>
            <boxGeometry args={[2.6, 0.05, 0.05]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
        ))}
        {spokes.map((a, i) => (
          <mesh key={`c${i}`} position={[Math.cos(a) * 2.6, Math.sin(a) * 2.6, 0]} castShadow>
            <boxGeometry args={[0.32, 0.32, 0.32]} />
            <meshStandardMaterial color={i % 2 ? ROOF : GOLD} roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** State Tower: a tower with a gold dome on top. */
function DomeTower() {
  return (
    <group>
      <Box p={[0, 4.2, 0]} s={[2.2, 8.4, 2.2]} c={CREAM} />
      <mesh position={[0, 8.6, 0]} castShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.5, 20]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
      <mesh position={[0, 8.85, 0]} castShadow>
        <sphereGeometry args={[1.0, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  );
}

/** ICONSIAM: two slab towers on a long podium by the river. */
function TwinTowers() {
  return (
    <group>
      <Box p={[0, 0.6, 0]} s={[6.5, 1.2, 2.6]} c={CREAM} />
      <Box p={[-1.8, 5.0, 0]} s={[1.6, 8.8, 1.6]} c={GLASS} />
      <Box p={[1.8, 4.2, 0]} s={[1.6, 7.2, 1.6]} c={GLASS} />
    </group>
  );
}

/** A big riverside hotel: a curved tower with a wide base. */
function Hotel() {
  return (
    <group>
      <Box p={[0, 0.5, 0]} s={[4, 1, 2.2]} c={CREAM} />
      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.6, 7.4, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={'#e8d6c2'} roughness={0.9} side={2} />
      </mesh>
      <Box p={[0, 4.2, -0.05]} s={[3.2, 7.4, 0.3]} c={'#e8d6c2'} />
    </group>
  );
}
