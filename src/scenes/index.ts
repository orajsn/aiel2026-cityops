import '../overlay/concepts/register';
import type { SceneDef } from '../engine/types';
import { chapter0 } from './chapter0';
import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { LAB1_SCRIPT, WITH_LAB1, lab1 } from './lab1';
import { SCRIPT } from './script';
import { GO_LAB1, GO_LAB2, GO_LAB3, GO_SCRIPT } from './labGo';

// Lab 1 (src/scenes/lab1.ts) plays between the Introduction and Lab 2; WITH_LAB1 = false takes it out.
// Lab 2 (chapter1.ts) follows the Harbor Bridge deck's eleven chapters; its first pages keep their old 0.x ids.
export const buildScenes = (withLab1: boolean): SceneDef[] =>
  [...chapter0, ...(withLab1 ? [GO_LAB1, ...lab1] : []), GO_LAB2, ...chapter1, GO_LAB3, ...chapter2].map((s) => ({ ...s, script: SCRIPT[s.id] ?? LAB1_SCRIPT[s.id] ?? GO_SCRIPT[s.id] }));
export const SCENES: SceneDef[] = buildScenes(WITH_LAB1);

/** a page's number on screen: 1, 2, 3 inside its part (Introduction, Lab 1, Lab 2, Lab 3), a page-zero page is 0; ids stay for the address */
const NUMBERS = new Map<string, number>();
const LABELS = new Map<string, string>();
for (const c of [0, 1, 2, 3]) {
  let n = 0;
  SCENES.filter((s) => s.chapter === c).forEach((s) => {
    // an extra page (pageSub) sits inside the page before it: 4a, 4b; the pages after keep counting from there
    if (!s.pageSub) NUMBERS.set(s.id, s.pageZero ? 0 : ++n);
    else NUMBERS.set(s.id, n);
    LABELS.set(s.id, s.pageSub ? `${n}${s.pageSub}` : String(NUMBERS.get(s.id)));
  });
}
export const pageNumber = (id: string) => NUMBERS.get(id) ?? 0;
/** what the screen shows for a page: its number, or the number and letter of an extra page (4a) */
export const pageLabel = (id: string) => LABELS.get(id) ?? '0';
