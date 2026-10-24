import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useCameraStore } from '../engine/camera';
import type { Vec3 } from './shots';

/** [forward, right, up] per key */
const MOVE_KEYS: Record<string, [number, number, number]> = {
  ArrowUp: [1, 0, 0], w: [1, 0, 0], W: [1, 0, 0],
  ArrowDown: [-1, 0, 0], s: [-1, 0, 0], S: [-1, 0, 0],
  ArrowLeft: [0, -1, 0], a: [0, -1, 0], A: [0, -1, 0],
  ArrowRight: [0, 1, 0], d: [0, 1, 0], D: [0, 1, 0],
  e: [0, 0, 1], E: [0, 0, 1], PageUp: [0, 0, 1],
  q: [0, 0, -1], Q: [0, 0, -1], PageDown: [0, 0, -1],
};
const LOOK = 0.0045; // radians per pixel of drag
const MAX_PITCH = (85 * Math.PI) / 180;

/**
 * Camera mode: walk with the arrow keys or WASD (Q/E down and up, Shift faster), drag to look, wheel to
 * move forward and back. On a touch screen: one finger looks, two fingers pinch to move forward and pan
 * to slide. Speed grows with height so it works from street level to the whole city.
 */
export function FreeCam() {
  const editing = useCameraStore((s) => s.editing);
  const camera = useThree((s) => s.camera);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const held = useRef(new Set<string>());
  const fast = useRef(false);
  const push = useRef<[number, number, number]>([0, 0, 0]); // one-off moves from the wheel and touch
  const lastPublish = useRef(0);
  const fwd = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());

  // take over from the current view when Camera mode starts
  useEffect(() => {
    if (!editing) return;
    const d = camera.getWorldDirection(new THREE.Vector3());
    yaw.current = Math.atan2(d.x, -d.z);
    pitch.current = Math.asin(Math.max(-1, Math.min(1, d.y)));
    held.current.clear();
  }, [editing, camera]);

  useEffect(() => {
    if (!editing) return;
    const down = (e: KeyboardEvent) => {
      fast.current = e.shiftKey;
      const m = MOVE_KEYS[e.key];
      if (m) {
        held.current.add(e.key);
        e.preventDefault();
        // a tap (press and release within one frame) still moves a little step
        if (!e.repeat) {
          const step = Math.max(0.6, camera.position.y * 0.7) * 0.06 * (e.shiftKey ? 3 : 1);
          push.current[0] += m[0] * step;
          push.current[1] += m[1] * step;
          push.current[2] += m[2] * step;
        }
      }
    };
    const up = (e: KeyboardEvent) => {
      fast.current = e.shiftKey;
      held.current.delete(e.key);
    };
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    // a drag anywhere steers the camera (panels included), except on the buttons and the Camera bar
    const pd = (e: PointerEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.('button, .cam-edit, .stepper')) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };
    const pm = (e: PointerEvent) => {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        yaw.current += dx * LOOK;
        pitch.current = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch.current - dy * LOOK));
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const scale = Math.max(0.01, camera.position.y * 0.004);
        push.current[0] += (dist - pinch) * scale;
        pinch = dist;
        push.current[1] -= (dx / 2) * scale;
        push.current[2] += (dy / 2) * scale;
      }
    };
    const pu = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
    };
    const wheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.('.cam-edit')) return;
      e.preventDefault();
      push.current[0] -= e.deltaY * Math.max(0.002, camera.position.y * 0.0015);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    window.addEventListener('pointercancel', pu);
    window.addEventListener('wheel', wheel, { passive: false });
    // no browser scrolling or zooming while the fingers steer the camera
    const prevTouch = document.body.style.touchAction;
    document.body.style.touchAction = 'none';
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
      window.removeEventListener('pointercancel', pu);
      window.removeEventListener('wheel', wheel);
      document.body.style.touchAction = prevTouch;
    };
  }, [editing, camera]);

  useFrame((_, dt) => {
    if (!editing) return;
    const speed = Math.max(0.6, camera.position.y * 0.7) * (fast.current ? 3 : 1);
    let f = push.current[0];
    let r = push.current[1];
    let u = push.current[2];
    push.current = [0, 0, 0];
    for (const k of held.current) {
      const m = MOVE_KEYS[k];
      if (!m) continue;
      f += m[0] * speed * dt;
      r += m[1] * speed * dt;
      u += m[2] * speed * dt;
    }
    // walk on the horizontal plane, like a person; the look direction carries the pitch
    fwd.current.set(Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    right.current.set(Math.cos(yaw.current), 0, Math.sin(yaw.current));
    camera.position.addScaledVector(fwd.current, f).addScaledVector(right.current, r);
    camera.position.y = Math.max(0.15, camera.position.y + u);
    const cp = Math.cos(pitch.current);
    const look: Vec3 = [
      camera.position.x + Math.sin(yaw.current) * cp * 12,
      camera.position.y + Math.sin(pitch.current) * 12,
      camera.position.z - Math.cos(yaw.current) * cp * 12,
    ];
    camera.lookAt(...look);
    const now = performance.now();
    if (now - lastPublish.current > 150) {
      lastPublish.current = now;
      useCameraStore.getState().setLive({ position: [camera.position.x, camera.position.y, camera.position.z], target: look });
    }
  });
  return null;
}
