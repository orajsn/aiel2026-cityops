// Writes follow/public/scripts.json for the phone follow app: every page's number, title, part and presenter script (English, and
// Thai where it exists). Run with: npx vite-node tools/export-follow-scripts.ts   (also run by tools/serve-vm.sh)
import { writeFileSync } from 'node:fs';
import { SCENES, pageLabel } from '../src/scenes/index';
import { SCRIPT_TH } from '../src/content/scriptTh';

const partName: Record<number, string> = { 0: 'Introduction', 3: 'Lab 1 · AI Economics', 1: 'Lab 2 · RAG to Agents', 2: 'Lab 3 · Agent Memory' };
const pages = SCENES.map((s) => ({
  id: s.id,
  label: pageLabel(s.id),
  part: partName[s.chapter] ?? '',
  title: s.title,
  en: (s.script ?? '').replace(/!!/g, ''),
  th: SCRIPT_TH[s.id]?.join('\n\n') ?? '',
}));
writeFileSync(new URL('../follow/public/scripts.json', import.meta.url), JSON.stringify({ made: new Date().toISOString(), pages }));
console.log(`follow scripts: ${pages.length} pages, ${pages.filter((p) => p.th).length} with Thai`);
