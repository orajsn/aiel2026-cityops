import { render } from '@testing-library/react';
import { MemoryLoop } from '../../src/overlay/concepts/MemoryLoop';
import { chapter2 } from '../../src/scenes/chapter2';

test('3.5b the three-layer stack; the model is not called the LLM', () => {
  const c = render(<MemoryLoop kicker="k" message="m" />).container;
  expect(c.querySelectorAll('[data-stack]')).toHaveLength(3);
  expect(c.textContent).not.toContain('The LLM');
});

test('3.2 to 3.5 stay at the rust, desk and cabinet share one panel, the glass shares one panel', () => {
  const ids = ['3.2a', '3.2b', '3.2p', '3.2c', '3.2e', '3.3a', '3.3b', '3.4a', '3.4b', '3.4c', '3.4d', '3.5b'];
  const pages = ids.map((id) => chapter2.find((s) => s.id === id)!);
  expect(pages.every((p) => p.shot === 'pier2-close')).toBe(true);
  expect(pages[0].overlayGroup).toBe(pages[1].overlayGroup);
  expect(pages[5].overlayGroup).toBe(pages[6].overlayGroup);
  expect(pages.slice(7, 10).map((p) => (p.overlayProps as { which: string }).which)).toEqual(['memory', 'context', 'harness']);
  expect(pages[10].overlay).toBe('WhoFixesWhat');
});
