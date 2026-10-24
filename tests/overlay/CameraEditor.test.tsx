import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { CameraEditor } from '../../src/overlay/CameraEditor';
import { useCameraStore } from '../../src/engine/camera';
import { useSceneStore } from '../../src/engine/store';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true })));
  useSceneStore.getState().setScenes([
    { id: '1.1', chapter: 1, title: 'A', shot: 'sky' },
    { id: '1.2', chapter: 1, title: 'B', shot: 'sky' },
    { id: '1.4', chapter: 1, title: 'C', shot: 'ops' },
  ]);
  useCameraStore.setState({ overrides: {}, editing: true, live: { position: [-20, 30, -20], target: [-20, 0, -36] } });
});

test('Save for this page stores the live camera for the current page only', async () => {
  render(<CameraEditor />);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: /save for this page/i })));
  expect(Object.keys(useCameraStore.getState().overrides)).toEqual(['1.1']);
  expect(fetch).toHaveBeenCalledWith('/__camera-overrides', expect.objectContaining({ method: 'POST' }));
});

test('Save for this place stores it for every page that shares the place', async () => {
  render(<CameraEditor />);
  await act(async () => fireEvent.click(screen.getByRole('button', { name: /save for all 2 pages/i })));
  expect(Object.keys(useCameraStore.getState().overrides).sort()).toEqual(['1.1', '1.2']);
});

test('the bar warns when the frame shows the sky', () => {
  useCameraStore.setState({ live: { position: [-20, 5, -20], target: [-20, 5, -40] } });
  render(<CameraEditor />);
  expect(screen.getByText(/sky or map edge in frame/i)).toBeInTheDocument();
});

test('Done leaves Camera mode', () => {
  render(<CameraEditor />);
  fireEvent.click(screen.getByRole('button', { name: /done/i }));
  expect(useCameraStore.getState().editing).toBe(false);
});
