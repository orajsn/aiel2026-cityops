// Writes follow/public/scripts.json for the phone follow app: every page's number, title, part and presenter script (English, and
// Thai where it exists). Run with: npx vite-node tools/export-follow-scripts.ts   (also run by tools/serve-vm.sh)
import { writeFileSync } from 'node:fs';
import { SCENES, pageLabel } from '../src/scenes/index';
import { SCRIPT_TH } from '../src/content/scriptTh';
import { STEP_EN, STEP_TH, STEP_PAGES, stepScriptId } from '../src/content/scriptSteps';
import { MAP_STEPS, stepName } from '../src/content/lab3Map';

const partName: Record<number, string> = { 0: 'Introduction', 3: 'Lab 1 · AI Economics', 1: 'Lab 2 · RAG to Agents', 2: 'Lab 3 · Agent Memory' };
const pages = SCENES.flatMap((s) => {
  const page = {
    id: s.id,
    label: pageLabel(s.id),
    part: partName[s.chapter] ?? '',
    title: s.title,
    en: (s.script ?? '').replace(/!!/g, ''),
    th: SCRIPT_TH[s.id]?.join('\n\n') ?? '',
  };
  // a page with a script per click: one entry per click, 11, 11a, 11b...
  const clicks = STEP_PAGES[s.id] ?? 0;
  const more = Array.from({ length: Math.max(0, clicks - 1) }, (_, i) => ({
    ...page,
    id: stepScriptId(s.id, i + 1),
    label: `${page.label}${String.fromCharCode(97 + i)}`,
    title: stepName(MAP_STEPS[i + 1]),
    en: STEP_EN[s.id][i + 1],
    th: STEP_TH[s.id][i + 1],
  }));
  return [page, ...more];
});
writeFileSync(new URL('../follow/public/scripts.json', import.meta.url), JSON.stringify({ made: new Date().toISOString(), pages }));
console.log(`follow scripts: ${pages.length} pages, ${pages.filter((p) => p.th).length} with Thai`);
