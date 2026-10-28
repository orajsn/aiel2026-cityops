import { render } from '@testing-library/react';
import { Glass, CURATION_FIX } from '../../src/overlay/concepts/Glass';
import { chapter2 } from '../../src/scenes/chapter2';

// owner, 28 Oct: on page 12, which discipline solves which of the four curation problems
test('click 3 maps the four problems to the three disciplines: two each, Volume and Timing twice', () => {
  const c = render(<Glass kicker="k" message="m" step={3} />).container;
  expect([...c.querySelectorAll('[data-problem-chip]')].map((e) => e.getAttribute('data-problem-chip'))).toEqual(['Volume', 'Relevance', 'Accuracy', 'Timing']);
  const links = [...c.querySelectorAll('[data-link]')].map((e) => e.getAttribute('data-link'));
  expect(links.sort()).toEqual(
    ['Memory engineering>Volume', 'Memory engineering>Accuracy', 'Context engineering>Relevance', 'Context engineering>Timing', 'Harness engineering>Timing', 'Harness engineering>Volume'].sort(),
  );
  for (const w of ['stores and offloads', 'controls what gets summarized', 'pulls only what matters for this query', 'retrieves at the moment of inference, not at session start', 'guarantees retrieval on every call', 'enforces offloading after every tool execution'])
    expect(c.textContent).toContain(w);
  expect(CURATION_FIX).toHaveLength(3);
});

test('the map is the glass panel’s third click, at the rust like the two before it', () => {
  const ids = chapter2.map((s) => s.id);
  expect(ids.slice(ids.indexOf('3.3a'), ids.indexOf('3.3a') + 3)).toEqual(['3.3a', '3.3b', '3.3c']);
  const [a, c] = ['3.3a', '3.3c'].map((id) => chapter2.find((s) => s.id === id)!);
  expect(c.overlayGroup).toBe(a.overlayGroup);
  expect(c.shot).toBe(a.shot);
});
