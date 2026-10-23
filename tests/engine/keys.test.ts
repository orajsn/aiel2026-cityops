import { bindKeys } from '../../src/engine/keys';
import { useSceneStore } from '../../src/engine/store';

beforeEach(() => {
  useSceneStore.getState().setScenes([
    { id: 'a', chapter: 0, title: 'A', shot: 'city-high' },
    { id: 'b', chapter: 0, title: 'B', shot: 'city-high' },
  ]);
});

test('ArrowRight advances, ArrowLeft goes back, J calls jump, unbind stops it', () => {
  const jump = vi.fn();
  const unbind = bindKeys(useSceneStore, { jump, notes: () => {}, lang: () => {} });
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  expect(useSceneStore.getState().index).toBe(1);
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  expect(useSceneStore.getState().index).toBe(0);
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j' }));
  expect(jump).toHaveBeenCalledTimes(1);
  unbind();
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  expect(useSceneStore.getState().index).toBe(0);
});
