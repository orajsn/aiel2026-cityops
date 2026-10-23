import { render, screen } from '@testing-library/react';
import { Overlay } from '../../src/overlay/Overlay';
import { useSceneStore } from '../../src/engine/store';

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
