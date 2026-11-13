// Where does a page live?   npx vite-node .claude/skills/cityops-live/scripts/where.ts <page id | part of the title>
//   npx vite-node .claude/skills/cityops-live/scripts/where.ts 3.6m
//   npx vite-node .claude/skills/cityops-live/scripts/where.ts "why oracle"
// Prints the page's number, part, camera shot, overlay (and the file of its component), its script state, the clicks inside it,
// whether it is hidden, where it is defined and which tests mention it. Read-only.
import { execSync } from 'node:child_process';
import { SCENES, pageLabel } from '../../../../src/scenes/index';
import { SCRIPT_TH } from '../../../../src/content/scriptTh';
import { STEP_PAGES } from '../../../../src/content/scriptSteps';
import { PAGE_STEPS, focusStepCount } from '../../../../src/engine/presentation';
import { LAB2_CUT } from '../../../../src/scenes/chapter1';
import { LAB3_CUT } from '../../../../src/scenes/chapter2';
import { CHAPTER_NAME } from '../../../../src/scenes/sections';

const q = process.argv.slice(2).join(' ').trim();
if (!q) {
  console.log('usage: npx vite-node .claude/skills/cityops-live/scripts/where.ts <page id | part of the title>');
  process.exit(1);
}
const sh = (c: string) => {
  try {
    return execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};
const hits = SCENES.filter((s) => s.id === q).concat(SCENES.filter((s) => s.id !== q && (s.title.toLowerCase().includes(q.toLowerCase()) || s.id.startsWith(q))));
if (!hits.length) {
  const hidden = [...LAB2_CUT, ...LAB3_CUT].filter((id) => id === q);
  console.log(hidden.length ? `"${q}" is a HIDDEN page (LAB2_CUT / LAB3_CUT): its code is still in src/scenes, it is not in the show.` : `no page matches "${q}"`);
  if (hidden.length) console.log(sh(`grep -rn "'${q}'" src/scenes | head -5`));
  process.exit(0);
}
for (const s of hits.slice(0, 6)) {
  const part = CHAPTER_NAME[s.chapter];
  console.log(`\n=== page ${pageLabel(s.id)} · ${s.title}   (id ${s.id}, ${part})`);
  console.log(`camera shot : ${s.shot}${s.sameAngleAs ? ` (same angle as ${s.sameAngleAs})` : ''}   world: ${JSON.stringify(s.world ?? {})}`);
  if (s.overlay) {
    const reg = sh(`grep -rn "registerOverlay('${s.overlay}'" src/overlay | head -1`);
    const comp = reg.match(/registerOverlay\('[^']+', (\w+)\)/)?.[1];
    const regFile = reg.split(':')[0];
    const compFile = comp ? sh(`grep -rln "export function ${comp}\\b\\|export const ${comp}\\b" src/overlay | head -1`) : '';
    console.log(`overlay     : ${s.overlay} -> component ${comp ?? '?'} in ${compFile || '?'}   (registered in ${regFile || '?'})`);
    console.log(`overlay props: ${Object.keys(s.overlayProps ?? {}).join(', ') || '(none)'}${s.overlayGroup ? `   group: ${s.overlayGroup}` : ''}`);
  } else console.log('overlay     : none (the 3D view alone)');
  const steps = PAGE_STEPS[s.id] ?? 0;
  console.log(`clicks inside: ${steps ? `${steps} (PAGE_STEPS in src/engine/presentation.ts: the page builds up, one part per Next)` : focusStepCount(s.id) ? `${focusStepCount(s.id)} (notebook focus steps)` : 'none'}${STEP_PAGES[s.id] ? `; one script per click: ${STEP_PAGES[s.id]} stops (src/content/scriptSteps.ts)` : ''}`);
  console.log(`script      : English ${s.script ? `${s.script.length} chars (src/scenes/script.ts, lab1.ts or labGo.ts)` : 'MISSING'}; Thai ${SCRIPT_TH[s.id] ? `${SCRIPT_TH[s.id].length} paragraph(s) (src/content/scriptTh.ts)` : 'none (the phone shows English)'}`);
  console.log(`hidden?     : ${LAB2_CUT.has(s.id) ? 'yes, in LAB2_CUT' : LAB3_CUT.has(s.id) ? 'yes, in LAB3_CUT' : 'no, it is in the show'}`);
  console.log(`defined in  :\n${sh(`grep -rn "'${s.id}'" src/scenes/chapter0.ts src/scenes/lab1.ts src/scenes/chapter1.ts src/scenes/chapter2.ts src/scenes/labGo.ts | cut -c1-150 | head -4`) || '  (built by a helper: search the id in src/scenes)'}`);
  console.log(`tests       : ${sh(`grep -rln "'${s.id}'" tests | head -8`).split('\n').filter(Boolean).join(', ') || 'none name it'}`);
}
if (hits.length > 6) console.log(`\n(${hits.length - 6} more matches: use the exact id)`);
