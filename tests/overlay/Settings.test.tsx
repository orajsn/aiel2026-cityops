import { fireEvent, render, screen } from '@testing-library/react';
import { Overlay } from '../../src/overlay/Overlay';
import { useSceneStore } from '../../src/engine/store';
import { useCameraStore } from '../../src/engine/camera';
import { useTrafficStore } from '../../src/engine/traffic';
import { useGraphicsStore } from '../../src/engine/graphics';

beforeEach(() => {
  useSceneStore.getState().setScenes([{ id: 'a', chapter: 0, title: 'A', shot: 'city' }]);
  useSceneStore.getState().setSettled(true);
  useCameraStore.getState().setEditing(false);
  useGraphicsStore.getState().setResolution('auto');
});

test('CAM and Traffic live in Settings, not in the corner bar', () => {
  render(<Overlay />);
  const bar = screen.getByRole('navigation', { name: 'Scene navigation' });
  expect(bar.textContent).not.toMatch(/CAM|Traffic/);
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  fireEvent.click(screen.getByRole('button', { name: 'Camera mode' }));
  expect(useCameraStore.getState().editing).toBe(true);
  // the panel steps aside for the mode; opening it again offers the way out
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  fireEvent.click(screen.getByRole('button', { name: 'Leave Camera mode' }));
  expect(useCameraStore.getState().editing).toBe(false);
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  fireEvent.click(screen.getByRole('button', { name: 'Traffic mode' }));
  expect(useTrafficStore.getState().editing).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  fireEvent.click(screen.getByRole('button', { name: 'Leave Traffic mode' }));
  expect(useTrafficStore.getState().editing).toBe(false);
});

test('Graphics: pick a resolution, or type a custom one', () => {
  render(<Overlay />);
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  expect(screen.getByRole('radio', { name: 'Auto' })).toBeChecked();
  fireEvent.click(screen.getByRole('radio', { name: '4K' }));
  expect(useGraphicsStore.getState().resolution).toBe('4k');
  expect(screen.getByText(/drawing 3840 × 2160/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('radio', { name: 'Custom' }));
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '3200' } });
  fireEvent.change(screen.getByLabelText('Height'), { target: { value: '1800' } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  expect(useGraphicsStore.getState()).toMatchObject({ resolution: 'custom', custom: { w: 3200, h: 1800 } });
  expect(screen.getByText(/drawing 3200 × 1800/)).toBeInTheDocument();
});
