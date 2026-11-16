import { create } from 'zustand';

/**
 * Settings › Graphics › Performance check (owner, 28 Oct: "what is the bottleneck, will more CPU or RAM help?").
 * It runs on the machine showing the show, measures the frame rate five ways (PerfCheck.tsx does the work inside
 * the 3D scene) and says in plain words what the limit is. The server's CPU and RAM play no part: the browser
 * on this machine draws every frame.
 */
export type PerfId = 'base' | 'pixels' | 'shadows' | 'traffic' | 'empty';

export interface PerfResult {
  id: PerfId;
  label: string;
  fps: number;
  /** the slowest frames (95th percentile), in milliseconds */
  slowMs: number;
}

export const PERF_STEPS: { id: PerfId; label: string }[] = [
  { id: 'base', label: 'As it is' },
  { id: 'pixels', label: 'Half the pixels' },
  { id: 'shadows', label: 'Shadows off' },
  { id: 'traffic', label: 'No cars or boats' },
  { id: 'empty', label: 'Nothing drawn' },
];

export interface PerfInfo {
  gpu: string;
  size: string;
  drawCalls: number;
  triangles: number;
}

export interface PerfState {
  status: 'idle' | 'running' | 'done';
  /** the step being measured now (index into PERF_STEPS) */
  step: number;
  results: PerfResult[];
  info: PerfInfo | null;
  start(): void;
}

export const usePerfStore = create<PerfState>((set) => ({
  status: 'idle',
  step: 0,
  results: [],
  info: null,
  start: () => set({ status: 'running', step: 0, results: [], info: null }),
}));

/** Report measured differences without attributing them to an unmeasured bottleneck. */
export function verdict(results: PerfResult[]): string[] {
  const base = results.find(r => r.id === 'base');
  if (!base?.fps) return ['No baseline measurement was captured.'];
  const lines = [`Baseline: ${base.fps} FPS; slow frames (95th percentile): ${base.slowMs} ms.`];
  for (const result of results) {
    if (result.id === 'base' || !result.fps) continue;
    const change = Math.round((result.fps / base.fps - 1) * 100);
    lines.push(`${result.label}: ${result.fps} FPS (${change >= 0 ? '+' : ''}${change}% versus baseline); slow frames: ${result.slowMs} ms.`);
  }
  lines.push('This short comparison describes this scene and device. Repeat it on the event display before choosing a preset.');
  return lines;
}
