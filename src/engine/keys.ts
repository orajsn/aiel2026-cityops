import type { SceneStore } from './store';
import { presentNext, presentPrev, usePresentationStore } from './presentation';

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
  /** true in Presentation mode: the clicker's keys walk pages and Jupyter cells (presentation.ts) */
  presenting?(): boolean;
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
    // a clicker's "start slideshow" sends F5: in a browser that would reload the show, so it goes full screen
    if (handlers.presenting?.() && e.key === 'F5') {
      e.preventDefault();
      void document.documentElement.requestFullscreen?.().catch(() => {});
      return;
    }
    if (handlers.isEditing?.()) return;
    if (handlers.presenting?.() && presentKey(e)) return;
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

/** Presentation mode's keys: what clickers send (Page Down/Up, arrows) and their blank-screen button (B or .) */
function presentKey(e: KeyboardEvent): boolean {
  const p = usePresentationStore.getState();
  switch (e.key) {
    case 'PageDown':
    case 'ArrowRight':
    case ' ':
    case 'PageUp':
    case 'ArrowLeft': {
      e.preventDefault();
      // a blank screen comes back first, without moving on
      if (p.blank) p.toggleBlank();
      else if (e.key === 'PageUp' || e.key === 'ArrowLeft') presentPrev();
      else presentNext();
      return true;
    }
    case 'b':
    case 'B':
    case '.':
      p.toggleBlank();
      return true;
  }
  return false;
}
