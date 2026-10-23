import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ASSETS, project, type Asset, type AssetType } from '../content/geo';
import { pinColor, TYPE_ORDER } from './pinColors';
import { PinCard } from './PinCard';

export interface AssetPinsProps {
  visible: AssetType[] | 'all';
  highlight?: string[];
  onHover?: (id: string | null) => void;
  /** ms between each type group rising; each pin inside a group staggers 60 ms. */
  groupStaggerMs?: number;
}

const PIN_H = 10;

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

interface PinAnim {
  asset: Asset;
  x: number;
  z: number;
  color: string;
  startMs: number; // when this pin starts rising (performance.now based)
}

export function AssetPins({ visible, highlight = [], onHover, groupStaggerMs = 700 }: AssetPinsProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const highlightSet = useMemo(() => new Set(highlight), [highlight]);

  const visibleTypes = useMemo<AssetType[]>(
    () => (visible === 'all' ? TYPE_ORDER : TYPE_ORDER.filter((t) => visible.includes(t))),
    [visible],
  );

  // schedule rise times when the visible set changes
  const pins = useMemo<PinAnim[]>(() => {
    const now = performance.now();
    const out: PinAnim[] = [];
    visibleTypes.forEach((type, gi) => {
      const group = ASSETS.filter((a) => a.type === type);
      group.forEach((asset, i) => {
        const p = project(asset.lat, asset.lon);
        out.push({ asset, x: p.x, z: p.z, color: pinColor(asset.type), startMs: now + gi * groupStaggerMs + i * 60 });
      });
    });
    return out;
  }, [visibleTypes, groupStaggerMs]);

  useEffect(() => {
    onHover?.(hovered);
  }, [hovered, onHover]);

  return (
    <group name="asset-pins">
      {pins.map((p) => (
        <Pin
          key={p.asset.id}
          pin={p}
          hot={highlightSet.has(p.asset.id)}
          hovered={hovered === p.asset.id}
          onHover={setHovered}
        />
      ))}
      {pins
        .filter((p) => p.asset.id === hovered)
        .map((p) => (
          <PinCard key={`card-${p.asset.id}`} asset={p.asset} position={[p.x + 3, PIN_H + 6, p.z]} />
        ))}
    </group>
  );
}

function Pin({
  pin,
  hot,
  hovered,
  onHover,
}: {
  pin: PinAnim;
  hot: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const head = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(pin.color), [pin.color]);
  const scaleRef = useRef(0);

  useFrame(({ clock }) => {
    const t = (performance.now() - pin.startMs) / 650;
    const s = t <= 0 ? 0 : t >= 1 ? 1 : easeOutBack(t);
    scaleRef.current = s;
    if (group.current) {
      group.current.scale.set(s, s, s);
      group.current.visible = s > 0.001;
    }
    // one slow ripple per pin, offset by position so they do not pulse together
    const phase = (clock.elapsedTime * 0.45 + (pin.x + pin.z) * 0.01) % 1;
    if (ring.current && ringMat.current) {
      const r = 1 + phase * (hot ? 4 : 2.2);
      ring.current.scale.set(r, r, 1);
      ringMat.current.opacity = (1 - phase) * (hot ? 0.9 : 0.35) * s;
    }
    if (head.current) {
      const m = head.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = hovered ? 2.2 : hot ? 1.8 : 1.1;
    }
  });

  const r = hot ? 1.35 : 1;
  return (
    <group ref={group} position={[pin.x, 0, pin.z]} scale={0}>
      {/* ground ring */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
        <ringGeometry args={[2.2, 2.6, 48]} />
        <meshBasicMaterial ref={ringMat} color={color} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {/* stem */}
      <mesh position={[0, PIN_H / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.12, PIN_H, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      {/* head */}
      <mesh
        ref={head}
        position={[0, PIN_H, 0]}
        scale={r}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(pin.asset.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = '';
        }}
      >
        <sphereGeometry args={[1.3, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} roughness={0.4} />
      </mesh>
      {/* larger invisible hit target */}
      <mesh
        position={[0, PIN_H, 0]}
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(pin.asset.id);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[3.2, 8, 8]} />
      </mesh>
    </group>
  );
}
