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

/** what the five measurements say, in plain words, most important first */
export function verdict(results: PerfResult[]): string[] {
  const fps = (id: PerfId) => results.find((r) => r.id === id)?.fps ?? 0;
  const base = fps('base');
  if (!base) return [];
  const gain = (id: PerfId) => fps(id) / base;
  const out: string[] = [];
  if (base >= 57) out.push('Already at the screen’s refresh rate (about 60): nothing to fix here.');
  else if (gain('empty') < 1.15)
    out.push('It is not the graphics chip: even with nothing drawn it stays slow. The browser or the computer’s CPU is the limit (other tabs, power saving, battery mode).');
  else {
    if (gain('pixels') >= 1.25) out.push('The graphics chip is drawing too many pixels: use 2K or Auto on this machine.');
    if (gain('shadows') >= 1.25) out.push('The live shadows are a large cost on this graphics chip.');
    if (gain('traffic') >= 1.15) out.push('The cars and boats cost a noticeable share.');
    if (!out.length) out.push('No single part dominates: the whole scene is heavy for this graphics chip. A stronger GPU, or a lower resolution, helps.');
  }
  return out;
}
