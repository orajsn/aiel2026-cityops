import type { SceneStore } from './store';

export interface KeyHandlers {
  jump(): void;
  notes(): void;
  lang(): void;
  theme?(): void;
}

export function bindKeys(store: SceneStore, handlers: KeyHandlers): () => void {
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        store.getState().next();
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        store.getState().prev();
        e.preventDefault();
        break;
      case 'j':
      case 'J':
        handlers.jump();
        break;
      case 'n':
      case 'N':
        handlers.notes();
        break;
      case 'l':
      case 'L':
        handlers.lang();
        break;
      case 't':
      case 'T':
        handlers.theme?.();
        break;
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}
