import { render } from '@testing-library/react';
import { MemoryMap } from '../../src/overlay/concepts/MemoryMap';
import { chapter2 } from '../../src/scenes/chapter2';

const steps = (c: HTMLElement) => [...new Set([...c.querySelectorAll('g[data-step]')].map((g) => Number(g.getAttribute('data-step'))))].sort();

test('the map builds in the deck order: each click adds its part, nothing later shows early', () => {
  const one = render(<MemoryMap kicker="k" message="m" step={1} />).container;
  expect(steps(one)).toEqual([1]);
  expect(one.textContent).toContain('Working memory');
  expect(one.textContent).not.toContain('Procedural');

  const three = render(<MemoryMap kicker="k" message="m" step={3} />).container;
  expect(steps(three)).toEqual([1, 2, 3]);
  expect(three.textContent).toContain('What Mercer saw and advised');
  expect(three.textContent).not.toContain('Shared memory');

  const five = render(<MemoryMap kicker="k" message="m" step={5} />).container;
  expect(steps(five)).toEqual([1, 2, 3, 4, 5]);
  for (const w of ['LLM context window', 'Session memory', 'Workflow', 'Toolbox', 'Tool logs', 'Conversations', 'Summaries', 'Knowledge base', 'Entity memory', 'Persona memory', 'Coordination', 'Shared memory'])
    expect(five.textContent).toContain(w);
});

test('the full map is shown once, at the end of the lab (owner, 28 Oct), at the rust with nothing hidden', () => {
  const pages = chapter2.filter((s) => s.overlay === 'MemoryMap');
  expect(pages.map((s) => s.id)).toEqual(['3.15c']);
  expect(pages[0].shot).toBe('pier2-close');
  expect((pages[0].overlayProps as { step: number }).step).toBe(5);
});
