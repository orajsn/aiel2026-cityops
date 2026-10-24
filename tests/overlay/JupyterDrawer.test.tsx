import { fireEvent, render } from '@testing-library/react';
import { highlightPython } from '../../src/overlay/jupyter/highlight';
import { LAB_STOPS, stopCells, todoLines } from '../../src/content/labStops';
import { JupyterDrawer } from '../../src/overlay/jupyter/JupyterDrawer';
import { NotebookMarkdown } from '../../src/overlay/jupyter/NotebookMarkdown';
import { chapter1 } from '../../src/scenes/chapter1';
import { chapter2 } from '../../src/scenes/chapter2';

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

/** the strings a cell prints with ok(...) or print(...), as patterns: an f-string's {value} matches anything */
function printed(source: string): RegExp[] {
  return [...source.matchAll(/(?:ok|print)\(\s*f?(?:"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)')/g)].map((m) => {
    const lit = (m[1] ?? m[2]).replace(/\\n/g, '\n').replace(/\\(.)/g, '$1');
    const parts = lit.split(/\{[^}]*\}/).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp('^\\s*' + parts.join('[\\s\\S]*'));
  });
}

test('every stop points at real code cells, and each success line is one the cell really prints', () => {
  for (const [id, stop] of Object.entries(LAB_STOPS)) {
    expect(stopCells(stop).length, id).toBeGreaterThan(0);
    for (const m of stop.marks) {
      const cell = stop.notebook.cells[m.cell];
      expect(cell?.type, `${id} cell ${m.cell}`).toBe('code');
      expect(m.cell >= stop.from && m.cell <= stop.to, `${id} cell ${m.cell} inside the stop`).toBe(true);
      if (m.role === 'todo') expect(cell.source, `${id} cell ${m.cell}`).toContain(`TODO ${m.todo}`);
      if (m.expect) expect(printed(cell.source).some((re) => re.test(m.expect!.replace(/…/g, 'x'))), `${id} cell ${m.cell}: ${m.expect}`).toBe(true);
    }
  }
});

test('every stop sits on a real page, and every TODO in the Lab 3 notebook has a stop', () => {
  const ids = new Set([...chapter1, ...chapter2].map((s) => s.id));
  for (const id of Object.keys(LAB_STOPS)) expect(ids.has(id), id).toBe(true);
  const todos = new Set(Object.values(LAB_STOPS).flatMap((s) => s.marks.filter((m) => m.role === 'todo').map((m) => m.todo)));
  expect([...todos].sort()).toEqual([1, 2, 3, 4, 5, 6]);
});

test('every code cell of both notebooks is in a stop', () => {
  const seen = new Map<object, Set<number>>();
  for (const stop of Object.values(LAB_STOPS)) {
    const s = seen.get(stop.notebook) ?? new Set<number>();
    stop.marks.forEach((m) => s.add(m.cell));
    seen.set(stop.notebook, s);
  }
  expect(seen.size).toBe(2);
  for (const [nb, cells] of seen) {
    const code = (nb as { cells: { type: string }[] }).cells.map((c, i) => (c.type === 'code' ? i : -1)).filter((i) => i >= 0);
    expect(code.filter((i) => !cells.has(i))).toEqual([]);
  }
});

test('the drawer never shows a word the screen must not show', () => {
  for (const id of Object.keys(LAB_STOPS)) {
    const { container, getByRole, unmount } = render(<JupyterDrawer sceneId={id} />);
    fireEvent.click(getByRole('button', { name: /run in jupyter/i }));
    expect(container.textContent, id).not.toMatch(/Kirkland|\bMEA\b|\bMWA\b|\bBMA\b|fictional/);
    unmount();
  }
});

test('TODO cells: only the lines people type into are marked, not the ready-made code around them', () => {
  const lines = ['        t = None', '    # TODO 2: build the content string (2 lines).', '    # YOUR CODE HERE', '    pass', '    return ids'];
  expect([...todoLines(lines, 2)]).toEqual([1, 2, 3]);
  expect([...todoLines(['    user_id=None,                # <-- TODO 3: replace None', '    k=5,'], 3)]).toEqual([0]);
  expect([...todoLines(['    # TODO 4: compute the embedding.', '    # YOUR CODE HERE  (1 line; assign to `vec`)', '    vec = None', '    cur.execute(sql)'], 4)]).toEqual([0, 1, 2]);
  // empty placeholders ([] as well as None) are marked; a "Pre-built" comment ends the place to type
  expect([...todoLines(['    # TODO 6 (b): find similar.', '    # YOUR CODE HERE', '    similar = []', '', '    # Pre-built: format them.'], 6)]).toEqual([0, 1, 2]);
  expect([...todoLines(['    # TODO 4: embed.', '    vec = None', '    # Pre-built: INSERT with named binds + commit.'], 4)]).toEqual([0, 1]);
  // a placeholder string to write into (TODO 5's SQL) is marked whole
  expect([...todoLines(['    # TODO 5: write the SQL string (~7 lines).', '    sql = """', '    -- YOUR SQL HERE', '    """', '', '    # Pre-built: execute', '    with conn:'], 5)]).toEqual([0, 1, 2, 3]);
  // a ready-made comment that mentions another TODO is not a place to type
  expect([...todoLines(['    # Pre-built: same wrap as TODO 4.', '    q = embed(x)', '    # TODO 5: write the SQL string (~7 lines).', '    sql = None'], 5)]).toEqual([2, 3]);
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

test('Lab 2 page 4: the optional section says it is optional', () => {
  const { container, getByRole } = render(<JupyterDrawer sceneId="2.4" />);
  fireEvent.click(getByRole('button', { name: /run in jupyter/i }));
  expect(container.querySelector('.jd__file')?.textContent).toContain('rag_to_agents_lab.ipynb');
  expect(container.querySelector('.jd__todo-line')?.textContent).toMatch(/optional/i);
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

test('iPad: the drawer adds no full-screen layer over the page buttons, and its notebook scrolls by finger', async () => {
  const css = (await import('../../src/styles.css?raw')).default as string;
  const rule = (sel: string) => css.match(new RegExp(`\n${sel.replace('.', '\.')} \{([^}]*)\}`))?.[1] ?? '';
  // the wrapper is a zero-size anchor: only the handle and the open panel take touches
  expect(rule('.jd')).toMatch(/width: 0/);
  expect(rule('.jd')).toMatch(/height: 0/);
  expect(rule('.jd')).not.toMatch(/inset: 0/);
  expect(rule('.jd__nb')).toMatch(/touch-action: pan-y/);
  expect(rule('.jd__nb')).toMatch(/overscroll-behavior: contain/);
});
