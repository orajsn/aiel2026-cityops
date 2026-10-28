import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';

/** where the sun sits in the fixed skies, from the middle of the map; Time of day moves it (timeOfDay.ts) */
export const SUN_POS: [number, number, number] = [-180, 90, 120];

/**
 * The sun's shadow area (owner, 28 Oct: on an Intel GPU the live shadows were the largest cost of a frame). It used
 * to be 640 x 640 units around the origin for a map of about 140 x 80; now it is centred on the map (BKK in
 * BangkokCity.tsx) and just covers it for every sun of the day, so a 1024 texture is twice as sharp as the old 2048
 * with a quarter of the texels. tests/world/shadowFit.test.ts keeps the map's corners inside it.
 */
export const SHADOW = { center: [-57.11, 0, -54.04] as [number, number, number], half: 84, size: 1024, near: 10, far: 600 };

/**
 * Whether the shadow texture is redrawn on this frame. The sun's shadows do not depend on the camera, so while the
 * camera moves between pages (owner, 28 Oct: that is where it lagged) every third frame is enough; the cars, the
 * only things moving fast, are too small for their shadows to show it. When the camera holds, every frame.
 */
export const shadowRedraw = (moving: boolean, frame: number) => !moving || frame % 3 === 0;

export function Lighting() {
  const theme = useUiStore((s) => s.theme);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  const sun = useRef<THREE.DirectionalLight>(null);
  const sunGroup = useRef<THREE.Group>(null);
  // the light shines at its target, which must be in the scene: the map's middle
  useEffect(() => {
    const light = sun.current;
    const group = sunGroup.current;
    if (!light || !group) return;
    group.add(light.target);
    light.target.position.set(0, 0, 0);
    return () => void group.remove(light.target);
  }, []);

  const frame = useRef(0);
  useFrame(() => {
    const light = sun.current;
    if (!light) return;
    light.shadow.autoUpdate = false;
    light.shadow.needsUpdate = shadowRedraw(!useSceneStore.getState().settled, frame.current++);
  });

  useEffect(() => {
    gl.toneMapping = theme.toneMapped ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
    gl.shadowMap.enabled = theme.shadows;
    gl.localClippingEnabled = true;
    // plain PCF: the soft variant costs more on every pixel, and the sharper texture keeps the edges soft enough
    gl.shadowMap.type = THREE.PCFShadowMap;
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
      {/* the light and its target sit in a group at the map's middle, so its position is the sun's direction */}
      <group ref={sunGroup} position={SHADOW.center}>
        <directionalLight
          ref={sun}
          name="sun"
          position={SUN_POS}
          intensity={theme.sunIntensity}
          color={theme.sun}
          castShadow={theme.shadows}
          shadow-mapSize={[SHADOW.size, SHADOW.size]}
          shadow-bias={-0.0004}
          shadow-camera-left={-SHADOW.half}
          shadow-camera-right={SHADOW.half}
          shadow-camera-top={SHADOW.half}
          shadow-camera-bottom={-SHADOW.half}
          shadow-camera-near={SHADOW.near}
          shadow-camera-far={SHADOW.far}
        />
      </group>
    </>
  );
}
