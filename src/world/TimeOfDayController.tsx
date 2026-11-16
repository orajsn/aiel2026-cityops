import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import type { Theme } from './theme';
import { SKY_UNIFORMS } from './Ground';
import { SUN_POS } from './Lighting';
import { newSky, showTime, skyAt, type Sky } from './timeOfDay';

/** how fast the time catches up with a new page: about two seconds, the length of a camera move */
const CATCH_UP = 1.4;

type Lights = { ambient?: THREE.AmbientLight; hemi?: THREE.HemisphereLight; sun?: THREE.DirectionalLight; ground?: THREE.Mesh };

/**
 * Settings › Sky › Time of day: every frame, the time eases towards the page's place in the show and the sky,
 * fog, lights and sun follow (timeOfDay.ts). It writes straight into the scene's objects: changing the theme
 * through React would rebuild every material, fine for a click but not 60 times a second.
 */
export function TimeOfDay() {
  const scene = useThree((s) => s.scene);
  const sky = useMemo(newSky, []);
  const t = useRef<number | null>(null);
  const found = useRef<Lights>({});

  useFrame((_, dt) => {
    const { index, scenes } = useSceneStore.getState();
    const target = showTime(index, scenes.length);
    t.current = t.current === null ? target : t.current + (target - t.current) * Math.min(1, dt * CATCH_UP);
    applySky(scene, skyAt(t.current, sky), found.current);
  });

  // leaving Time of day: put back the sky that was chosen instead
  useEffect(() => () => applySky(scene, themeSky(useUiStore.getState().theme), {}), [scene]);
  return null;
}

/** the objects this writes to, found once and found again if they were rebuilt */
function lookup<K extends keyof Lights>(scene: THREE.Scene, found: Lights, key: K, name: string): Lights[K] {
  const o = found[key];
  if (o && o.parent) return o;
  return (found[key] = (scene.getObjectByName(name) as Lights[K]) ?? undefined);
}

function applySky(scene: THREE.Scene, s: Sky, found: Lights) {
  if (scene.background instanceof THREE.Color) scene.background.copy(s.bg);
  if (scene.fog instanceof THREE.FogExp2) {
    scene.fog.color.copy(s.bg);
    scene.fog.density = s.fogDensity;
  }
  SKY_UNIFORMS.uTop.value.copy(s.skyTop);
  SKY_UNIFORMS.uHorizon.value.copy(s.skyHorizon);
  const ambient = lookup(scene, found, 'ambient', 'ambient');
  if (ambient) ambient.intensity = s.ambient;
  const hemi = lookup(scene, found, 'hemi', 'hemi');
  if (hemi) {
    hemi.color.copy(s.hemiSky);
    hemi.groundColor.copy(s.hemiGround);
    hemi.intensity = s.hemi;
  }
  const sun = lookup(scene, found, 'sun', 'sun');
  if (sun) {
    sun.color.copy(s.sun);
    sun.intensity = s.sunIntensity;
    sun.position.copy(s.sunPos);
  }
  const ground = lookup(scene, found, 'ground', 'far-ground');
  if (ground) (ground.material as THREE.MeshBasicMaterial).color.copy(s.bg);
}

/** a fixed sky as a Sky, to restore it */
function themeSky(th: Theme): Sky {
  const s = newSky();
  for (const k of ['bg', 'skyTop', 'skyHorizon', 'hemiSky', 'hemiGround', 'sun'] as const) s[k].set(th[k]);
  s.fogDensity = th.fogDensity;
  s.ambient = th.ambient;
  s.hemi = th.hemi;
  s.sunIntensity = th.sunIntensity;
  s.sunPos.set(...SUN_POS);
  return s;
}
