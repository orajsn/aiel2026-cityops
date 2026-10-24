import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Billboard } from '@react-three/drei';

/**
 * The references: a folder (blue back, orange front) with white report sheets fanning out of it, each sheet
 * lines of text with green ticks, the way the owner sketched it. `sheets` says which reports have arrived;
 * `strain` swells it (Lab 2 page 4: three questions do not fit in one folder). Always faces the camera.
 */
export function ReferenceFolder({ sheets, opacity = 1, strain = 0 }: { sheets: boolean[]; opacity?: number; strain?: number }) {
  const tex = useMemo(() => sheetTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  const n = sheets.length;
  return (
    <Billboard>
      <group scale={[1 + strain * 0.25, 1 + strain * 0.18, 1]} visible={opacity > 0.01}>
        {/* the folder's back, with its tab */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[1.25, 0.95, 0.03]} />
          <meshStandardMaterial color="#3d7fc4" roughness={0.7} transparent opacity={opacity} />
        </mesh>
        <mesh position={[-0.38, 0.5, -0.05]}>
          <boxGeometry args={[0.42, 0.1, 0.03]} />
          <meshStandardMaterial color="#3d7fc4" roughness={0.7} transparent opacity={opacity} />
        </mesh>
        {/* the sheets, fanned */}
        {sheets.map((on, i) => (
          <mesh key={i} position={[-0.18 + i * 0.1, 0.02 + (i % 2) * 0.02, 0.01 + i * 0.012]} rotation={[0, 0, (i - (n - 1) / 2) * -0.06]} visible={on}>
            <planeGeometry args={[0.66, 0.84]} />
            <meshBasicMaterial map={tex} transparent opacity={opacity} toneMapped={false} />
          </mesh>
        ))}
        {/* the folder's front flap, over the sheets' lower left */}
        <mesh position={[-0.33, -0.12, 0.01 + n * 0.012 + 0.01]} rotation={[0, 0, 0.06]}>
          <boxGeometry args={[0.72, 0.78, 0.02]} />
          <meshStandardMaterial color="#f0a93b" roughness={0.75} transparent opacity={opacity} />
        </mesh>
        <mesh position={[-0.33, 0.2, 0.01 + n * 0.012 + 0.03]} rotation={[0, 0, 0.06]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshBasicMaterial color="#e58f2a" transparent opacity={opacity} toneMapped={false} />
        </mesh>
      </group>
    </Billboard>
  );
}

/** a report sheet: lines of text and three green ticks */
function sheetTexture() {
  const W = 256;
  const H = 326;
  const c = Object.assign(document.createElement('canvas'), { width: W, height: H });
  const g = c.getContext('2d')!;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#c3c9cf';
  const lines = [0.7, 0.9, 0.55, 0.85, 0.8, 0.6, 0.9, 0.75, 0.5];
  lines.forEach((w, i) => {
    const y = 28 + i * 30;
    const tick = i >= 2 && i <= 4;
    g.fillStyle = '#c3c9cf';
    g.fillRect(tick ? 54 : 24, y, (W - 48) * w - (tick ? 30 : 0), 10);
    if (tick) {
      g.fillStyle = '#2fa84f';
      g.beginPath();
      g.arc(34, y + 5, 11, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = '#ffffff';
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(28, y + 5);
      g.lineTo(32, y + 9);
      g.lineTo(40, y + 1);
      g.stroke();
    }
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
