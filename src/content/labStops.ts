import lab3Student from './notebooks/lab3_student.json';

/**
 * The lab guide's stops: on these pages the audience goes to JupyterLab and runs cells. Each stop is a slice of a
 * notebook (cells copied as they are, never changed) with the cells to run marked in order. Cells are counted
 * from 0 in the .ipynb; the screen never shows those numbers (Jupyter shows none either until a cell runs),
 * it shows the cells themselves so people find them by their first line.
 */
export interface NotebookCell {
  type: 'code' | 'markdown' | 'raw';
  source: string;
}
export interface Notebook {
  file: string;
  cells: NotebookCell[];
}
/** run: run it as it is · todo: fill in, then run · check: the checkpoint that proves the TODO · skip: optional, not now */
export type MarkRole = 'run' | 'todo' | 'check' | 'skip';
export interface CellMark {
  cell: number;
  role: MarkRole;
  todo?: number;
  /** the line the cell prints when it worked (its ok() or print), as the audience will see it */
  expect?: string;
  /** one short line for the audience */
  say?: string;
}
export interface LabStop {
  notebook: Notebook;
  /** where in the notebook, in the notebook's own words */
  where: string;
  from: number;
  to: number;
  marks: CellMark[];
  minutes: string;
}

export const LAB3_STUDENT = lab3Student as Notebook;

export const LAB_STOPS: Record<string, LabStop> = {
  // Lab 3 page 15 · One connection
  '3.6': {
    notebook: LAB3_STUDENT,
    where: 'Part 1: Oracle Setup · Part 2: The Embedder and SDK',
    from: 4,
    to: 20,
    minutes: 'about 5 min',
    marks: [
      { cell: 6, role: 'run', expect: 'Helpers loaded: ok, show_table, print_json' },
      { cell: 7, role: 'run', expect: 'Config ready: db=prism@aidbfree:1521/FREEPDB1  …' },
      { cell: 8, role: 'run', say: 'No output: it only defines connect_to_oracle().' },
      { cell: 9, role: 'run', expect: 'Connected - using user prism' },
      { cell: 12, role: 'skip', say: 'Skip on your first run. Only to start over.' },
      { cell: 15, role: 'todo', todo: 1, say: 'Fill in embed(): two lines. Stuck? Open the answer below it.' },
      { cell: 18, role: 'check', expect: 'TODO 1 passed - embedder returns float32 (n, 384) arrays' },
      { cell: 20, role: 'run', expect: 'OracleAgentMemory ready. Tables under prefix CITY_*' },
    ],
  },
};

export interface StopCell {
  index: number;
  cell: NotebookCell;
  mark?: CellMark;
  /** 1, 2, 3… for the cells to run, in order; none for skipped cells and text */
  run?: number;
}

export function stopCells(stop: LabStop): StopCell[] {
  let n = 0;
  const out: StopCell[] = [];
  for (let i = stop.from; i <= stop.to; i++) {
    const cell = stop.notebook.cells[i];
    if (!cell) continue;
    const mark = stop.marks.find((m) => m.cell === i);
    out.push({ index: i, cell, mark, run: mark && mark.role !== 'skip' ? ++n : undefined });
  }
  return out;
}
