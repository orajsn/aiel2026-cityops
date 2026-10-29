import { act, render } from '@testing-library/react';
import { useUiStore } from '../../src/engine/ui';
import { CopilotChat, type ChatItem } from '../../src/overlay/concepts/CopilotChat';
import { Toolbelt } from '../../src/overlay/concepts/Toolbelt';
import { PinLegend } from '../../src/overlay/concepts/PinLegend';

const items: ChatItem[] = [{ divider: 'Day 1 · Mercer' }, { from: 'person', text: 'Rust on the pier.' }];
const setScript = (on: boolean) => act(() => useUiStore.setState({ scriptOpen: on }));

afterEach(() => setScript(true));

test('script off: the chat panel runs down to the corner buttons (is-free)', () => {
  setScript(false);
  const { getByTestId } = render(<CopilotChat kicker="Day 1" message="m" items={items} />);
  expect(getByTestId('chat-panel').className).toContain('is-free');
});

test('the sky pages show their line only with the script off (with it on, the script says the same words)', () => {
  setScript(true);
  const on = render(<Toolbelt message="**Tools** are what the agent can do." />);
  expect(on.container.querySelector('.qb__line')).toBeNull();
  on.unmount();
  setScript(false);
  const off = render(<Toolbelt message="**Tools** are what the agent can do." />);
  expect(off.container.querySelector('.qb__line.is-low')).not.toBeNull();
});

test('script off: the Introduction panels step down (is-low)', () => {
  setScript(false);
  const { getByTestId } = render(<PinLegend />);
  expect(getByTestId('pin-legend').className).toContain('is-low');
});
