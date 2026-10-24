import '../overlay/concepts/register';
import type { SceneDef } from '../engine/types';
import { chapter0 } from './chapter0';
import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { SCRIPT } from './script';

export const SCENES: SceneDef[] = [...chapter0, ...chapter1, ...chapter2].map((s) => ({ ...s, script: SCRIPT[s.id] }));

/** a page's number on screen: 1, 2, 3 inside its part (Introduction, Lab 2, Lab 3); ids stay for the address */
const NUMBERS = new Map<string, number>();
for (const c of [0, 1, 2]) SCENES.filter((s) => s.chapter === c).forEach((s, i) => NUMBERS.set(s.id, i + 1));
export const pageNumber = (id: string) => NUMBERS.get(id) ?? 0;
