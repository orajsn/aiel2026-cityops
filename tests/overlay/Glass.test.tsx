import { render } from '@testing-library/react';
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

test('steps 2 to 5: one problem per click, a big glass, its explanation, what Vance gets, and a tracker of the four', () => {
  const words = ['Volume', 'Relevance', 'Accuracy', 'Timing'];
  words.forEach((w, i) => {
    const c = render(<Glass kicker="k" message="m" step={(i + 2) as 2 | 3 | 4 | 5} />).container;
    expect([...c.querySelectorAll('[data-problem]')].map((e) => e.getAttribute('data-problem'))).toEqual([w]);
    expect(c.querySelectorAll('[data-glass]')).toHaveLength(1);
    expect(c.querySelector('[data-glass]')!.getAttribute('data-glass')).toBe(w);
    expect(c.textContent).toContain(CURATION[i].title);
    expect(c.querySelector('[data-outcome]')?.textContent).toContain('Vance gets');
    expect([...c.querySelectorAll('[data-track]')].map((e) => e.getAttribute('data-track'))).toEqual(words);
    expect(c.querySelector('[data-track][data-on]')!.getAttribute('data-track')).toBe(w);
    expect(c.querySelectorAll('[data-layer]')).toHaveLength(0);
    expect(c.innerHTML).not.toMatch(/--red|#c74634/i);
  });
  const r = render(<Glass kicker="k" message="m" step={3} />).container;
  expect(r.querySelectorAll('[data-glass="Relevance"] [data-piece="finding"]')).toHaveLength(1);
  const a = render(<Glass kicker="k" message="m" step={4} />).container;
  expect(a.querySelector('[data-glass="Accuracy"] [data-piece="lost"]')?.textContent).toBe('25%');
  const t = render(<Glass kicker="k" message="m" step={5} />).container;
  expect(t.querySelector('[data-glass="Timing"] [data-piece="finding"]')).not.toBeNull();
  expect(t.querySelector('[data-glass="Timing"] [data-piece="gone"]')).not.toBeNull();
  expect(t.querySelector('[data-glass="Timing"] [data-piece="ask"]')?.textContent).toContain('Vance asks');
  expect(t.querySelectorAll('[data-glass="Timing"] [data-piece="turn"]')).toHaveLength(5);
});

test('CURATION keeps its four problems and icons for Ending and the new pages', () => {
  expect(CURATION.map((x) => [x.word, x.icon])).toEqual([['Volume', 'overflow'], ['Relevance', 'target'], ['Accuracy', 'inspect'], ['Timing', 'clock']]);
});
