import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { Vec3 } from './shots';
import { at } from '../engine/base';
import { addInspectorAppearance, type InspectorAppearance } from './InspectorAppearance';

/** Kenney Mini Characters (CC0): character-{male|female}-{a..f}.glb, each with idle/walk/sit/crouch/interact clips. */
export type Who = `character-${'male' | 'female'}-${'a' | 'b' | 'c' | 'd' | 'e' | 'f'}`;
export type Pose = 'idle' | 'walk' | 'sit' | 'crouch' | 'interact-right' | 'emote-yes' | 'pick-up';

const url = (who: Who) => at(`models/kenney/characters/${who}.glb`);

export interface PersonProps {
  who: Who;
  /** where they stand (or end up, when walking) in the parent's units */
  position: Vec3;
  /** where they start walking from; omitted = already there */
  from?: Vec3;
  /** walking time from `from` to `position` */
  walkMs?: number;
  delayMs?: number;
  /** what they do once there */
  pose: Pose;
  /** facing when they arrive, radians about y (0 = facing +z) */
  facing?: number;
  /** total height in the parent's units */
  height: number;
  /** whether the person casts a shadow (default yes); a room floating above the street has none to cast */
  shadow?: boolean;
  /** Opt in only for bridge inspectors; the source rig, height and clips stay unchanged. */
  inspection?: boolean;
  /** Reused world-position vector and torch attachment, sampled after the rig and walk update. */
  onInspectionTorchPosition?(world: THREE.Vector3, torch: THREE.Object3D): void;
}

/**
 * One person. Walks from `from` to `position` (facing the way they walk), then turns to `facing`
 * and plays `pose`. The model is normalised to `height` so the same code works in any diorama.
 */
export function Person({ who, position, from, walkMs = 2400, delayMs = 0, pose, facing = 0, height, shadow = true, inspection = false, onInspectionTorchPosition }: PersonProps) {
  const gltf = useGLTF(url(who));
  const model = useMemo(() => cloneSkinned(gltf.scene) as THREE.Object3D, [gltf]);
  const size = useMemo(() => {
    const b = new THREE.Box3().setFromObject(model);
    return b.max.y - b.min.y || 1;
  }, [model]);
  const root = useRef<THREE.Group>(null);
  const appearance = useRef<InspectorAppearance | null>(null);
  const torchPosition = useMemo(() => new THREE.Vector3(), []);
  const { actions, mixer } = useAnimations(gltf.animations, root);
  const start = useRef(performance.now());
  const phase = useRef<'wait' | 'walk' | 'there'>(from ? 'wait' : 'there');

  useEffect(() => {
    if (!inspection) return;
    const attached = addInspectorAppearance(model);
    appearance.current = attached;
    return () => { attached?.dispose(); appearance.current = null; };
  }, [inspection, model]);

  useEffect(() => {
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = shadow;
        m.frustumCulled = false; // skinned bounds are stale after scaling
      }
    });
  }, [model, shadow]);

  const play = (name: Pose | 'walk') => {
    const next = actions[name];
    if (!next) return;
    Object.values(actions).forEach((a) => a !== next && a?.fadeOut(0.25));
    next.reset().fadeIn(0.25).play();
    if (name === 'crouch' || name === 'sit' || name === 'pick-up') {
      next.setLoop(THREE.LoopOnce, 1);
      next.clampWhenFinished = true;
    }
  };

  useEffect(() => {
    start.current = performance.now();
    phase.current = from ? 'wait' : 'there';
    play(from ? 'idle' : pose);
    return () => {
      mixer.stopAllAction();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, pose, from?.[0], from?.[1], from?.[2], position[0], position[1], position[2]]);

  useFrame(() => {
    const g = root.current;
    if (!g) return;
    const t = performance.now() - start.current - delayMs;
    if (!from || phase.current === 'there') {
      g.position.set(...position);
      g.rotation.y = facing;
      return;
    }
    if (t < 0) {
      g.position.set(...from);
      g.rotation.y = Math.atan2(position[0] - from[0], position[2] - from[2]);
      return;
    }
    if (phase.current === 'wait') {
      phase.current = 'walk';
      play('walk');
    }
    const k = Math.min(1, t / walkMs);
    g.position.set(from[0] + (position[0] - from[0]) * k, from[1] + (position[1] - from[1]) * k, from[2] + (position[2] - from[2]) * k);
    g.rotation.y = Math.atan2(position[0] - from[0], position[2] - from[2]);
    if (k >= 1) {
      phase.current = 'there';
      g.rotation.y = facing;
      play(pose);
    }
  });

  useFrame(() => {
    if (!inspection || !appearance.current || !root.current || !onInspectionTorchPosition) return;
    root.current.updateWorldMatrix(true, true);
    appearance.current.emitter.getWorldPosition(torchPosition);
    onInspectionTorchPosition(torchPosition, appearance.current.torch);
  });

  return (
    <group ref={root} position={from ?? position} rotation={[0, facing, 0]}>
      <primitive object={model} scale={height / size} />
    </group>
  );
}

for (const w of ['male-a', 'male-b', 'male-c', 'male-d', 'male-e', 'female-a', 'female-b', 'female-d', 'female-f'] as const) useGLTF.preload?.(url(`character-${w}` as Who));
