import { render } from '@testing-library/react';
import { Discipline, WhoFixesWhat } from '../../src/overlay/concepts/Engineering';

const fixed = (c: HTMLElement) => [...c.querySelectorAll('[data-fix]')].map((e) => e.getAttribute('data-fix'));
const unfixed = (c: HTMLElement) => [...c.querySelectorAll('[data-unfixed]')].map((e) => e.getAttribute('data-unfixed'));

test('memory: filing steps with Mercer, the records, and the Volume and Accuracy ticks', () => {
  const c = render(<Discipline kicker="k" message="m" which="memory" />).container;
  expect(c.querySelector('[data-which="memory"]')).toBeTruthy();
  expect([...c.querySelectorAll('[data-step]')].map((e) => e.getAttribute('data-step')).filter((s) => /^[123]$/.test(s!))).toContain('1');
  expect(c.querySelector('img[alt="Evelyn_H_Mercer"]')).toBeTruthy();
  for (const w of ['IN EVERYDAY LIFE'.toLowerCase(), 'oracle ai database', 'fact: ~25% section loss', 'offload to the store', 'the fact kept on its own']) expect(c.textContent!.toLowerCase()).toContain(w);
  expect(fixed(c)).toEqual(['Volume', 'Accuracy']);
  expect(unfixed(c)).toEqual(['Relevance', 'Timing']);
  expect(c.innerHTML).not.toMatch(/--red|#c74634/i);
});

test('context: Vance asks, three ticks', () => {
  const c = render(<Discipline kicker="k" message="m" which="context" />).container;
  expect(c.querySelector('img[alt="Jordan_Vance"]')).toBeTruthy();
  expect(fixed(c)).toEqual(['Volume', 'Relevance', 'Timing']);
  expect(unfixed(c)).toEqual(['Accuracy']);
  for (const w of ['compress', 'retrieve + filter', 'built for this turn', 'her guideline']) expect(c.textContent).toContain(w);
});

test('harness: four stations in order, the SDKs, the counter, and the closing line', () => {
  const c = render(<Discipline kicker="k" message="m" which="harness" />).container;
  expect([...c.querySelectorAll('[data-station]')].map((e) => e.getAttribute('data-station'))).toEqual(['Read', 'Act', 'Write', 'Summarize']);
  for (const w of ['LangGraph', 'Claude Agent SDK', 'OpenAI Agents SDK', 'your own Python', 'SHIFT ROUTINE', 'Read the log first', 'Write the log last', 'Nobody has to remember to look. The loop does it every time.']) expect(c.textContent).toContain(w);
  expect(fixed(c)).toEqual(['Volume', 'Timing']);
  expect(c.textContent).toContain('write + compact every turn');
  expect(c.textContent).toContain('read on every call');
});

test('who fixes what: seven filled cells, row by row', () => {
  const c = render(<WhoFixesWhat kicker="k" message="m" />).container;
  const cells = [...c.querySelectorAll('[data-cell]')].map((e) => e.getAttribute('data-cell'));
  expect(cells).toEqual(['Memory>Volume', 'Context>Volume', 'Harness>Volume', 'Context>Relevance', 'Memory>Accuracy', 'Context>Timing', 'Harness>Timing']);
  expect(c.textContent).toContain('Accuracy / Fidelity');
  expect(c.textContent).toContain('a summary loses the 25%');
  expect(c.innerHTML).not.toMatch(/--red|#c74634/i);
});
