import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '../engine/store';
import { SHOTS, interpolateShot, type Shot, type Vec3 } from './shots';

/**
 * Flies the camera from its live pose to the current scene's shot.
 * Scene `enterFrom` (optional) cuts to that shot first, then flies to `shot`.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const scene = useSceneStore((s) => s.scenes[s.index]);
  const setSettled = useSceneStore((s) => s.setSettled);

  const target = useRef<Vec3>([0, 0, 0]);
  const tween = useRef<{ from: Shot; to: Shot; start: number } | null>(null);

  useEffect(() => {
    if (!scene) return;
    const to = SHOTS[scene.shot];
    if (!to) return;
    let from: Shot = {
      position: [camera.position.x, camera.position.y, camera.position.z],
      target: [...target.current] as Vec3,
      durationMs: 0,
    };
    if (scene.enterFrom && SHOTS[scene.enterFrom]) {
      from = SHOTS[scene.enterFrom];
      camera.position.set(...from.position);
      target.current = [...from.target] as Vec3;
      camera.lookAt(...from.target);
    }
    setSettled(false);
    tween.current = { from, to, start: performance.now() + (scene.enterFrom ? 400 : 0) };
  }, [scene, camera, setSettled]);

  useFrame(() => {
    const tw = tween.current;
    if (!tw) return;
    const t = tw.to.durationMs === 0 ? 1 : (performance.now() - tw.start) / tw.to.durationMs;
    const pose = interpolateShot(tw.from, tw.to, t);
    camera.position.set(...pose.position);
    target.current = pose.target;
    camera.lookAt(...pose.target);
    if (t >= 1) {
      tween.current = null;
      setSettled(true);
    }
  });

  return null;
}

