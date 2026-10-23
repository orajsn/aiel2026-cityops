import { useMemo } from 'react';
import * as THREE from 'three';
import { Grid } from '@react-three/drei';
import { useUiStore } from '../engine/ui';
import { CITY_BOUNDS } from './cityLayout';

export const SLAB_THICKNESS = 6;
const MARGIN = 8;

/** The slab the city stands on: top face is the ground, the sides show when the camera drops below it. */
export const SLAB = {
  w: CITY_BOUNDS.maxX - CITY_BOUNDS.minX + MARGIN * 2,
  d: CITY_BOUNDS.maxZ - CITY_BOUNDS.minZ + MARGIN * 2,
  cx: (CITY_BOUNDS.maxX + CITY_BOUNDS.minX) / 2,
  cz: (CITY_BOUNDS.maxZ + CITY_BOUNDS.minZ) / 2,
};

const SKY_VERT = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const SKY_FRAG = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  varying vec3 vPos;
  void main() {
    float h = normalize(vPos).y;
    float k = smoothstep(-0.05, 0.45, h);
    gl_FragColor = vec4(mix(uHorizon, uTop, k), 1.0);
  }
`;

/**
 * Ground: the slab, plus a sky dome and a far ground plane so a low camera sees a horizon
 * instead of the slab's edge. The far plane is single-sided, so from under the slab it vanishes.
 */
/** Sky dome and the far ground plane fading into the haze. */
/** `ground: false` drops the far ground plane, e.g. when the camera looks below street level at the database. */
export function SkyAndHorizon({ ground = true }: { ground?: boolean }) {
  const theme = useUiStore((s) => s.theme);
  const sky = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { uTop: { value: new THREE.Color(theme.skyTop) }, uHorizon: { value: new THREE.Color(theme.skyHorizon) } },
      }),
    [theme.skyTop, theme.skyHorizon],
  );
  return (
    <>
      <mesh material={sky} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[1800, 32, 16]} />
      </mesh>
      {ground && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} name="far-ground">
          <circleGeometry args={[2400, 48]} />
          <meshBasicMaterial color={theme.bg} />
        </mesh>
      )}
    </>
  );
}

export function Ground() {
  const theme = useUiStore((s) => s.theme);
  const materials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ color: theme.slabEdge, roughness: 1 });
    const top = new THREE.MeshStandardMaterial({ color: theme.ground, roughness: 1 });
    return [side, side, top, side, side, side];
  }, [theme.slabEdge, theme.ground]);
  const sky = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { uTop: { value: new THREE.Color(theme.skyTop) }, uHorizon: { value: new THREE.Color(theme.skyHorizon) } },
      }),
    [theme.skyTop, theme.skyHorizon],
  );
  return (
    <>
      <mesh material={sky} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[1800, 32, 16]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <circleGeometry args={[2400, 48]} />
        <meshBasicMaterial color={theme.bg} />
      </mesh>
      <mesh position={[SLAB.cx, -SLAB_THICKNESS / 2 - 0.05, SLAB.cz]} material={materials} receiveShadow name="slab">
        <boxGeometry args={[SLAB.w, SLAB_THICKNESS, SLAB.d]} />
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
