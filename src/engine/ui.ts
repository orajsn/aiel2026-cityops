import { create } from 'zustand';

export interface UiState {
  jumpOpen: boolean;
  notesOpen: boolean;
  lang: 'en' | 'th';
  toggleJump(): void;
  closeJump(): void;
  toggleNotes(): void;
  toggleLang(): void;
}

export const useUiStore = create<UiState>((set) => ({
  jumpOpen: false,
  notesOpen: false,
  lang: 'en',
  toggleJump: () => set((s) => ({ jumpOpen: !s.jumpOpen })),
  closeJump: () => set({ jumpOpen: false }),
  toggleNotes: () => set((s) => ({ notesOpen: !s.notesOpen })),
  toggleLang: () => set((s) => ({ lang: s.lang === 'en' ? 'th' : 'en' })),
}));
