import type { SceneDef } from './types';
import type { SceneStore } from './store';

export function hashToIndex(hash: string, scenes: SceneDef[]): number {
  const m = /scene=([^&]+)/.exec(hash ?? '');
  if (!m) return 0;
  const id = decodeURIComponent(m[1]);
  const i = scenes.findIndex((s) => s.id === id);
  return i >= 0 ? i : 0;
}

export function indexToHash(i: number, scenes: SceneDef[]): string {
  const s = scenes[i];
  return s ? `#scene=${s.id}` : '';
}

/** Two-way binding between location.hash and the store. Returns unbind. */
export function bindHash(store: SceneStore): () => void {
  const apply = () => {
    const { scenes, index } = store.getState();
    const i = hashToIndex(window.location.hash, scenes);
    if (i !== index) store.setState({ index: i });
  };
  apply();
  window.addEventListener('hashchange', apply);
  const unsub = store.subscribe((state, prev) => {
    if (state.index === prev.index && state.scenes === prev.scenes) return;
    const h = indexToHash(state.index, state.scenes);
    if (h && window.location.hash !== h) history.replaceState(null, '', h);
  });
  return () => {
    window.removeEventListener('hashchange', apply);
    unsub();
  };
}
