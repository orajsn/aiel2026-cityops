/** Story sections for the page overview: each chapter split into the parts of its story, pages in order. */
export interface Section {
  chapter: 0 | 1 | 2;
  name: string;
  pages: string[];
}

export const CHAPTER_NAME = ['Introduction', 'Lab 2 · RAG to Agents', 'Lab 3 · Agent Memory'];

export const SECTIONS: Section[] = [
  { chapter: 0, name: 'The city and its data', pages: ['0.1', '0.2', '0.3'] },
  { chapter: 0, name: 'The question on the bridge', pages: ['0.4'] },
  { chapter: 0, name: 'One database, four shapes', pages: ['0.5', '0.6'] },
  { chapter: 0, name: 'One bridge, two problems', pages: ['0.7'] },
  { chapter: 1, name: 'Why a bare model is not enough', pages: ['2.1', '2.2', '2.3'] },
  { chapter: 1, name: 'From RAG to an agent', pages: ['2.4', '2.5', '2.6', '2.7', '2.8'] },
  { chapter: 1, name: 'Closing Lab 2', pages: ['2.9'] },
  { chapter: 2, name: 'The agent that forgets', pages: ['3.0', '3.1a', '3.1b', '3.1c'] },
  { chapter: 2, name: 'How memory works', pages: ['3.2a', '3.2b', '3.2c', '3.2d', '3.2e', '3.3a', '3.3b', '3.4', '3.5a', '3.5b', '3.6'] },
  { chapter: 2, name: 'Writing and finding memories', pages: ['3.7', '3.8', '3.9', '3.10', '3.11', '3.12'] },
  { chapter: 2, name: 'Back on the bridge', pages: ['3.13', '3.14', '3.15', '3.16'] },
  { chapter: 2, name: 'Takeaways', pages: ['3.17'] },
];
