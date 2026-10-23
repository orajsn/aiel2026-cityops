import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Ground } from './Ground';
import { River } from './RiverMesh';
import { buildingLayout } from './cityLayout';

const BUILDING_VERT = /* glsl */ `
  #include <fog_pars_vertex>
  varying vec3 vN;
  varying vec3 vView;
  varying float vH;
  void main() {
    vH = position.y;
    vec4 wp = instanceMatrix * vec4(position, 1.0);
    vN = normalize(mat3(instanceMatrix) * normal);
    vec4 mvPosition = modelViewMatrix * wp;
    vView = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const BUILDING_FRAG = /* glsl */ `
  #include <fog_pars_fragment>
  uniform vec3 uBase;
  uniform vec3 uTop;
  uniform vec3 uGlow;
  varying vec3 vN;
  varying vec3 vView;
  varying float vH;
  void main() {
    vec3 n = normalize(vN);
    vec3 v = normalize(vView);
    vec3 body = mix(uBase, uTop, smoothstep(0.0, 1.0, vH));
    float top = step(0.5, n.y);
    vec3 col = mix(body, uTop * 1.25, top);
    float side = 0.85 + 0.15 * max(0.0, dot(n, normalize(vec3(0.4, 0.2, 0.9))));
    col *= side;
    float rim = pow(1.0 - max(0.0, dot(n, v)), 3.0);
    col += uGlow * rim * 0.32 * (1.0 - top);
    col += uGlow * 0.08 * vH;
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;

export function ProceduralCity() {
  const buildings = useMemo(() => buildingLayout(), []);

  const { boxGeo, edgesGeo, count } = useMemo(() => {
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    boxGeo.translate(0, 0.5, 0);
    const edgePos: number[] = [];
    const corner = (b: (typeof buildings)[number], sx: number, sy: number, sz: number) => [
      b.x + (sx * b.w) / 2,
      sy * b.h,
      b.z + (sz * b.d) / 2,
    ];
    for (const b of buildings) {
      const c = [
        corner(b, -1, 0, -1), corner(b, 1, 0, -1), corner(b, 1, 0, 1), corner(b, -1, 0, 1),
        corner(b, -1, 1, -1), corner(b, 1, 1, -1), corner(b, 1, 1, 1), corner(b, -1, 1, 1),
      ];
      const e = [
        [4, 5], [5, 6], [6, 7], [7, 4], // top ring
        [0, 4], [1, 5], [2, 6], [3, 7], // verticals
      ];
      for (const [a, k] of e) edgePos.push(...c[a], ...c[k]);
    }
    const edgesGeo = new THREE.BufferGeometry();
    edgesGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePos, 3));
    return { boxGeo, edgesGeo, count: buildings.length };
  }, [buildings]);

  const inst = useRef<THREE.InstancedMesh>(null);
  const setInstances = (m: THREE.InstancedMesh | null) => {
    if (!m) return;
    (inst as React.MutableRefObject<THREE.InstancedMesh | null>).current = m;
    const mat = new THREE.Matrix4();
    buildings.forEach((b, i) => {
      mat.makeScale(b.w, b.h, b.d);
      mat.setPosition(b.x, 0, b.z);
      m.setMatrixAt(i, mat);
    });
    m.instanceMatrix.needsUpdate = true;
  };

  const buildingMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BUILDING_VERT,
        fragmentShader: BUILDING_FRAG,
        fog: true,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          {
            uBase: { value: new THREE.Color('#0e141d') },
            uTop: { value: new THREE.Color('#1c2a3a') },
            uGlow: { value: new THREE.Color('#1B8A9C') },
          },
        ]),
      }),
    [],
  );


  return (
    <group name="procedural-city-root">
      <Ground />
      <River />
      <instancedMesh
        name="procedural-city"
        ref={setInstances}
        args={[boxGeo, buildingMat, count]}
        frustumCulled={false}
      />
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#2d8a9b" transparent opacity={0.38} fog />
      </lineSegments>
    </group>
  );
}
