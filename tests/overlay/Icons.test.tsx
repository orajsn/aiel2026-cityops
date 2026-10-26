import { render } from '@testing-library/react';
import { Beat, type BeatProps } from '../../src/overlay/concepts/Beat';
import { Disciplines } from '../../src/overlay/concepts/Disciplines';
import { Glass } from '../../src/overlay/concepts/Glass';
import { WithWithout, FailuresSolved, Takeaways, type TakeawaysProps } from '../../src/overlay/concepts/Ending';
import { chapter1 } from '../../src/scenes/chapter1';
import { chapter2 } from '../../src/scenes/chapter2';

const icons = (c: HTMLElement) => [...c.querySelectorAll('svg[data-icon]')].map((s) => s.getAttribute('data-icon'));
const props = <T,>(ch: { id: string; overlayProps?: unknown }[], id: string) => ch.find((s) => s.id === id)!.overlayProps as T;

test('Lab 2 page 9: RAG, Workflow and Agent as three cards with their icons', () => {
  const c = render(<Beat {...props<BeatProps>(chapter1, '2.9')} />).container;
  expect(icons(c)).toEqual(['lookup', 'steps', 'branch']);
  for (const w of ['RAG', 'Workflow', 'Agent', 'What does the record say?', 'Triage predictably.', 'Reason and tell me what to do.']) expect(c.textContent).toContain(w);
});

test('three disciplines: retains, perceives, runs reliably', () => {
  expect(icons(render(<Disciplines kicker="k" message="m" />).container)).toEqual(['database', 'funnel', 'loop']);
});

test('the four failures carry the same icons on the glass and when solved', () => {
  const four = ['overflow', 'target', 'inspect', 'clock'];
  expect(icons(render(<Glass kicker="k" message="m" step={2} />).container)).toEqual(four);
  expect(icons(render(<FailuresSolved kicker="k" message="m" />).container)).toEqual(four);
});

test('with and without memory: an icon on each of the four rows', () => {
  const c = render(<WithWithout kicker="k" message="m" question="q" without="no" withMemory="yes" />).container;
  expect(icons(c)).toEqual(['pin', 'quote', 'wrench', 'lock']);
});

test('takeaways: an icon for each, the quiz stays the one red thing', () => {
  const c = render(<Takeaways {...props<TakeawaysProps>(chapter2, '3.17')} />).container;
  expect(icons(c)).toEqual(['foundation', 'glass', 'converge']);
  expect(c.querySelector('[data-quiz]')).not.toBeNull();
});
