import { useSceneStore } from '../../src/engine/store';
import type { SceneDef } from '../../src/engine/types';

const scenes: SceneDef[] = [
  { id: 'a', chapter: 0, title: 'A', shot: 'city-high' },
  { id: 'b', chapter: 0, title: 'B', shot: 'city-high' },
  { id: 'c', chapter: 0, title: 'C', shot: 'city-high' },
];

beforeEach(() => {
  useSceneStore.getState().setScenes(scenes);
});

test('next clamps at the last scene', () => {
  const s = useSceneStore.getState();
  s.next();
  s.next();
  s.next();
  expect(useSceneStore.getState().index).toBe(2);
});

test('prev clamps at the first scene', () => {
  useSceneStore.getState().prev();
  expect(useSceneStore.getState().index).toBe(0);
});

test('jumpTo unknown id leaves index unchanged', () => {
  useSceneStore.getState().next();
  useSceneStore.getState().jumpTo('nope');
  expect(useSceneStore.getState().index).toBe(1);
});

test('jumpTo known id sets index and current()', () => {
  useSceneStore.getState().jumpTo('b');
  expect(useSceneStore.getState().index).toBe(1);
  expect(useSceneStore.getState().current().id).toBe('b');
});

test('a page change is never settled: the new page waits for its camera (no one-frame flash of its overlay)', () => {
  const s = useSceneStore.getState();
  s.setScenes([
    { id: 'a', chapter: 0, title: 'A', shot: 'city' },
    { id: 'b', chapter: 0, title: 'B', shot: 'city' },
  ]);
  for (const move of [() => useSceneStore.getState().next(), () => useSceneStore.getState().prev(), () => useSceneStore.getState().jumpTo('b')]) {
    useSceneStore.getState().setSettled(true);
    move();
    expect(useSceneStore.getState().settled).toBe(false);
  }
});
