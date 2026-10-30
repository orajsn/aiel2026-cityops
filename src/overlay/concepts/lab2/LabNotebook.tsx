import { NB_ART_A } from './nbArtA';
import { NB_ART_B } from './nbArtB';
import { NB_ART_FALLBACK } from './nbArtFallback';
import { NotebookPage } from './NotebookPage';
import { useDrawerStore } from '../../../engine/presentation';
import type { L2Props } from './parts';

const ART = { ...NB_ART_A, ...NB_ART_B };

/** a blue page of the deck: its first step shows at once, each Next lights the next one (focus 1 = step 2) */
export function LabNotebook(p: L2Props & { kicker: string; message: string }) {
  const open = useDrawerStore((s) => s.open);
  const focus = useDrawerStore((s) => s.focus);
  const id = p.focusId ?? '';
  const step = open && focus >= 1 ? focus + 1 : 1;
  return <NotebookPage id={id} kicker={p.kicker} message={p.message} step={step} notebook={p.notebook} everyday={ART[id] ?? NB_ART_FALLBACK} />;
}
