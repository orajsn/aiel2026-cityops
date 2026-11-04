import { render } from '@testing-library/react';
import { DoorsAndHall, CopilotTurn, TURN_STEPS } from '../../src/overlay/concepts/HandsOn2';
import { WithWithout, FailuresSolved, BothLabs, QuizCard } from '../../src/overlay/concepts/Ending';
import { LAB3_ALL as chapter2 } from '../../src/scenes/chapter2';

test('page 21: Vance bounces off the private room and finds the shared hall', () => {
  const c = render(<DoorsAndHall kicker="k" message="m" />).container;
  expect(c.querySelector('[data-room="private"]')?.textContent).toContain('swap shifts Tuesday');
  expect(c.querySelector('[data-room="hall"]')).not.toBeNull();
  expect(c.querySelectorAll('[data-key]')).toHaveLength(3);
});

test('pages 22 and 23: eight steps, then the four blocks of the context card', () => {
  const one = render(<CopilotTurn kicker="k" message="m" step={1} />).container;
  expect(one.querySelectorAll('[data-turn-step]')).toHaveLength(TURN_STEPS.length);
  const two = render(<CopilotTurn kicker="k" message="m" step={2} />).container;
  expect([...two.querySelectorAll('[data-block]')].map((b) => b.getAttribute('data-block'))).toEqual(['summary', 'topics', 'relevant_information', 'recent_messages']);
});

test('pages 26 to 29 render their parts', () => {
  const w = render(<WithWithout kicker="k" message="m" question="q" without="no" withMemory="yes" />).container;
  expect(w.querySelector('[data-testid="chat-without"]')).not.toBeNull();
  expect(w.querySelector('[data-testid="chat-with"]')).not.toBeNull();
  expect(w.querySelectorAll('[data-row]')).toHaveLength(4);
  expect(render(<FailuresSolved kicker="k" message="m" />).container.querySelectorAll('[data-solved]')).toHaveLength(4);
  expect(render(<BothLabs rule={['r']} history={['h']} message="m" />).container.querySelectorAll('[data-lab]')).toHaveLength(2);
  const t = render(<QuizCard quiz={['5 minutes']} />).container;
  expect(t.querySelector('[data-quiz]')).not.toBeNull();
});

test('Back on the bridge: Day 1, Day 2 and both labs meet each build in two steps on one panel (owner, 29 Oct)', () => {
  for (const [a, b, overlay] of [['3.13', '3.13a', 'Day1'], ['3.14', '3.14a', 'Day2'], ['3.16', '3.16a', 'LabsMeet']]) {
    const s1 = chapter2.find((s) => s.id === a)!;
    const s2 = chapter2.find((s) => s.id === b)!;
    expect([s1.overlay, s2.overlay]).toEqual([overlay, overlay]);
    expect(s1.overlayGroup).toBe(s2.overlayGroup);
    expect([(s1.overlayProps as { step: number }).step, (s2.overlayProps as { step: number }).step]).toEqual([1, 2]);
  }
});
