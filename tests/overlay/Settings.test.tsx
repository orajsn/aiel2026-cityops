import { act, fireEvent, render, screen } from '@testing-library/react';
import { Overlay } from '../../src/overlay/Overlay';
import { useSceneStore } from '../../src/engine/store';
import { useCameraStore } from '../../src/engine/camera';
import { useTrafficStore } from '../../src/engine/traffic';
import { useGraphicsStore } from '../../src/engine/graphics';
import { usePresentationStore } from '../../src/engine/presentation';

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

test('Presentation mode is a switch in Settings, remembered on this device; B blanks the screen', () => {
  render(<Overlay />);
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  const sw = screen.getByRole('switch', { name: 'Presentation mode' });
  expect(sw).not.toBeChecked();
  fireEvent.click(sw);
  expect(usePresentationStore.getState().on).toBe(true);
  expect(localStorage.getItem('cityops.presentation')).toBe('on');
  expect(screen.queryByTestId('blank')).toBeNull();
  act(() => usePresentationStore.getState().toggleBlank());
  expect(screen.getByTestId('blank')).toBeInTheDocument();
  act(() => usePresentationStore.getState().setOn(false));
});

test('Text size: a slider and a number box, anywhere from 75% to 150%, remembered on this device', () => {
  render(<Overlay />);
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  const box = screen.getByLabelText('Text size, percent') as HTMLInputElement;
  expect(box.value).toBe('100');
  fireEvent.change(screen.getByRole('slider'), { target: { value: '125' } });
  expect(useGraphicsStore.getState().textSize).toBe(1.25);
  expect(box.value).toBe('125');
  fireEvent.change(box, { target: { value: '137' } });
  fireEvent.keyDown(box, { key: 'Enter' });
  expect(useGraphicsStore.getState().textSize).toBe(1.37);
  expect(localStorage.getItem('cityops.textSize')).toBe('1.37');
  expect(document.documentElement.style.getPropertyValue('--text-zoom')).toBe('1.37');
  expect(document.documentElement.style.getPropertyValue('--panel-zoom')).toBe('1.15');
  // out of range is held to the range
  fireEvent.change(box, { target: { value: '300' } });
  fireEvent.blur(box);
  expect(useGraphicsStore.getState().textSize).toBe(1.5);
  act(() => useGraphicsStore.getState().setTextSize(0.5));
  expect(useGraphicsStore.getState().textSize).toBe(0.75);
  act(() => useGraphicsStore.getState().setTextSize(1));
});
