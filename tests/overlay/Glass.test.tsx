import { act, render } from '@testing-library/react';
import { useDrawerStore } from '../../src/engine/presentation';
import { Glass, GLASS_LAYERS, GLASS_FACTS, CURATION } from '../../src/overlay/concepts/Glass';

test('step 1: the glass fills bottom to top, Vance last with his portrait, the model reads only that, the rest is outside', () => {
  const c = render(<Glass kicker="k" message="m" step={1} />).container;
  expect(GLASS_LAYERS).toEqual(['System prompt', 'Developer instructions', 'Tool list', 'Retrieved notes', 'Chat so far', 'Vance’s question']);
  expect([...c.querySelectorAll('[data-layer]')].map((e) => e.getAttribute('data-layer'))).toEqual(GLASS_LAYERS);
  expect(c.querySelector('[data-layer="Vance’s question"] [data-portrait="vance"]')).not.toBeNull();
  expect(c.textContent).toContain('full line: no more fits');
  expect(c.textContent).toContain('it sees this,');
  expect(c.textContent).toContain('and nothing else');
  expect(c.textContent).toContain('the language model');
  expect(c.querySelector('[data-net="language-model"]')).not.toBeNull();
  expect(c.textContent).toContain('OUTSIDE THE GLASS');
  expect([...c.querySelectorAll('[data-outside-item]')].map((e) => e.getAttribute('data-outside-item'))).toEqual(['Mercer’s Day 1 chat (closed)', 'the database', 'yesterday']);
  expect(c.textContent?.match(/not seen/g)).toHaveLength(3);
  expect(GLASS_FACTS).toEqual(['Fixed size: it fills up.', 'It is the only thing the model reads.', 'We pour it in, every turn.']);
  for (const f of GLASS_FACTS) expect(c.textContent).toContain(f);
  expect(c.querySelectorAll('[data-problem]')).toHaveLength(0);
  expect(c.innerHTML).not.toMatch(/--red|#c74634/i);
});

test('step 2: four small glasses, each failing its own way, with the legend', () => {
  act(() => useDrawerStore.setState({ open: true, focus: 3 })); // all four showing: Next has added each glass
  {
    const c = render(<Glass kicker="k" message="m" step={2} />).container;
    expect([...c.querySelectorAll('[data-problem]')].map((e) => e.getAttribute('data-problem'))).toEqual(['Volume', 'Relevance', 'Accuracy', 'Timing']);
    for (const w of ['every tool result piles in; by turn 15 it overflows', 'Mercer’s finding spills out', 'the 25% falls out', 'by turn 15, when Vance asks, it is gone', 'grey = noise and old turns', 'teal = what Vance needs']) expect(c.textContent).toContain(w);
    // Mercer's finding is the one teal cell among the grey results
    expect(c.querySelectorAll('[data-piece="finding"]').length).toBeGreaterThanOrEqual(1);
    expect(c.querySelectorAll('[data-glass="Relevance"] [data-piece="finding"]')).toHaveLength(1);
    expect(c.querySelector('[data-glass="Accuracy"] [data-piece="lost"]')?.textContent).toBe('25%');
    expect(c.querySelectorAll('[data-layer]')).toHaveLength(0);
    expect(c.innerHTML).not.toMatch(/--red|#c74634/i);
  }
});

test('CURATION keeps its four problems and icons for Ending and the new pages', () => {
  expect(CURATION.map((x) => [x.word, x.icon])).toEqual([['Volume', 'overflow'], ['Relevance', 'target'], ['Accuracy', 'inspect'], ['Timing', 'clock']]);
});

test('step 2 builds inside the page: Volume at once, then one glass for each Next (owner, 4 Nov)', () => {
  const shown = (c: HTMLElement) => [...c.querySelectorAll('[data-problem][data-shown]')].map((e) => e.getAttribute('data-problem'));
  act(() => useDrawerStore.setState({ open: false, focus: 0 }));
  const c = render(<Glass kicker="k" message="m" step={2} />).container;
  expect(shown(c)).toEqual(['Volume']);
  expect(c.querySelectorAll('[data-glass="Volume"] [data-piece="turn"]').length).toBeGreaterThan(0);
  expect(c.querySelectorAll('[data-glass="Relevance"] [data-piece]')).toHaveLength(0);
  act(() => useDrawerStore.setState({ open: true, focus: 1 }));
  expect(shown(c)).toEqual(['Volume', 'Relevance']);
  act(() => useDrawerStore.setState({ open: true, focus: 3 }));
  expect(shown(c)).toEqual(['Volume', 'Relevance', 'Accuracy', 'Timing']);
  expect(c.querySelector('[data-problem][data-active]')!.getAttribute('data-problem')).toBe('Timing');
});
