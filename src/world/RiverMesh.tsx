import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useUiStore } from '../engine/ui';
import { riverGeometry } from './river';

const WATER_VERT = /* glsl */ `
  #include <fog_pars_vertex>
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const WATER_FRAG = /* glsl */ `
  #include <fog_pars_fragment>
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uGlow;
  uniform float uStrength;
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    float n = sin(vPos.x * 0.35 + uTime * 0.5) * sin(vPos.z * 0.21 - uTime * 0.33);
    float lines = smoothstep(0.90, 1.0, sin((vPos.z * 0.9 + vPos.x * 0.35) + uTime * 0.9 + n * 2.5));
    float across = abs(vUv.x - 0.5) * 2.0;
    float shore = smoothstep(0.55, 1.0, across);
    vec3 col = mix(uBase, uGlow, (0.10 + 0.10 * lines) * uStrength);
    col = mix(col, uGlow, shore * 0.45 * uStrength);
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;

/** The Chao Phraya as a flat ribbon with one slow shimmer: the scene's ambient motion. */
export function River() {
  const theme = useUiStore((s) => s.theme);
  const geo = useMemo(() => riverGeometry(), []);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: WATER_VERT,
        fragmentShader: WATER_FRAG,
        fog: true,
        side: THREE.DoubleSide,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          {
            uTime: { value: 0 },
            uBase: { value: new THREE.Color() },
            uGlow: { value: new THREE.Color() },
            uStrength: { value: 1 },
          },
        ]),
      }),
    [],
  );
  useEffect(() => {
    mat.uniforms.uBase.value.set(theme.waterBase);
    mat.uniforms.uGlow.value.set(theme.waterGlow);
    mat.uniforms.uStrength.value = theme.name === 'light' ? 1.6 : 1;
  }, [mat, theme]);
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
  });
  return <mesh name="water" geometry={geo} material={mat} position={[0, 0.06, 0]} receiveShadow />;
}
