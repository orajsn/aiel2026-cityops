import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { setTerrainGrid, terrainGridFromMesh } from './terrain';
import { at } from '../engine/base';

/**
 * "Bangkok" by TerraMesh (Sketchfab, CC-BY-4.0), used as delivered: terrain with its aerial
 * texture and the extruded buildings with their wall textures. Only the heavy roughness and
 * specular maps were dropped. Georeferenced so the pins and the river centreline land on it.
 */
const URL = at('models/city/bangkok-full/scene.gltf');

/**
 * Model units -> scene units. Fitted on Sanam Luang and Lumphini Park in the model's aerial texture,
 * then checked top-down against the OSM river and main roads (within ~100 m across the model).
 * The model covers about 15 x 8 km: Bang Sue edge to just south of Taksin, Thonburi to Asok.
 */
export const BKK = {
  scale: 1 / 110,
  x: -57.11,
  z: -54.04,
};

/** half extents of the model in its own units */
const MODEL_HALF_X = 7765;
const MODEL_HALF_Z = 4309;
/** True when (x, z) is inside the area the model covers. */
export function bangkokCovers(x: number, z: number, margin = 0): boolean {
  return (
    Math.abs(x - BKK.x) < MODEL_HALF_X * BKK.scale - margin && Math.abs(z - BKK.z) < MODEL_HALF_Z * BKK.scale - margin
  );
}

/**
 * Width of the band, in world units, over which the map melts into the haze at its cut edge.
 * Wide on the west, east and north; narrow on the south, where Harbor Bridge stands ~5 units from the edge.
 */
export const EDGE_FADE = { west: 18, east: 10, north: 18, south: 1.2 }; // east: the Ops Center is 8 units in

const smooth = (k: number) => {
  const c = Math.max(0, Math.min(1, k));
  return c * c * (3 - 2 * c);
};

/** 1 inside the map, falling smoothly to 0 at its cut edge (same maths as the shader below). */
export function edgeVisibility(x: number, z: number): number {
  const hx = MODEL_HALF_X * BKK.scale;
  const hz = MODEL_HALF_Z * BKK.scale;
  return Math.min(
    smooth((x - (BKK.x - hx)) / EDGE_FADE.west),
    smooth((BKK.x + hx - x) / EDGE_FADE.east),
    smooth((z - (BKK.z - hz)) / EDGE_FADE.north),
    smooth((BKK.z + hz - z) / EDGE_FADE.south),
  );
}

/**
 * Horizon haze (owner, 28 Oct: from a low camera the far city stayed sharp up to the map's cut edge). The city fades
 * into the haze colour as it nears the horizon line, the way real air looks: what matters is how far below the
 * horizon a point is seen (its depression angle), so a low camera hazes the far city while a camera looking down
 * from above sees all of it clearly. `angle` is the tangent of the angle where the haze is gone, `max` its strongest.
 */
export const HAZE = { angle: 0.12, max: 0.9 };

const smoothstep = (a: number, b: number, x: number) => {
  const k = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/** how much haze covers `point` seen from `camera` (0 clear .. HAZE.max), the same maths as the shader below */
export function hazeAt(camera: THREE.Vector3, point: THREE.Vector3): number {
  const dx = point.x - camera.x;
  const dz = point.z - camera.z;
  const below = (camera.y - point.y) / Math.max(Math.hypot(dx, dz), 1e-3);
  return (1 - smoothstep(0, HAZE.angle, below)) * HAZE.max;
}

/** How far the whole city fades into the haze (0 = clear): pages that focus on something else dim it. Shared by every map material. */
export const CITY_DIM = { value: 0 };

/** Blend every map material towards the fog colour near the map's edge, after fog is applied. */
export function addEdgeFade(mat: THREE.Material) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uEdgeRect = {
      value: new THREE.Vector4(BKK.x, BKK.z, MODEL_HALF_X * BKK.scale, MODEL_HALF_Z * BKK.scale),
    };
    shader.uniforms.uCityDim = CITY_DIM;
    shader.uniforms.uEdgeFade = { value: new THREE.Vector4(EDGE_FADE.west, EDGE_FADE.east, EDGE_FADE.north, EDGE_FADE.south) };
    shader.uniforms.uHaze = { value: new THREE.Vector2(HAZE.angle, HAZE.max) };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
varying vec3 vEdgeW;`)
      .replace('#include <project_vertex>', `#include <project_vertex>
vEdgeW = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vEdgeW;
uniform vec2 uHaze;
uniform vec4 uEdgeRect;
uniform vec4 uEdgeFade;
uniform float uCityDim;`)
      .replace(
        '#include <fog_fragment>',
        `#include <fog_fragment>
        #ifdef USE_FOG
          vec2 edgeLo = vEdgeW.xz - (uEdgeRect.xy - uEdgeRect.zw);
          vec2 edgeHi = (uEdgeRect.xy + uEdgeRect.zw) - vEdgeW.xz;
          float edgeK = min(
            min(smoothstep(0.0, 1.0, clamp(edgeLo.x / uEdgeFade.x, 0.0, 1.0)), smoothstep(0.0, 1.0, clamp(edgeHi.x / uEdgeFade.y, 0.0, 1.0))),
            min(smoothstep(0.0, 1.0, clamp(edgeLo.y / uEdgeFade.z, 0.0, 1.0)), smoothstep(0.0, 1.0, clamp(edgeHi.y / uEdgeFade.w, 0.0, 1.0)))
          );
          // horizon haze: how far below the horizon line this point is seen from the camera
          vec3 toFrag = vEdgeW - cameraPosition;
          float below = -toFrag.y / max(length(toFrag.xz), 1e-3);
          float haze = (1.0 - smoothstep(0.0, uHaze.x, below)) * uHaze.y;
          gl_FragColor.rgb = mix(fogColor, gl_FragColor.rgb, edgeK * (1.0 - haze) * (1.0 - uCityDim));
        #endif`,
      );
  };
  mat.customProgramCacheKey = () => 'bkk-edge-fade-haze';
}

/** The same fade into the haze for things that stand on the map but are not part of it (cars, boats, roads), so they dim with the city. */
export function addCityDim(mat: THREE.Material | null) {
  if (!mat) return;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uCityDim = CITY_DIM;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
uniform float uCityDim;`)
      .replace('#include <fog_fragment>', `#include <fog_fragment>
        #ifdef USE_FOG
          gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, uCityDim);
        #endif`);
  };
  mat.customProgramCacheKey = () => 'city-dim';
}

export function BangkokCity() {
  const gltf = useGLTF(URL);
  const scene = useMemo(() => {
    const root = gltf.scene;
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      addEdgeFade(m.material as THREE.Material);
      m.castShadow = !m.name.startsWith('Map');
      m.receiveShadow = true;
    });
    return root;
  }, [gltf]);
  // publish the ground grid once the map sits in the scene, so boats can float on its water surface
  useEffect(() => {
    let ground: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if (!ground && (o as THREE.Mesh).isMesh && o.name.startsWith('Map')) ground = o as THREE.Mesh;
    });
    if (ground) setTerrainGrid(terrainGridFromMesh(ground));
    return () => setTerrainGrid(null);
  }, [scene]);
  return (
    <group name="bangkok-city" position={[BKK.x, 0, BKK.z]} scale={BKK.scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload?.(URL);
