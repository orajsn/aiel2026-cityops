import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Vec3 } from './shots';

/** nodes per layer, input to output */
const LAYERS = [4, 7, 7, 7, 4];
const WIDTH = 2.6;
const HEIGHT = 1.5;
/** a wave crosses all the layers in this long, then the next word starts */
const WAVE_MS = 1500;

// deep enough to read against both the haze and the city
const BASE = new THREE.Color('#2f5f6e');
const EDGE = new THREE.Color('#3f6f7c');
const LIT = new THREE.Color('#2bb3c8');
const GLOW = new THREE.Color('#dffaff');
const GREY = new THREE.Color('#b8bec6');

/** node positions: layers left to right, each layer a gentle arc in depth */
export function netLayout(): Vec3[][] {
  return LAYERS.map((n, l) => {
    const x = -WIDTH / 2 + (l / (LAYERS.length - 1)) * WIDTH;
    return Array.from({ length: n }, (_, i) => {
      const y = n === 1 ? 0 : -HEIGHT / 2 + (i / (n - 1)) * HEIGHT * (n / 7);
      return [x, y, Math.cos((i / Math.max(1, n - 1) - 0.5) * Math.PI) * 0.25] as Vec3;
    });
  });
}

/** how lit a layer is while the wave front sits at `front` (layer units): 1 at the front, falling off behind and ahead */
export function waveAt(layer: number, front: number): number {
  const d = layer - front;
  return Math.exp(-(d * d) / 0.35);
}

/**
 * The language model: layers of a neural network, every node joined to the next layer. While it is
 * `producing`, a wave of light runs from the first layer to the last, and each time it reaches the end a
 * word leaves on the right. Grey while it has nothing to go on (`doubt`), teal once it has the evidence.
 */
export function NeuralNet({ producing, doubt = false }: { producing: boolean; doubt?: boolean }) {
  const layout = useMemo(netLayout, []);
  const nodes = useMemo(() => layout.flatMap((layer, l) => layer.map((p) => ({ p, l }))), [layout]);
  const edges = useMemo(() => {
    const out: { a: Vec3; b: Vec3; l: number }[] = [];
    for (let l = 0; l < layout.length - 1; l++) for (const a of layout[l]) for (const b of layout[l + 1]) out.push({ a, b, l });
    return out;
  }, [layout]);
  // links as screen-width lines (1 px lines vanish at this distance); their colours are rewritten every frame
  const lines = useMemo(() => {
    const g = new LineSegmentsGeometry();
    g.setPositions(edges.flatMap((e) => [...e.a, ...e.b]));
    g.setColors(new Float32Array(edges.length * 6).fill(0.4));
    const m = new LineMaterial({ vertexColors: true, linewidth: 1.6, transparent: true, opacity: 0.75, toneMapped: false });
    return new LineSegments2(g, m);
  }, [edges]);
  const size = useThree((st) => st.size);
  useEffect(() => void lines.material.resolution.set(size.width, size.height), [lines, size]);
  useEffect(() => () => (lines.geometry.dispose(), lines.material.dispose()), [lines]);
  const root = useRef<THREE.Group>(null);
  const parentQ = useMemo(() => new THREE.Quaternion(), []);
  const dots = useRef<THREE.InstancedMesh>(null);
  const word = useRef<THREE.Mesh>(null);
  const start = useRef(performance.now());
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const was = useRef(false);
  useFrame(({ camera }) => {
    // always square to the camera, so every layer reads side by side
    const r = root.current;
    if (r?.parent) {
      r.parent.getWorldQuaternion(parentQ);
      r.quaternion.copy(parentQ.invert().multiply(camera.quaternion));
    }
    if (producing && !was.current) start.current = performance.now();
    was.current = producing;
    const t = performance.now() - start.current;
    const last = LAYERS.length - 1;
    // the front runs from just before the first layer to just past the last
    const front = producing ? ((t % WAVE_MS) / WAVE_MS) * (last + 1.4) - 0.7 : -9;
    const tint = doubt ? GREY : LIT;
    const m = dots.current;
    if (m) {
      nodes.forEach((n, i) => {
        const k = waveAt(n.l, front);
        dummy.position.set(...n.p);
        dummy.scale.setScalar(1 + k * 0.6);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        m.setColorAt(i, col.copy(BASE).lerp(tint, Math.min(1, k * 1.4)).lerp(GLOW, k * k * 0.6));
      });
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
    const c = (lines.geometry.getAttribute('instanceColorStart') as THREE.InterleavedBufferAttribute).data;
    const arr = c.array as Float32Array;
    edges.forEach((e, i) => {
      const k = waveAt(e.l + 0.5, front);
      col.copy(EDGE).lerp(tint, Math.min(1, k * 1.2)).lerp(GLOW, k * k * 0.4);
      arr.set([col.r, col.g, col.b, col.r, col.g, col.b], i * 6);
    });
    c.needsUpdate = true;
    // a word leaves the last layer as the wave arrives there
    const w = word.current;
    if (w) {
      const k = producing ? (front - last + 0.2) / 0.9 : -1;
      w.visible = k > 0 && k < 1;
      w.position.set(WIDTH / 2 + 0.15 + Math.max(0, k) * 0.6, 0, 0);
      w.scale.setScalar(Math.max(0.001, 1 - Math.max(0, k)));
      (w.material as THREE.MeshBasicMaterial).color.copy(tint);
    }
  });
  return (
    <group ref={root}>
      <primitive object={lines} />
      <instancedMesh ref={dots} args={[undefined, undefined, nodes.length]} frustumCulled={false}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <mesh ref={word} visible={false}>
        <boxGeometry args={[0.16, 0.08, 0.02]} />
        <meshBasicMaterial toneMapped={false} />
      </mesh>
    </group>
  );
}
