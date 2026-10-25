import type { SceneStore } from './store';

export interface KeyHandlers {
  jump(): void;
  notes(): void;
  lang(): void;
  theme?(): void;
  script?(): void;
  camera?(): void;
  traffic?(): void;
  /** true while Camera mode has the keys (arrows walk the camera) */
  isEditing?(): boolean;
}

export function bindKeys(store: SceneStore, handlers: KeyHandlers): () => void {
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (e.key === 'c' || e.key === 'C') {
      handlers.camera?.();
      return;
    }
    if (e.key === 'r' || e.key === 'R') {
      handlers.traffic?.();
      return;
    }
    if (handlers.isEditing?.()) return;
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
      case 's':
      case 'S':
        handlers.script?.();
        break;
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}
