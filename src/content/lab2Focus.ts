/**
 * Lab 2's notebook focus (owner, 29 Oct): after a page has explained an idea, the Jupyter drawer opens on the WHOLE
 * notebook (src/content/notebooks/lab2_rag_to_agents.json), scrolls to the cell, and points at its lines one click
 * at a time, with numbered callouts that match the page's picture. Next walks the steps, then closes the drawer and
 * goes on to the next page; Back walks them in reverse (src/engine/presentation.ts, src/overlay/jupyter/FocusDrawer.tsx).
 *
 * This file is the meeting point between the page agent (who writes the steps) and the drawer (which reads them for
 * any scene id). tests/overlay/FocusDrawer.test.tsx checks every step points at a real code cell and real lines.
 */
export interface FocusStep {
  /** index of the cell in src/content/notebooks/lab2_rag_to_agents.json (cells array, 0-based) */
  cell: number;
  /** 1-based inclusive line ranges inside that cell's source to highlight; omit to highlight the whole cell */
  lines?: [number, number][];
  /** the callout number shown on the code, matching the picture's numbered step */
  n: number;
  /** short label next to the callout, e.g. "Embedding model runs inside Oracle" */
  label: string;
  /** optional "Here: …" note shown under the highlight */
  note?: string;
  /** show the cell's saved output under it at this step */
  output?: boolean;
}

/** per scene id: the notebook focus sequence that plays AFTER the page's own explanation */
export const LAB2_FOCUS: Record<string, FocusStep[]> = {
  // demo (the drawer agent's): page 2.2, §1.2 Embed a query (cell 21), then a glance at the retriever (cell 23)
  '2.2': [
    { cell: 21, lines: [[6, 6]], n: 1, label: 'Your question, in plain words', note: 'the question goes in as a bind variable, :q' },
    { cell: 21, lines: [[3, 3]], n: 2, label: 'Embedding model runs inside Oracle', note: 'the text becomes a vector inside the database' },
    { cell: 21, lines: [[8, 9]], n: 3, label: 'Out come 384 numbers', output: true },
    { cell: 23, lines: [[13, 15], [18, 19]], n: 4, label: 'Rank by closeness in meaning', note: 'rank by closeness in meaning, keep only k' },
  ],
};
