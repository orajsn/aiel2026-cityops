import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useUiStore } from '../engine/ui';

/** where the sun sits in the fixed skies; Time of day moves it (timeOfDay.ts) */
export const SUN_POS: [number, number, number] = [-180, 90, 120];

export function Lighting() {
  const theme = useUiStore((s) => s.theme);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    gl.toneMapping = theme.toneMapped ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
    gl.shadowMap.enabled = theme.shadows;
    gl.localClippingEnabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (!m) return;
      (Array.isArray(m) ? m : [m]).forEach((x) => (x.needsUpdate = true));
    });
  }, [gl, scene, theme]);

  return (
    <>
      <ambientLight name="ambient" intensity={theme.ambient} />
      <hemisphereLight name="hemi" args={[theme.hemiSky, theme.hemiGround, theme.hemi]} />
      <directionalLight
        name="sun"
        position={SUN_POS}
        intensity={theme.sunIntensity}
        color={theme.sun}
        castShadow={theme.shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-320}
        shadow-camera-right={320}
        shadow-camera-top={320}
        shadow-camera-bottom={-320}
        shadow-camera-near={10}
        shadow-camera-far={900}
      />
    </>
  );
}
