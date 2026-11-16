import type { SceneDef } from '../engine/types';
import economicsShot from '../assets/livelabs/economics.webp';
import labs12Shot from '../assets/livelabs/labs12.webp';
import { LAB_LINKS } from '../content/labLinks';

/**
 * The "Open the lab" page that starts each lab (owner, 4 Nov): the address and its QR, full page, at the whole bridge (the view the
 * Introduction ends on and Labs 2 and 3 open from). It is page 0 of its lab, so the lab's own numbering stays 1, 2, 3.
 */
const go = (id: string, chapter: 1 | 2 | 3, key: string, kicker: string, lab: string, line: string, listed: string, covers: string, picture: string): SceneDef => ({
  id,
  chapter,
  title: `Open ${lab}`,
  pageZero: true,
  shot: 'bridge',
  world: { bridge: true },
  heldView: true,
  overlay: 'LabGo',
  overlayProps: { kicker, lab, url: LAB_LINKS[key].url, line, listed, covers, picture },
});

export const GO_LAB1 = go('1.0g', 3, '1.0', 'Lab 1 · AI Economics', 'Lab 1', 'Scan the code or type the address to open your lab environment.', 'AI Experience Thailand: The Economics of AI - Lab 1', 'our Lab 1 · AI Economics', economicsShot);
export const GO_LAB2 = go('0.4g', 1, '0.4', 'Lab 2 · RAG to Agents', 'Lab 2', 'Scan the code or type the address to open your lab environment.', 'AI Experience Thailand: AI Labs 2 & 3', 'our Lab 2 (RAG to Agents) and Lab 3 (Agent Memory)', labs12Shot);
export const GO_LAB3 = go('3.0g', 2, '3.0', 'Lab 3 · Agent Memory', 'Lab 3', 'Lab 3 uses the same environment as Lab 2: keep it open.', 'AI Experience Thailand: AI Labs 2 & 3', 'our Lab 2 (RAG to Agents) and Lab 3 (Agent Memory)', labs12Shot);

/** the same page again before the coding part (owner, 6 Nov): the lecture is over, open the lab to run the notebook; a numbered page of its own, so Lab 3's running numbers carry on */
export const GO_LAB3_CODE: SceneDef = { ...GO_LAB3, id: '3.5g', title: 'Open the lab to code', pageZero: false, overlayProps: { ...GO_LAB3.overlayProps, line: 'Now we run it. Open your lab environment: the same one as Lab 2.' } };

export const GO_SCRIPT: Record<string, string> = {
  '1.0g': 'Before we start Lab 1, open your lab environment. Scan the code, or type the address on the screen. On LiveLabs it is called "The Economics of AI, Lab 1"; that is our Lab 1.',
  '0.4g': 'Before we start Lab 2, open your lab environment. Scan the code, or type the address on the screen. On LiveLabs it is called "AI Labs 2 and 3"; that is our Lab 2 and Lab 3.',
  '3.5g': "All right, that was the whole story. Now we run it for real. Please open your lab environment, the same one as Lab 2, with the address or the code on the screen. On LiveLabs it is called AI Labs 2 and 3. Once it is open, we will open the notebook together and watch each part work, one step at a time.",
  '3.0g': 'Lab 3 runs in the same environment as Lab 2. If you closed it, open it again with this address. It is the one called "AI Labs 2 and 3" on LiveLabs.',
};
