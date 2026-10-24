import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '../engine/store';
import { shotForScene, useCameraStore } from '../engine/camera';
import { SHOTS, interpolateShot, moveDuration, type Shot, type Vec3 } from './shots';

/** near clipping plane: close-ups (0.4's data shapes) sit 0.3 units from the camera */
export const NEAR = 0.1;

/**
 * Flies the camera from its live pose to the current page's camera: the owner's saved angle for the
 * page if there is one, else its place. Scene `enterFrom` (optional) cuts to that shot first.
 * In Camera mode the rig lets go (FreeCam drives); leaving Camera mode flies back to the page's camera.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const scene = useSceneStore((s) => s.scenes[s.index]);
  const setSettled = useSceneStore((s) => s.setSettled);
  const editing = useCameraStore((s) => s.editing);
  const saved = useCameraStore((s) => (scene ? s.overrides[scene.id] : undefined));

  // close-ups put things ~0.3 units from the lens: keep the near plane small even if the canvas was created
  // with an older setting (a live code update does not recreate the camera)
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (cam.near !== NEAR) {
      cam.near = NEAR;
      cam.updateProjectionMatrix();
    }
  }, [camera]);

  const target = useRef<Vec3>([0, 0, 0]);
  const tween = useRef<{ from: Shot; to: Shot; start: number } | null>(null);
  const wasEditing = useRef(false);

  useEffect(() => {
    if (!scene) return;
    if (editing) {
      tween.current = null;
      wasEditing.current = true;
      setSettled(true);
      return;
    }
    const to = shotForScene(scene);
    if (!to) return;
    // after Camera mode, start from where the free camera was looking
    const dir = camera.getWorldDirection(camera.position.clone());
    const here: Vec3 = wasEditing.current
      ? [camera.position.x + dir.x * 12, camera.position.y + dir.y * 12, camera.position.z + dir.z * 12]
      : ([...target.current] as Vec3);
    let from: Shot = { position: [camera.position.x, camera.position.y, camera.position.z], target: here, durationMs: 0 };
    const cut = !!scene.enterFrom && !!SHOTS[scene.enterFrom] && !wasEditing.current;
    if (cut) {
      from = SHOTS[scene.enterFrom!];
      camera.position.set(...from.position);
      target.current = [...from.target] as Vec3;
      camera.lookAt(...from.target);
    }
    wasEditing.current = false;
    setSettled(false);
    // as long as the move needs to stay calm (shots.ts CALM), never shorter than the page's own time
    tween.current = { from, to: { ...to, durationMs: moveDuration(from, to) }, start: performance.now() + (cut ? 400 : 0) };
  }, [scene, camera, setSettled, editing, saved]);

  useFrame(() => {
    const tw = tween.current;
    if (!tw) return;
    const t = Math.max(0, (performance.now() - tw.start) / tw.to.durationMs);
    const pose = interpolateShot(tw.from, tw.to, t);
    camera.position.set(...pose.position);
    target.current = pose.target;
    camera.lookAt(...pose.target);
    if (t >= 1) {
      tween.current = null;
      setSettled(true);
      // a slow push-in once there (not when the owner saved a hand-set angle for this page)
      const push = tw.to.push;
      if (push && !useCameraStore.getState().overrides[useSceneStore.getState().current().id]) {
        tween.current = {
          from: { position: pose.position, target: pose.target, durationMs: 0 },
          to: { position: push.position, target: push.target, durationMs: push.durationMs, ease: 'inOut' },
          start: performance.now() + push.delayMs,
        };
      }
    }
  });

  return null;
}
