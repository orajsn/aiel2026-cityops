import { useSceneStore } from '../../src/engine/store';
import { inspectionContextOpacity } from '../../src/world/SenayanDistrict';

afterEach(() => useSceneStore.getState().setScenes([]));

test('page 4 to 4a holds the hidden bank context until the departing camera arrives', () => {
  const store = useSceneStore.getState();
  store.setScenes([
    { id: '1.3', chapter: 3, title: 'One assistant', shot: 'bridge' },
    { id: '1.3p1', chapter: 3, title: 'The specification reaches the database', shot: 'sky-v1' },
  ]);
  store.setSettled(true);
  let opacity = inspectionContextOpacity(1, true, true, 5);
  expect(opacity).toBe(0);
  store.next();
  expect(useSceneStore.getState().current().id).toBe('1.3p1');
  opacity = inspectionContextOpacity(opacity, false, useSceneStore.getState().settled, 6);
  expect(opacity).toBe(0);
  opacity = inspectionContextOpacity(opacity, false, false, 14);
  expect(opacity).toBe(0);
  store.setSettled(true);
  expect(inspectionContextOpacity(opacity, false, useSceneStore.getState().settled, 14)).toBe(1);
});

test('far manual zoom restores context without changing the inspection shot', () => {
  const close = inspectionContextOpacity(1, true, true, 5);
  const middle = inspectionContextOpacity(close, true, true, 16);
  const far = inspectionContextOpacity(middle, true, true, 22);
  expect(close).toBe(0);
  expect(middle).toBeGreaterThan(0);
  expect(middle).toBeLessThan(1);
  expect(far).toBe(1);
  expect(inspectionContextOpacity(far, true, true, 5)).toBe(0);
});

test('the opening stays visible and a sufficiently distant departing camera can safely restore context', () => {
  expect(inspectionContextOpacity(1, false, false, 5)).toBe(1);
  expect(inspectionContextOpacity(0, false, false, 21)).toBe(1);
});
