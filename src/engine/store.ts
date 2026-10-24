import { create } from 'zustand';
import type { SceneDef } from './types';

export interface Counters {
  logs: number;
  reports: number;
  findings: number;
}

export interface SceneState {
  scenes: SceneDef[];
  index: number;
  /** Direction of the last move: 1 forward, -1 back. */
  direction: 1 | -1;
  counters: Counters;
  /** True once the camera has reached the current shot. Overlays fade in on this. */
  settled: boolean;
  setSettled(v: boolean): void;
  setScenes(s: SceneDef[]): void;
  next(): void;
  prev(): void;
  jumpTo(id: string): void;
  current(): SceneDef;
  setCounters(c: Counters): void;
}

const EMPTY: SceneDef = { id: 'none', chapter: 0, title: '', shot: 'city' };

export const useSceneStore = create<SceneState>((set, get) => ({
  scenes: [],
  index: 0,
  direction: 1,
  counters: { logs: 0, reports: 0, findings: 0 },
  settled: false,
  setSettled: (settled) => set({ settled }),
  setScenes: (scenes) => set({ scenes, index: 0 }),
  next: () => {
    const { index, scenes } = get();
    // a new page is not settled until its camera arrives (else its overlay flashes for a frame)
    if (index < scenes.length - 1) set({ index: index + 1, direction: 1, settled: false });
  },
  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1, direction: -1, settled: false });
  },
  jumpTo: (id) => {
    const { scenes, index } = get();
    const i = scenes.findIndex((s) => s.id === id);
    if (i >= 0 && i !== index) set({ index: i, direction: i >= index ? 1 : -1, settled: false });
  },
  current: () => get().scenes[get().index] ?? EMPTY,
  setCounters: (counters) => set({ counters }),
}));

export type SceneStore = typeof useSceneStore;
