import { Grid } from '@react-three/drei';
import { useUiStore } from '../engine/ui';

export function Ground() {
  const theme = useUiStore((s) => s.theme);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[2400, 2400]} />
        <meshStandardMaterial color={theme.ground} roughness={1} />
      </mesh>
      {theme.grid && (
        <Grid
          position={[0, 0.02, 0]}
          args={[1600, 1600]}
          cellSize={10}
          sectionSize={50}
          cellColor="#172431"
          sectionColor="#1c3440"
          cellThickness={0.6}
          sectionThickness={1}
          fadeDistance={520}
          fadeStrength={1.6}
          infiniteGrid
        />
      )}
    </>
  );
}
