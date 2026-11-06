import { LAB1_SECTIONS, WITH_LAB1 } from './lab1';
import { LAB2_CHAPTERS } from './chapter1';

/** Story sections for the page overview: each chapter split into the parts of its story, pages in order. */
export interface Section {
  chapter: 0 | 1 | 2 | 3;
  name: string;
  pages: string[];
}

export const CHAPTER_NAME = ['Introduction', 'Lab 2 · RAG to Agents', 'Lab 3 · Agent Memory', 'Lab 1 · AI Economics'];
/** the parts in show order: Lab 1 (chapter 3) plays between the Introduction and Lab 2 when it is in the show */
export const PARTS: (0 | 1 | 2 | 3)[] = WITH_LAB1 ? [0, 3, 1, 2] : [0, 1, 2];

export const SECTIONS: Section[] = [
  { chapter: 0, name: 'The city', pages: ['0.0', '0.1', '0.2'] },
  { chapter: 0, name: 'One bridge, three labs', pages: ['0.7', '0.7a', '0.7b', '0.7c'] },
  ...(WITH_LAB1 ? LAB1_SECTIONS.map((s, i) => (i === 0 ? { ...s, pages: ['1.0g', ...s.pages] } : s)) : []),
  // Lab 2 follows the Harbor Bridge deck's chapters (owner, 29 Oct): Story, Why, §0 to §6, then the recap
  ...LAB2_CHAPTERS.map((c, i): Section => ({ chapter: 1, name: c.name, pages: [...(i === 0 ? ['0.4g'] : []), ...c.pages.map((p) => p.id)] })),
  { chapter: 2, name: 'The agent that forgets', pages: ['3.0g', '3.0', '3.2f', '3.2g', '3.1h', '3.1i'] },
  { chapter: 2, name: 'How memory works', pages: ['3.3h', '3.3i', '3.3j', '3.3p', '3.3a', '3.3b', '3.3f', '3.5h'] },
  { chapter: 2, name: 'The code, on one map', pages: ['3.6m'] },
  { chapter: 2, name: 'Back on the bridge', pages: ['3.15', '3.15b', '3.15c', '3.16', '3.16a'] },
  { chapter: 2, name: 'Closing Lab 3', pages: ['3.17'] },
  { chapter: 2, name: 'Takeaways · all three labs', pages: ['3.18'] },
];
