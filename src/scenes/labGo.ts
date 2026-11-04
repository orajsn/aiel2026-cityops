import type { SceneDef } from '../engine/types';
import { LAB_LINKS } from '../content/labLinks';

/**
 * The "Open the lab" page that starts each lab (owner, 4 Nov): the address and its QR, full page, at the whole bridge (the view the
 * Introduction ends on and Labs 2 and 3 open from). It is page 0 of its lab, so the lab's own numbering stays 1, 2, 3.
 */
const go = (id: string, chapter: 1 | 2 | 3, key: string, kicker: string, lab: string, line: string): SceneDef => ({
  id,
  chapter,
  title: `Open ${lab}`,
  pageZero: true,
  shot: 'bridge',
  world: { bridge: true },
  heldView: true,
  overlay: 'LabGo',
  overlayProps: { kicker, lab, url: LAB_LINKS[key].url, line },
});

export const GO_LAB1 = go('1.0g', 3, '1.0', 'Lab 1 · AI Economics', 'Lab 1', 'Scan the code or type the address to open your lab environment.');
export const GO_LAB2 = go('0.4g', 1, '0.4', 'Lab 2 · RAG to Agents', 'Lab 2', 'Scan the code or type the address to open your lab environment.');
export const GO_LAB3 = go('3.0g', 2, '3.0', 'Lab 3 · Agent Memory', 'Lab 3', 'Lab 3 uses the same environment as Lab 2: keep it open.');

export const GO_SCRIPT: Record<string, string> = {
  '1.0g': 'Before we start Lab 1, open your lab environment. Scan the code, or type the address on the screen.',
  '0.4g': 'Before we start Lab 2, open your lab environment. Scan the code, or type the address on the screen.',
  '3.0g': 'Lab 3 runs in the same environment as Lab 2. If you closed it, open it again with this address.',
};
