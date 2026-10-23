import { create } from 'zustand';
import { applyThemeToDocument, storeTheme, storedTheme, THEMES, type Theme, type ThemeName } from '../world/theme';

export interface UiState {
  jumpOpen: boolean;
  notesOpen: boolean;
  lang: 'en' | 'th';
  themeName: ThemeName;
  theme: Theme;
  toggleJump(): void;
  closeJump(): void;
  toggleNotes(): void;
  toggleLang(): void;
  toggleTheme(): void;
  setTheme(t: ThemeName): void;
}

const initial = storedTheme();
if (typeof document !== 'undefined') applyThemeToDocument(initial);

export const useUiStore = create<UiState>((set, get) => ({
  jumpOpen: false,
  notesOpen: false,
  lang: 'en',
  themeName: initial,
  theme: THEMES[initial],
  toggleJump: () => set((s) => ({ jumpOpen: !s.jumpOpen })),
  closeJump: () => set({ jumpOpen: false }),
  toggleNotes: () => set((s) => ({ notesOpen: !s.notesOpen })),
  toggleLang: () => set((s) => ({ lang: s.lang === 'en' ? 'th' : 'en' })),
  setTheme: (t) => {
    storeTheme(t);
    applyThemeToDocument(t);
    set({ themeName: t, theme: THEMES[t] });
  },
  toggleTheme: () => get().setTheme(get().themeName === 'light' ? 'night' : 'light'),
}));
