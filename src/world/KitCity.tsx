import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useUiStore } from '../engine/ui';
import { ALL_MODELS, KIT, kitLayout, type Placement } from './kitLayout';
import { River } from './RiverMesh';
import { Ground } from './Ground';
import { Roads } from './RoadsMesh';
import { Landmarks } from './LandmarksMesh';
import { Boats } from './Boats';
import { HarborBridge } from './HarborBridge';
import { useSceneStore } from '../engine/store';
import { BangkokCity } from './BangkokCity';

/** One merged geometry + material per kit model, so each model is a single InstancedMesh. */
function useKitModels() {
  const gltfs = useGLTF(ALL_MODELS.map((m) => `${KIT}/${m}`));
  return useMemo(() => {
    const out = new Map<string, { geometry: THREE.BufferGeometry; material: THREE.Material; footprint: number }>();
    gltfs.forEach((g, i) => {
      const geos: THREE.BufferGeometry[] = [];
      let material: THREE.Material | null = null;
      g.scene.updateMatrixWorld(true);
      g.scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const geo = m.geometry.clone();
        geo.applyMatrix4(m.matrixWorld);
        // keep only the attributes every primitive shares
        for (const name of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(name)) geo.deleteAttribute(name);
        geos.push(geo);
        if (!material) material = Array.isArray(m.material) ? m.material[0] : m.material;
      });
      if (!geos.length || !material) return;
      const merged = geos.length === 1 ? geos[0] : mergeGeometries(geos, false)!;
      merged.computeBoundingBox();
      const bb = merged.boundingBox!;
      const footprint = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z);
      out.set(ALL_MODELS[i], { geometry: merged, material, footprint });
    });
    return out;
  }, [gltfs]);
}

const tmp = new THREE.Object3D();

function Instanced({ model, items, geometry, material, footprint }: { model: string; items: Placement[]; geometry: THREE.BufferGeometry; material: THREE.Material; footprint: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const theme = useUiStore((s) => s.theme);
  const mat = useMemo(() => {
    const m = (material as THREE.MeshStandardMaterial).clone();
    m.color = new THREE.Color(theme.buildingTint);
    m.roughness = 0.95;
    m.metalness = 0;
    return m;
  }, [material, theme.buildingTint]);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    items.forEach((p, i) => {
      // wide models shrink so they stay inside their cell
      const s = Math.min(p.s, 2.5 / Math.max(0.01, footprint));
      tmp.position.set(p.x, 0, p.z);
      tmp.rotation.set(0, p.yaw, 0);
      tmp.scale.setScalar(s);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [items, footprint, model]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, mat, items.length]}
      castShadow={theme.shadows}
      receiveShadow={theme.shadows}
      frustumCulled={false}
      name={`kit:${model}`}
    />
  );
}

/** The Bangkok-shaped city built from Kenney kit models on a deterministic grid. */
export function KitCity() {
  const models = useKitModels();
  const sceneWorld = useSceneStore((s) => s.scenes[s.index]?.world);
  const world = (sceneWorld ?? {}) as { inspector?: boolean; markers?: boolean };
  const groups = useMemo(() => {
    const by = new Map<string, Placement[]>();
    for (const p of kitLayout()) {
      if (!by.has(p.model)) by.set(p.model, []);
      by.get(p.model)!.push(p);
    }
    return [...by.entries()];
  }, []);

  return (
    <group name="kit-city">
      <Ground />
      <River />
      <Roads />
      <Landmarks />
      <Boats />
      <HarborBridge inspector={!!world.inspector} markers={!!world.markers} />
      <BangkokCity />
      {groups.map(([model, items]) => {
        const m = models.get(model);
        if (!m) return null;
        return <Instanced key={model} model={model} items={items} geometry={m.geometry} material={m.material} footprint={m.footprint} />;
      })}
    </group>
  );
}

useGLTF.preload?.(ALL_MODELS.map((m) => `${KIT}/${m}`));
