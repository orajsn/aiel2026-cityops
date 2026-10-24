import { render } from '@testing-library/react';
import { CopilotChat, chatSchedule, type ChatItem } from '../../src/overlay/concepts/CopilotChat';
import { chapter2 } from '../../src/scenes/chapter2';

const items: ChatItem[] = [
  { divider: 'Day 1 · Evelyn_H_Mercer' },
  { from: 'person', text: 'Rust at Pier 2.' },
  { from: 'copilot', text: 'Noted.' },
];

test('a chat window: the inspector on the right, the copilot on the left, stacked in order', () => {
  const { container } = render(<CopilotChat kicker="Day 1" message="Mercer tells the copilot." items={items} />);
  const person = container.querySelector<HTMLElement>('[data-chat="person"]')!;
  const copilot = container.querySelector<HTMLElement>('[data-chat="copilot"]')!;
  expect(person.style.alignSelf).toBe('flex-end');
  expect(copilot.style.alignSelf).toBe('flex-start');
  const order = [...container.querySelectorAll('[data-chat]')].map((e) => e.getAttribute('data-chat'));
  expect(order).toEqual(['divider', 'person', 'copilot']);
});

test('the copilot types before it answers, and messages come in one after another', () => {
  const s = chatSchedule(items);
  expect(s.typingAt[2]).not.toBeNull();
  expect(s.at[2]).toBeGreaterThan(s.typingAt[2]!);
  expect(s.at[1]).toBeGreaterThan(s.at[0]);
});

test('2.1: Day 1 is filled, the chat closes and empties, Day 2 finds the same three messages empty', () => {
  const page = (id: string) => (chapter2.find((s) => s.id === id)!.overlayProps as { items: ChatItem[] }).items;
  const states = (id: string) => page(id).filter((i) => 'from' in i && i.from === 'person').map((i) => ('state' in i ? i.state ?? 'shown' : 'shown'));
  expect(states('3.1a')).toEqual(['shown', 'shown', 'shown']);
  expect(states('3.1b')).toEqual(['emptying', 'emptying', 'emptying']);
  expect(states('3.1c')).toEqual(['empty', 'empty', 'empty', 'shown']);
});
