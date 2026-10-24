import { fireEvent, render } from '@testing-library/react';
import { highlightPython } from '../../src/overlay/jupyter/highlight';
import { LAB_STOPS, stopCells } from '../../src/content/labStops';
import { JupyterDrawer } from '../../src/overlay/jupyter/JupyterDrawer';
import { NotebookMarkdown } from '../../src/overlay/jupyter/NotebookMarkdown';

test('python colouring: keywords, strings, comments, numbers and def names, and nothing lost', () => {
  const src = 'def embed(self, n=384):\n    # TODO 1: fill in\n    return f"ok {n}"  # done';
  const tokens = highlightPython(src);
  expect(tokens.map((t) => t.text).join('')).toBe(src);
  const kind = (text: string) => tokens.find((t) => t.text === text)?.kind;
  expect(kind('def')).toBe('kw');
  expect(kind('embed')).toBe('def');
  expect(kind('384')).toBe('num');
  expect(kind('return')).toBe('kw');
  expect(kind('f"ok {n}"')).toBe('str');
  expect(kind('# TODO 1: fill in')).toBe('comment');
});

test('python colouring: a triple-quoted string stays one string across lines', () => {
  const src = 'X = """\nline one # not a comment\n"""\ny = 1';
  const tokens = highlightPython(src);
  expect(tokens.find((t) => t.kind === 'str')?.text).toBe('"""\nline one # not a comment\n"""');
  expect(tokens.some((t) => t.kind === 'comment')).toBe(false);
});

test('every stop points at real code cells, and what it says you will see is in that cell', () => {
  for (const [id, stop] of Object.entries(LAB_STOPS)) {
    const cells = stopCells(stop);
    expect(cells.length, id).toBeGreaterThan(0);
    for (const m of stop.marks) {
      const cell = stop.notebook.cells[m.cell];
      expect(cell?.type, `${id} cell ${m.cell}`).toBe('code');
      if (m.role === 'todo') expect(cell.source, `${id} cell ${m.cell}`).toContain(`TODO ${m.todo}`);
      // the literal part of the success line (before any {value}) is printed by that cell
      if (m.expect) expect(cell.source, `${id} cell ${m.cell}`).toContain(m.expect.split(/prism|ALL_MINILM/)[0].slice(0, 24));
    }
  }
});

test('Lab 3 page 15: a closed tab first; opening it shows the notebook cells with the run order', () => {
  const { container, getByRole } = render(<JupyterDrawer sceneId="3.6" />);
  expect(container.querySelector('.jd__panel')).toBeNull();
  fireEvent.click(getByRole('button', { name: /run in jupyter/i }));
  expect(container.querySelector('.jd__file')?.textContent).toContain('notebook_student_ollama.ipynb');
  const badges = [...container.querySelectorAll('[data-run]')].map((e) => e.getAttribute('data-run'));
  expect(badges).toEqual(['1', '2', '3', '4', '5', '6', '7']);
  expect(container.querySelector('[data-role="todo"]')?.textContent).toContain('YOUR CODE HERE');
  expect(container.querySelector('[data-role="skip"]')).not.toBeNull();
});

test('pages without a stop show nothing', () => {
  const { container } = render(<JupyterDrawer sceneId="3.5a" />);
  expect(container.innerHTML).toBe('');
});

test('notebook text: bold that contains an asterisk (CITY_*) still renders bold, with no stray marks', () => {
  const { container } = render(<NotebookMarkdown source={'**Run the cell below to wipe everything CITY_*, then re-run from Part 2.** If you have, **restart the kernel** after.'} />);
  const bold = [...container.querySelectorAll('b')].map((b) => b.textContent);
  expect(bold).toEqual(['Run the cell below to wipe everything CITY_*, then re-run from Part 2.', 'restart the kernel']);
  expect(container.textContent).not.toContain('**');
});
