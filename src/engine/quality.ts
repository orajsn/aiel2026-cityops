import { create } from 'zustand';

export type Quality = 'balanced' | 'high';
interface QualityPreset { label: string; autoCap: number; shadowSize: number; shadowEvery: number }
export const QUALITY: Record<Quality, QualityPreset> = {
  balanced: { label: 'Balanced', autoCap: 1, shadowSize: 2048, shadowEvery: 2 },
  high: { label: 'High', autoCap: 4 / 3, shadowSize: 4096, shadowEvery: 1 },
};
const KEY = 'cityops.jakarta.v4.quality';
function stored(): Quality {
  try { return localStorage.getItem(KEY) === 'high' ? 'high' : 'balanced'; }
  catch { return 'balanced'; }
}
interface QualityState { preset: Quality; setPreset(preset: Quality): void }
export const useQualityStore = create<QualityState>(set => ({
  preset: stored(),
  setPreset: preset => { try { localStorage.setItem(KEY, preset); } catch { /* optional persistence */ } set({ preset }); },
}));
export const quality = (): Quality => useQualityStore.getState().preset;
export const setQuality = (preset: Quality): void => useQualityStore.getState().setPreset(preset);
