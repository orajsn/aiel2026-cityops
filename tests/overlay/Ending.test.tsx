import { render } from '@testing-library/react';
import { DoorsAndHall, CopilotTurn, TURN_STEPS } from '../../src/overlay/concepts/HandsOn2';
import { WithWithout, FailuresSolved, BothLabs, Takeaways } from '../../src/overlay/concepts/Ending';
import { chapter2 } from '../../src/scenes/chapter2';

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
  const t = render(<Takeaways kicker="k" message="m" points={[{ title: 'a', text: 'b' }]} quiz={['5 minutes']} />).container;
  expect(t.querySelector('[data-quiz]')).not.toBeNull();
});

test('Day 2 brings back the three Day 1 messages that went empty on page 3', () => {
  const items = (id: string) => (chapter2.find((s) => s.id === id)!.overlayProps as { items: { from?: string; text?: string }[] }).items;
  const day1 = items('3.1a').filter((i) => i.from === 'person').map((i) => i.text);
  const day2 = items('3.14').filter((i) => i.from === 'person').map((i) => i.text);
  expect(day2.slice(0, 3)).toEqual(day1);
});
