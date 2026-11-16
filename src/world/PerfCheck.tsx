import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, type RootState } from '@react-three/fiber';
import { PERF_STEPS, usePerfStore, type PerfId, type PerfResult } from '../engine/perfCheck';

/** Each step settles for two seconds, then measures five seconds of frames. */
const WARM = 2.0;
const MEASURE = 5.0;

type Run = { step: number; measuring: boolean; t: number; dts: number[]; undo: () => void };

/** every material rebuilds its shader when shadows switch on or off */
function refreshMaterials(scene: THREE.Scene) {
  scene.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (m) (Array.isArray(m) ? m : [m]).forEach((x) => (x.needsUpdate = true));
  });
}

/** change one thing for a step; returns how to put it back */
function apply(id: PerfId, state: RootState): () => void {
  const { gl, scene } = state;
  switch (id) {
    case 'pixels': {
      const dpr = state.viewport.dpr;
      state.setDpr(dpr * Math.SQRT1_2);
      return () => state.setDpr(dpr);
    }
    case 'shadows': {
      const was = gl.shadowMap.enabled;
      gl.shadowMap.enabled = false;
      refreshMaterials(scene);
      return () => {
        gl.shadowMap.enabled = was;
        refreshMaterials(scene);
      };
    }
    case 'traffic': {
      const groups = ['SenayanTraffic', 'Jakarta road and river traffic', 'cars', 'boats'].map((n) => scene.getObjectByName(n)).filter((o): o is THREE.Object3D => !!o);
      const previous = groups.map(g => g.visible);
      groups.forEach(g => { g.visible = false; });
      return () => groups.forEach((g, i) => { g.visible = previous[i]; });
    }
    case 'empty':
      scene.visible = false;
      return () => (scene.visible = true);
    default:
      return () => {};
  }
}

/**
 * Settings › Graphics › Performance check: five measurements in a row inside the 3D scene (perfCheck.ts names
 * them), each change undone before the next, and the machine's graphics chip and frame size for the report.
 */
export function PerfCheck() {
  const run = useRef<Run | null>(null);
  useFrame((state, dt) => {
    const perf = usePerfStore.getState();
    if (perf.status !== 'running') {
      if (run.current) run.current.undo();
      run.current = null;
      return;
    }
    if (!run.current) {
      const ext = state.gl.getContext().getExtension('WEBGL_debug_renderer_info');
      const gpu = ext ? String(state.gl.getContext().getParameter(ext.UNMASKED_RENDERER_WEBGL)) : 'not reported by this browser';
      usePerfStore.setState({ info: { gpu, size: `${state.gl.domElement.width} × ${state.gl.domElement.height}`, drawCalls: 0, triangles: 0 } });
      run.current = { step: 0, measuring: false, t: 0, dts: [], undo: apply(PERF_STEPS[0].id, state) };
    }
    const r = run.current;
    r.t += dt;
    if (!r.measuring) {
      if (r.t >= WARM) Object.assign(r, { measuring: true, t: 0, dts: [] });
      return;
    }
    r.dts.push(dt);
    const s = PERF_STEPS[r.step];
    if (s.id === 'base' && r.dts.length === 10) {
      const info = usePerfStore.getState().info!;
      usePerfStore.setState({ info: { ...info, drawCalls: state.gl.info.render.calls, triangles: state.gl.info.render.triangles } });
    }
    if (r.t < MEASURE) return;
    const sorted = [...r.dts].sort((a, b) => a - b);
    const result: PerfResult = {
      id: s.id,
      label: s.label,
      fps: Math.round(r.dts.length / r.dts.reduce((a, b) => a + b, 0)),
      slowMs: Math.round(sorted[Math.floor(sorted.length * 0.95)] * 1000),
    };
    r.undo();
    const results = [...usePerfStore.getState().results, result];
    const next = r.step + 1;
    if (next >= PERF_STEPS.length) {
      usePerfStore.setState({ results, status: 'done' });
      run.current = null;
      return;
    }
    usePerfStore.setState({ results, step: next });
    run.current = { step: next, measuring: false, t: 0, dts: [], undo: apply(PERF_STEPS[next].id, state) };
  });
  return null;
}
