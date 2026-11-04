import { render } from '@testing-library/react';
import { Glass } from '../../src/overlay/concepts/Glass';
import { WithWithout, FailuresSolved } from '../../src/overlay/concepts/Ending';

const icons = (c: HTMLElement) => [...c.querySelectorAll('svg[data-icon]')].map((s) => s.getAttribute('data-icon'));

test('the four failures carry the same icons on the glass and when solved', () => {
  const four = ['overflow', 'target', 'inspect', 'clock'];
  expect(icons(render(<Glass kicker="k" message="m" step={2} />).container)).toEqual(four);
  expect(icons(render(<FailuresSolved kicker="k" message="m" />).container)).toEqual(four);
});

test('with and without memory: an icon on each of the four rows', () => {
  const c = render(<WithWithout kicker="k" message="m" question="q" without="no" withMemory="yes" />).container;
  expect(icons(c)).toEqual(['pin', 'quote', 'wrench', 'lock']);
});
