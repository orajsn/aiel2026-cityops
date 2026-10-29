import { LAB1_SECTIONS, WITH_LAB1 } from './lab1';

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
  ...(WITH_LAB1 ? LAB1_SECTIONS : []),
  // Lab 2 opens with the pages that were the Introduction's second half (owner, 29 Oct); ids kept
  { chapter: 1, name: 'The data and the question', pages: ['0.3', '0.4'] },
  { chapter: 1, name: 'One database, one model', pages: ['0.5', '0.6'] },
  { chapter: 1, name: 'Why a bare model is not enough', pages: ['2.1', '2.2', '2.3'] },
  { chapter: 1, name: 'From RAG to an agent', pages: ['2.4', '2.5', '2.6', '2.7', '2.8'] },
  { chapter: 1, name: 'Closing Lab 2', pages: ['2.9'] },
  { chapter: 2, name: 'The agent that forgets', pages: ['3.0', '3.1a', '3.1b', '3.1c'] },
  { chapter: 2, name: 'How memory works', pages: ['3.2a', '3.2b', '3.2p', '3.2q', '3.2r', '3.2c', '3.2e', '3.3a', '3.3b', '3.4a', '3.4b', '3.4c', '3.4d', '3.5b', '3.6'] },
  { chapter: 2, name: 'Writing and finding memories', pages: ['3.7', '3.8a', '3.8b', '3.9', '3.10', '3.11', '3.12a', '3.12b'] },
  { chapter: 2, name: 'Back on the bridge', pages: ['3.13', '3.14', '3.15', '3.15b', '3.15c', '3.16'] },
  { chapter: 2, name: 'Takeaways', pages: ['3.17'] },
];
