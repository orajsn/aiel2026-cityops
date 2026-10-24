import { render } from '@testing-library/react';
import { Glass, GLASS_LAYERS } from '../../src/overlay/concepts/Glass';
import { Disciplines } from '../../src/overlay/concepts/Disciplines';
import { MemoryLoop } from '../../src/overlay/concepts/MemoryLoop';
import { chapter2 } from '../../src/scenes/chapter2';

test('3.3 the glass fills with the six things the model sees, then shows the four problems with the bridge', () => {
  const one = render(<Glass kicker="k" message="m" step={1} />).container;
  expect([...one.querySelectorAll('[data-layer]')].map((e) => e.getAttribute('data-layer'))).toEqual(GLASS_LAYERS);
  expect(one.querySelectorAll('[data-fact]')).toHaveLength(4);
  expect(one.querySelectorAll('[data-problem]')).toHaveLength(0);

  const two = render(<Glass kicker="k" message="m" step={2} />).container;
  expect([...two.querySelectorAll('[data-problem]')].map((e) => e.getAttribute('data-problem'))).toEqual(['Volume', 'Relevance', 'Accuracy', 'Timing']);
  expect(two.textContent).toContain('Mercer');
  expect(two.textContent).not.toMatch(/size 9|Nike|Pier \d/);
});

test('3.4 three disciplines in the deck order', () => {
  const c = render(<Disciplines kicker="k" message="m" />).container;
  expect([...c.querySelectorAll('[data-discipline]')].map((e) => e.getAttribute('data-discipline'))).toEqual(['Memory engineering', 'Context engineering', 'Harness engineering']);
});

test('3.5 the loop has four steps over the memory store, then the three-layer stack; the model is not called the LLM', () => {
  const one = render(<MemoryLoop kicker="k" message="m" step={1} />).container;
  expect([...one.querySelectorAll('[data-loop-step]')].map((e) => e.getAttribute('data-loop-step'))).toEqual(['Read', 'Reason & act', 'Write back', 'Summarize']);
  expect(one.querySelector('[data-store]')).not.toBeNull();
  expect(one.querySelector('[data-flow="read"]')).not.toBeNull();
  expect(one.querySelector('[data-flow="write"]')).not.toBeNull();
  expect(one.textContent).not.toContain('The LLM');

  const two = render(<MemoryLoop kicker="k" message="m" step={2} />).container;
  expect(two.querySelectorAll('[data-stack]')).toHaveLength(3);
});

test('3.3 to 3.5 stay at the rust, and multi-click pages share one panel', () => {
  const ids = ['3.3a', '3.3b', '3.4', '3.5a', '3.5b'];
  const pages = ids.map((id) => chapter2.find((s) => s.id === id)!);
  expect(pages.every((p) => p.shot === 'pier2-close')).toBe(true);
  expect(pages[0].overlayGroup).toBe(pages[1].overlayGroup);
  expect(pages[3].overlayGroup).toBe(pages[4].overlayGroup);
  expect(pages[2].title).toBe('Three disciplines');
});
