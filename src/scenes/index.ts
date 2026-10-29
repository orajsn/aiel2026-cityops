import '../overlay/concepts/register';
import type { SceneDef } from '../engine/types';
import { chapter0 } from './chapter0';
import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { LAB1_SCRIPT, WITH_LAB1, lab1 } from './lab1';
import { SCRIPT } from './script';

// Lab 1 (src/scenes/lab1.ts) plays between the Introduction and Lab 2; WITH_LAB1 = false takes it out.
// Lab 2 (chapter1.ts) follows the Harbor Bridge deck's eleven chapters; its first pages keep their old 0.x ids.
export const buildScenes = (withLab1: boolean): SceneDef[] =>
  [...chapter0, ...(withLab1 ? lab1 : []), ...chapter1, ...chapter2].map((s) => ({ ...s, script: SCRIPT[s.id] ?? LAB1_SCRIPT[s.id] }));
export const SCENES: SceneDef[] = buildScenes(WITH_LAB1);

/** a page's number on screen: 1, 2, 3 inside its part (Introduction, Lab 1, Lab 2, Lab 3), a page-zero page is 0; ids stay for the address */
const NUMBERS = new Map<string, number>();
for (const c of [0, 1, 2, 3]) {
  let n = 0;
  SCENES.filter((s) => s.chapter === c).forEach((s) => NUMBERS.set(s.id, s.pageZero ? 0 : ++n));
}
export const pageNumber = (id: string) => NUMBERS.get(id) ?? 0;
