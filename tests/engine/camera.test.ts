import { vi } from 'vitest';
import { sameLook, useCameraStore, shotForScene } from '../../src/engine/camera';
import { SHOTS } from '../../src/world/shots';
import type { SceneDef } from '../../src/engine/types';

const scene: SceneDef = { id: '1.2', chapter: 1, title: 'T', shot: 'sky' };

beforeEach(() => useCameraStore.setState({ overrides: {}, editing: false }));

test('a page without a saved angle uses its place', () => {
  expect(shotForScene(scene)).toBe(SHOTS.sky);
});

test('a saved angle for the page wins, and keeps the place timing', () => {
  useCameraStore.getState().setOverride(['1.2'], { position: [1, 2, 3], target: [4, 5, 6] });
  const s = shotForScene(scene);
  expect(s.position).toEqual([1, 2, 3]);
  expect(s.target).toEqual([4, 5, 6]);
  expect(s.durationMs).toBe(SHOTS.sky.durationMs);
});

test('reset removes the saved angle', () => {
  useCameraStore.getState().setOverride(['1.2', '1.3'], { position: [1, 2, 3], target: [4, 5, 6] });
  useCameraStore.getState().clearOverride(['1.2']);
  expect(shotForScene(scene)).toBe(SHOTS.sky);
  expect(useCameraStore.getState().overrides['1.3']).toBeDefined();
});

test('on start the saved angles come from the dev server, not the stale bundled copy', async () => {
  const { loadOverrides } = await import('../../src/engine/camera');
  const saved = { '2.1': { position: [1, 1, 1], target: [0, 0, 0] } };
  const fetchMock = vi.fn(async () => ({ ok: true, headers: new Headers({ 'content-type': 'application/json' }), json: async () => saved }));
  vi.stubGlobal('fetch', fetchMock);
  await loadOverrides();
  expect(useCameraStore.getState().overrides).toEqual(saved);
  vi.unstubAllGlobals();
});

test('pages that look from the same place hold the camera (no fly back out and in after a push-in)', () => {
  const a = { position: [1, 2, 3], target: [4, 5, 6], durationMs: 1000 } as never;
  const same = { position: [1, 2, 3.01], target: [4, 5, 6], durationMs: 2000 } as never;
  const other = { position: [1, 2, 9], target: [4, 5, 6], durationMs: 1000 } as never;
  expect(sameLook(null, a)).toBe(false);
  expect(sameLook(a, same)).toBe(true);
  expect(sameLook(a, other)).toBe(false);
});
