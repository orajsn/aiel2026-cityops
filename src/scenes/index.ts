import '../overlay/concepts/register';
import type { SceneDef } from '../engine/types';
import { chapter0 } from './chapter0';
import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { SCRIPT } from './script';

export const SCENES: SceneDef[] = [...chapter0, ...chapter1, ...chapter2].map((s) => ({ ...s, script: SCRIPT[s.id] }));
