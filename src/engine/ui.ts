import { create } from 'zustand';
import { applyThemeToDocument, SKIES, storeTheme, storedTheme, THEMES, type Theme, type ThemeName } from '../world/theme';

export interface UiState {
  jumpOpen: boolean;
  notesOpen: boolean;
  /** presenter script under each page */
  scriptOpen: boolean;
  lang: 'en' | 'th';
  themeName: ThemeName;
  theme: Theme;
  toggleJump(): void;
  closeJump(): void;
  toggleNotes(): void;
  toggleScript(): void;
  toggleLang(): void;
  toggleTheme(): void;
  setTheme(t: ThemeName): void;
}

const initial = storedTheme();

function storedScript(): boolean {
  try {
    // captions (CC) start closed (owner, 2 Nov); the choice is remembered on this device
    return localStorage.getItem('cityops.script') === 'on';
  } catch {
    return false;
  }
}
if (typeof document !== 'undefined') applyThemeToDocument(initial);

export const useUiStore = create<UiState>((set, get) => ({
  jumpOpen: false,
  notesOpen: false,
  scriptOpen: storedScript(),
  lang: 'en',
  themeName: initial,
  theme: THEMES[initial],
  toggleJump: () => set((s) => ({ jumpOpen: !s.jumpOpen })),
  closeJump: () => set({ jumpOpen: false }),
  toggleNotes: () => set((s) => ({ notesOpen: !s.notesOpen })),
  toggleScript: () =>
    set((s) => {
      try {
        localStorage.setItem('cityops.script', s.scriptOpen ? 'off' : 'on');
      } catch {
        /* per-viewer convenience only */
      }
      return { scriptOpen: !s.scriptOpen };
    }),
  toggleLang: () => set((s) => ({ lang: s.lang === 'en' ? 'th' : 'en' })),
  setTheme: (t) => {
    storeTheme(t);
    applyThemeToDocument(t);
    set({ themeName: t, theme: THEMES[t] });
  },
  toggleTheme: () => {
    const i = SKIES.findIndex((k) => k.id === get().themeName);
    get().setTheme(SKIES[(i + 1) % SKIES.length].id);
  },
}));
