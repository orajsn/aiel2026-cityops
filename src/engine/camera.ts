import { create } from 'zustand';
import overridesJson from '../content/cameraOverrides.json';
import { SHOTS, type Shot, type Vec3 } from '../world/shots';
import type { SceneDef } from './types';
import { at } from './base';

/** A camera angle the owner set by hand for one page (Camera mode → Save). */
export interface SavedAngle {
  position: Vec3;
  target: Vec3;
}

export interface CameraState {
  /** saved angles by scene id: they win over the page's place (src/world/shots.ts) */
  overrides: Record<string, SavedAngle>;
  /** Camera mode: the presenter drives the camera, arrows walk instead of turning pages */
  editing: boolean;
  /** where the camera is right now while editing (what Save stores) */
  live: SavedAngle | null;
  setEditing(v: boolean): void;
  setLive(a: SavedAngle): void;
  setOverride(ids: string[], a: SavedAngle): void;
  clearOverride(ids: string[]): void;
}

export const useCameraStore = create<CameraState>((set) => ({
  overrides: overridesJson as unknown as Record<string, SavedAngle>,
  editing: false,
  live: null,
  setEditing: (editing) => set({ editing }),
  setLive: (live) => set({ live }),
  setOverride: (ids, a) => set((s) => ({ overrides: { ...s.overrides, ...Object.fromEntries(ids.map((id) => [id, a])) } })),
  clearOverride: (ids) =>
    set((s) => {
      const o = { ...s.overrides };
      for (const id of ids) delete o[id];
      return { overrides: o };
    }),
}));

/** The camera for a page: the owner's saved angle if there is one, else the page's place. */
export function shotForScene(scene: SceneDef, overrides = useCameraStore.getState().overrides): Shot {
  const base = SHOTS[scene.shot];
  const o = scene.heldView ? undefined : overrides[scene.id] ?? (scene.sameAngleAs ? overrides[scene.sameAngleAs] : undefined);
  return o ? { ...base, position: o.position, target: o.target } : base;
}

/**
 * On start: take the latest saved angles from the dev server (the bundled copy can be stale), or from
 * this browser when there is no dev server.
 */
export async function loadOverrides(): Promise<void> {
  try {
    const r = await fetch(at('__camera-overrides'), { cache: 'no-store' });
    if (r.ok && (r.headers.get('content-type') ?? '').includes('json')) {
      useCameraStore.setState({ overrides: await r.json() });
      return;
    }
  } catch {
    /* no dev server */
  }
  try {
    const local = localStorage.getItem('cityops.cameraOverrides');
    if (local) useCameraStore.setState({ overrides: { ...useCameraStore.getState().overrides, ...JSON.parse(local) } });
  } catch {
    /* storage blocked */
  }
}

/**
 * Store the saved angles in the project (src/content/cameraOverrides.json) through the dev server,
 * so a save made on the iPad lands in the repo. Without a dev server (a built copy), keep them in this
 * browser only. Returns where they went.
 */
export async function persistOverrides(overrides: Record<string, SavedAngle>): Promise<'project' | 'browser'> {
  try {
    const r = await fetch(at('__camera-overrides'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(overrides) });
    if (r.ok) return 'project';
  } catch {
    /* no dev server */
  }
  try {
    localStorage.setItem('cityops.cameraOverrides', JSON.stringify(overrides));
  } catch {
    /* storage blocked */
  }
  return 'browser';
}

/**
 * Whether two pages look from the same place: the pages of one story that share a shot. The camera then stays exactly where
 * it is, including after the shot's slow push-in; comparing the live (pushed-in) pose with the shot's wide start sent it
 * back out and in again on every page (owner, 3 Nov: "zoom out, zoom in, same angle, for what").
 */
export function sameLook(prev: Shot | null, next: Shot): boolean {
  if (!prev) return false;
  const near = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.05;
  return near(prev.position, next.position) && near(prev.target, next.target);
}
