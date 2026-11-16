import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import { useGraphicsStore } from '../engine/graphics';
import { QUALITY, useQualityStore, type Quality } from '../engine/quality';

export const SUN_POS: [number, number, number] = [-180, 220, 120];
export const SHADOW = { center: [-38, 0, -20] as [number, number, number], half: 65, size: 2048, near: 1, far: 650 };
export const shadowRedraw = (_moving: boolean, frame: number, preset: Quality = 'balanced'): boolean => frame % QUALITY[preset].shadowEvery === 0;

/** A stable texel grid follows the visible ground instead of spreading detail across the district. */
export function fitShadowFrustum(position: THREE.Vector3, direction: THREE.Vector3, size: number) {
  const height = Math.max(.5, position.y);
  const travel = direction.y < -.08 ? Math.max(0, position.y / -direction.y) : height * 2;
  const half = THREE.MathUtils.clamp(height * 1.2 + 5, 5, 180);
  const texel = half * 2 / size;
  return { half, center: new THREE.Vector3(
    Math.round((position.x + direction.x * Math.min(travel, 300)) / texel) * texel,
    0,
    Math.round((position.z + direction.z * Math.min(travel, 300)) / texel) * texel,
  ) };
}

/** Generated reflection studio; no downloaded HDR or runtime network dependency. */
function makeEnvironment(gl: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const room = new THREE.Scene();
  const resources: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>[] = [];
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(40, 32, 16), new THREE.MeshBasicMaterial({ color: '#c8d6dc', side: THREE.BackSide }));
  room.add(sphere); resources.push(sphere);
  const panel = (x: number, y: number, z: number, w: number, height: number, color: string, power: number) => {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power) });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, height), material);
    mesh.position.set(x, y, z); mesh.lookAt(0, 0, 0); room.add(mesh); resources.push(mesh);
  };
  panel(-12, 14, 6, 12, 16, '#fff4de', 3.2);
  panel(14, 8, -8, 11, 16, '#d8edff', 1.7);
  panel(0, 24, 0, 20, 20, '#ffffff', 2.4);
  const pmrem = new THREE.PMREMGenerator(gl);
  const target = pmrem.fromScene(room, .08, .1, 100);
  pmrem.dispose();
  resources.forEach(mesh => { mesh.geometry.dispose(); mesh.material.dispose(); });
  return target;
}

export function Lighting() {
  const theme = useUiStore(s => s.theme);
  const preset = useQualityStore(s => s.preset);
  const q = QUALITY[preset];
  const { gl, scene, camera } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);
  const group = useRef<THREE.Group>(null);
  const frame = useRef(0);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const lastBuffer = useRef('');
  useEffect(() => {
    const target = makeEnvironment(gl), previous = scene.environment;
    scene.environment = target.texture;
    return () => { scene.environment = previous; target.dispose(); };
  }, [gl, scene]);
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = theme.name === 'night' ? .85 : 1.05;
    gl.shadowMap.enabled = theme.shadows;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.localClippingEnabled = true;
    scene.environmentIntensity = theme.name === 'night' ? .16 : .35;
    scene.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials: THREE.Material[] = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => { material.needsUpdate = true; });
    });
  }, [gl, scene, theme]);
  useEffect(() => {
    const light = sun.current, parent = group.current;
    if (!light || !parent) return;
    parent.add(light.target); light.target.position.set(0, 0, 0);
    return () => { parent.remove(light.target); };
  }, []);
  useEffect(() => {
    const light = sun.current;
    if (!light) return;
    light.shadow.map?.dispose(); light.shadow.map = null;
    light.shadow.mapSize.set(q.shadowSize, q.shadowSize); light.shadow.needsUpdate = true;
  }, [q.shadowSize]);
  useFrame(() => {
    const buffer = `${gl.domElement.width}x${gl.domElement.height}`;
    if (buffer !== lastBuffer.current) {
      lastBuffer.current = buffer;
      useGraphicsStore.getState().setActualBuffer({ w: gl.domElement.width, h: gl.domElement.height, antialias: !!gl.getContext().getContextAttributes()?.antialias });
    }
    const light = sun.current, parent = group.current;
    if (!light || !parent) return;
    light.castShadow = theme.shadows && !useSceneStore.getState().current().world?.core;
    camera.getWorldDirection(direction);
    const fit = fitShadowFrustum(camera.position, direction, q.shadowSize);
    parent.position.copy(fit.center);
    const shadowCamera = light.shadow.camera;
    if (Math.abs(shadowCamera.right - fit.half) > .1) {
      shadowCamera.left = shadowCamera.bottom = -fit.half;
      shadowCamera.right = shadowCamera.top = fit.half;
      shadowCamera.updateProjectionMatrix();
    }
    light.shadow.autoUpdate = false;
    light.shadow.needsUpdate = shadowRedraw(!useSceneStore.getState().settled, frame.current++, preset);
  });
  return <>
    <ambientLight name="ambient" intensity={theme.ambient * .60} />
    <hemisphereLight name="hemi" args={[theme.hemiSky, theme.hemiGround, theme.hemi * .70]} />
    <group ref={group} position={SHADOW.center}>
      <directionalLight ref={sun} name="sun" position={SUN_POS} color={theme.sun} intensity={theme.sunIntensity} castShadow={theme.shadows}
        shadow-mapSize={[q.shadowSize, q.shadowSize]} shadow-bias={-.00008} shadow-normalBias={.003}
        shadow-camera-left={-SHADOW.half} shadow-camera-right={SHADOW.half} shadow-camera-top={SHADOW.half} shadow-camera-bottom={-SHADOW.half}
        shadow-camera-near={SHADOW.near} shadow-camera-far={SHADOW.far} />
    </group>
  </>;
}
