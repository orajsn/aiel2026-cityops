import '../overlay/concepts/register';
import type { SceneDef } from '../engine/types';
import { chapter0 } from './chapter0';
import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { SCRIPT } from './script';

export const SCENES: SceneDef[] = [...chapter0, ...chapter1, ...chapter2].map((s) => ({ ...s, script: SCRIPT[s.id] }));

/** a page's number on screen: 1, 2, 3 inside its part (Introduction, Lab 2, Lab 3), a page-zero page is 0; ids stay for the address */
const NUMBERS = new Map<string, number>();
for (const c of [0, 1, 2]) {
  let n = 0;
  SCENES.filter((s) => s.chapter === c).forEach((s) => NUMBERS.set(s.id, s.pageZero ? 0 : ++n));
}
export const pageNumber = (id: string) => NUMBERS.get(id) ?? 0;
