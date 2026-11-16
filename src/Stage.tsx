import { useEffect, useState, type ReactNode } from 'react';
import { useUiStore } from './engine/ui';
import { useSceneStore } from './engine/store';
import { useDrawerStore, usePresentationStore, PAGE_STEPS } from './engine/presentation';
import { STEP_EN, stepOf } from './content/scriptSteps';
import { Rich } from './overlay/Rich';
import { MapSources } from './overlay/concepts/MapSources';

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const MAX_DPR = 1.5;
export const stageScale = (w: number, h: number): number => Math.min(w / STAGE_W, h / STAGE_H);
export const renderDpr = (w: number, h: number, deviceDpr: number): number => Math.min(MAX_DPR, stageScale(w, h) * deviceDpr);

function useViewport(): [number, number] {
  const [size, setSize] = useState<[number, number]>(() => [window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const fit = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return size;
}
function useNotesVisible(): boolean {
  const on = useUiStore(s => s.scriptOpen);
  const scene = useSceneStore(s => s.scenes[s.index]);
  const drawer = useDrawerStore(s => s.open);
  const blank = usePresentationStore(s => s.blank);
  return !!(on && scene?.script && !blank && (!drawer || PAGE_STEPS[scene.id]));
}
const notesHeight = (height: number): number => Math.min(144, Math.max(100, height * .18));
export function useStageScale(): number {
  const [w, h] = useViewport();
  const notes = useNotesVisible();
  return stageScale(w, h - (notes ? notesHeight(h) : 0));
}
export function useRenderDpr(): number {
  return Math.min(MAX_DPR, useStageScale() * (window.devicePixelRatio || 1));
}
/** The speaker dock reserves viewport space rather than covering lesson content. */
export function Stage({ children }: { children: ReactNode }) {
  const [w, height] = useViewport();
  const notes = useNotesVisible();
  const reserve = notes ? notesHeight(height) : 0;
  const scale = stageScale(w, height - reserve);
  const scene = useSceneStore(s => s.scenes[s.index]);
  const step = useDrawerStore(s => stepOf(scene?.id ?? '', s.open, s.focus));
  return <>
    <MapSources bottomInset={reserve} />
    <div className="letterbox" style={{ bottom: reserve }}>
      <div id="stage" className="stage" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>{children}</div>
    </div>
    {notes && <aside className="presenter-dock" aria-label="presenter script" style={{ height: reserve }}>
      <div className="presenter-dock__label">Speaker notes</div>
      <div className="presenter-dock__copy" key={`${scene?.id}-${step}`}><Rich text={STEP_EN[scene?.id]?.[step] ?? scene?.script ?? ''} /></div>
      <button type="button" className="presenter-dock__close" aria-label="Close speaker notes" onClick={() => useUiStore.getState().toggleScript()}>×</button>
    </aside>}
  </>;
}
