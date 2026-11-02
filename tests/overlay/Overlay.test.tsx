import { render, screen } from '@testing-library/react';
import { Overlay } from '../../src/overlay/Overlay';
import { useSceneStore } from '../../src/engine/store';
import { useUiStore } from '../../src/engine/ui';

beforeEach(() => {
  useSceneStore.getState().setScenes([
    { id: 'x', chapter: 0, title: 'Mystery', shot: 'city-high', overlay: 'NoSuchOverlay' },
  ]);
  useSceneStore.getState().setSettled(true);
});

test('Overlay shows a visible message for an unknown overlay key instead of throwing', () => {
  render(<Overlay />);
  expect(screen.getByText('overlay not found: NoSuchOverlay')).toBeInTheDocument();
});

test('Overlay shows the chapter and scene title strip', () => {
  render(<Overlay />);
  expect(screen.getByText('Mystery')).toBeInTheDocument();
});

test('on-screen Next and Back buttons step through the scenes (iPad has no arrow keys)', async () => {
  const { fireEvent } = await import('@testing-library/react');
  useSceneStore.getState().setScenes([
    { id: 'a', chapter: 0, title: 'A', shot: 'city-high' },
    { id: 'b', chapter: 0, title: 'B', shot: 'city-high' },
  ]);
  render(<Overlay />);
  const back = screen.getByRole('button', { name: 'Back' });
  const next = screen.getByRole('button', { name: 'Next' });
  expect(back).toBeDisabled();
  fireEvent.click(next);
  expect(useSceneStore.getState().index).toBe(1);
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(useSceneStore.getState().index).toBe(0);
});

test('the presenter script shows under the page and the Script button hides and shows it', async () => {
  useUiStore.setState({ scriptOpen: true });
  const { fireEvent } = await import('@testing-library/react');
  useSceneStore.getState().setScenes([{ id: 'a', chapter: 0, title: 'A', shot: 'city-high', script: 'Say this line.' }]);
  render(<Overlay />);
  expect(screen.getByText('Say this line.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Hide script' }));
  expect(screen.queryByText('Say this line.')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Show script' }));
  expect(screen.getByText('Say this line.')).toBeInTheDocument();
});
