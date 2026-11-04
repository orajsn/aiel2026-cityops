import { act, fireEvent, render, screen } from '@testing-library/react';
import { FollowCard } from '../../src/overlay/FollowCard';
import { useFollowStore } from '../../src/engine/follow';

afterEach(() => act(() => useFollowStore.setState({ code: '', card: false } as never)));

// owner, 4 Nov: the address on the join card must be a link you can click
test('the address opens the follow page with the code, in a new tab, and clicking it leaves the card up', () => {
  act(() => useFollowStore.setState({ code: '123456', card: true } as never));
  render(<FollowCard />);
  const link = screen.getByRole('link');
  expect(link.getAttribute('href')).toContain('follow/?c=123456');
  expect(link.getAttribute('target')).toBe('_blank');
  fireEvent.click(link);
  expect(screen.getByRole('dialog')).toBeTruthy();
});
