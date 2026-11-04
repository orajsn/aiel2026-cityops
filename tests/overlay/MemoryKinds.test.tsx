import { act, render, waitFor } from '@testing-library/react';
import { useDrawerStore } from '../../src/engine/presentation';
import { DeskCabinet, SharedShelf, ThreeKinds, MERCER_NOTES } from '../../src/overlay/concepts/MemoryKinds';

const noRed = (c: HTMLElement) => expect(c.innerHTML).not.toMatch(/--red|#c74634/i);

beforeEach(() => useDrawerStore.getState().reset());

test('desk: Mercer’s three notes in order, the copilot card, then the chat closes and the desk is wiped', async () => {
  const c = render(<DeskCabinet kicker="k" message="m" step={1} />).container;
  const notes = [...c.querySelectorAll('[data-card="mercer"]')].map((n) => n.textContent ?? '');
  expect(notes).toHaveLength(3);
  MERCER_NOTES.forEach((t, i) => {
    expect(notes[i]).toContain(t);
    expect(notes[i]).toContain('Mercer');
  });
  expect(c.querySelector('[data-card="copilot"]')?.textContent).toContain('Noted.');
  expect(c.textContent).toContain('the context window · the session');
  expect(c.querySelector('[data-portrait="mercer"]')).not.toBeNull();
  expect(c.querySelector('[data-desk="wiped"]')?.getAttribute('data-wiped')).toBe('false');
  // nothing wipes the desk by itself: it waits for the next Next (PAGE_STEPS)
  await new Promise((r) => setTimeout(r, 1500));
  expect(c.querySelector('[data-desk="wiped"]')?.getAttribute('data-wiped')).toBe('false');
  act(() => useDrawerStore.setState({ open: true, focus: 1 }));
  await waitFor(() => expect(c.querySelector('[data-desk="wiped"]')?.getAttribute('data-wiped')).toBe('true'), { timeout: 5000 });
  expect(c.textContent).toContain('the chat closes: the desk is swept clean');
  noRed(c);
}, 8000);

test('cabinet: three drawers, kept in Oracle AI Database, Day 2 Vance asks what happened at this pier', () => {
  const c = render(<DeskCabinet kicker="k" message="m" step={2} />).container;
  expect(c.querySelectorAll('[data-drawer]')).toHaveLength(3);
  expect(c.querySelectorAll('[data-note]')).toHaveLength(3);
  expect(c.textContent).toContain('kept in Oracle AI Database');
  const day2 = c.querySelector('[data-day2]')!;
  expect(day2.textContent).toContain('Vance');
  expect(day2.textContent).toContain('What happened at this pier?');
  expect(day2.querySelector('[data-portrait="vance"]')).not.toBeNull();
  expect(c.querySelector('[data-portrait="mercer"]')).not.toBeNull();
  noRed(c);
});

test('the desk and the cabinet are one panel: changing step keeps it mounted', () => {
  const r = render(<DeskCabinet kicker="k" message="m" step={1} />);
  const panel = r.container.querySelector('[data-testid="desk-cabinet"]');
  r.rerender(<DeskCabinet kicker="k" message="m" step={2} />);
  expect(r.container.querySelector('[data-testid="desk-cabinet"]')).toBe(panel);
  expect(panel?.getAttribute('data-step')).toBe('2');
});

test('three kinds: Mercer’s report, three cards in order, Vance’s three questions each for its card', () => {
  const c = render(<ThreeKinds kicker="k" message="m" />).container;
  expect([...c.querySelectorAll('[data-fragment]')].map((f) => f.getAttribute('data-fragment'))).toEqual(['Episodic', 'Semantic', 'Procedural']);
  expect([...c.querySelectorAll('[data-kind]')].map((f) => f.getAttribute('data-kind'))).toEqual(['Episodic', 'Semantic', 'Procedural']);
  expect([...c.querySelectorAll('[data-question]')].map((q) => q.getAttribute('data-question'))).toEqual(['Episodic', 'Semantic', 'Procedural']);
  for (const w of ['What happened', 'What is true', 'How to do the job', 'EPISODIC MEMORY', 'SEMANTIC MEMORY', 'PROCEDURAL MEMORY', 'What happened here?', 'How bad is it?', 'What do I do first?', 'Mercer', 'Vance', '~25%'])
    expect(c.textContent).toContain(w);
  expect(c.querySelector('[data-portrait="mercer"]')).not.toBeNull();
  expect(c.querySelector('[data-portrait="vance"]')).not.toBeNull();
  noRed(c);
});

test('shared shelf: private drawer with a lock, the Harbor Bridge shelf with two cards by Mercer, Vance’s lines', () => {
  const c = render(<SharedShelf kicker="k" message="m" />).container;
  expect(c.querySelector('[data-drawer="private"]')?.textContent).toContain('swap shifts Tuesday');
  expect(c.querySelector('[data-drawer="private"] [data-portrait="mercer"]')).not.toBeNull();
  expect(c.querySelector('[data-lock="not-his"]')?.textContent).toContain('not his');
  const shelf = c.querySelector('[data-shelf="Harbor Bridge"]')!;
  expect(shelf.textContent).toContain('Harbor Bridge');
  const cards = [...shelf.querySelectorAll('[data-shelf-card]')];
  expect(cards.map((x) => x.getAttribute('data-shelf-card'))).toEqual(['Guideline', 'Finding']);
  expect(cards[0].textContent).toContain('remove loose corrosion before coating');
  expect(cards[1].textContent).toContain('~25% section loss, repair within 60 days');
  cards.forEach((x) => {
    expect(x.textContent).toContain('written by Mercer');
    expect(x.querySelector('[data-portrait="mercer"]')).not.toBeNull();
  });
  expect(c.querySelector('[data-vance]')?.textContent).toContain('Vance');
  expect(c.querySelector('[data-vance] [data-portrait="vance"]')).not.toBeNull();
  expect(c.querySelectorAll('[data-line="shelf"]')).toHaveLength(2);
  expect(c.querySelector('[data-enforced]')?.textContent).toContain('The database enforces this: Vance’s search can’t reach Mercer’s private notes.');
  noRed(c);
});
