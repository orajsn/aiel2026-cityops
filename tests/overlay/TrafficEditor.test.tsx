import { fireEvent, render } from '@testing-library/react';
import { act } from 'react';
import { useTrafficStore } from '../../src/engine/traffic';
import { useCameraStore } from '../../src/engine/camera';
import { DEFAULT_TRAFFIC } from '../../src/content/traffic';
import { TrafficEditor, setTrafficMode } from '../../src/overlay/TrafficEditor';
import { bindKeys } from '../../src/engine/keys';
import { useSceneStore } from '../../src/engine/store';

beforeEach(() => {
  act(() => {
    useTrafficStore.getState().replace(DEFAULT_TRAFFIC);
    useTrafficStore.setState({ kind: 'cars', editing: false });
    useCameraStore.getState().setEditing(false);
  });
});

test('drawing: the first tap starts a route, taps add points, New route starts another, Undo takes the last point back', () => {
  const s = useTrafficStore.getState();
  act(() => {
    s.addPoint([-40, -20]);
    s.addPoint([-38, -21]);
    s.addPoint([-36, -22]);
  });
  expect(useTrafficStore.getState().config.cars.routes).toEqual([{ points: [[-40, -20], [-38, -21], [-36, -22]] }]);
  act(() => {
    s.newRoute();
    s.addPoint([-50, -30]);
  });
  expect(useTrafficStore.getState().config.cars.routes).toHaveLength(2);
  expect(useTrafficStore.getState().route).toBe(1);
  act(() => s.undoPoint());
  // the one-point route is gone, and the first route is the one being drawn again
  expect(useTrafficStore.getState().config.cars.routes).toHaveLength(1);
  expect(useTrafficStore.getState().route).toBe(0);
  expect(useTrafficStore.getState().dirty).toBe(true);
  // boats are drawn separately
  expect(useTrafficStore.getState().config.boats.routes).toEqual([]);
});

test('Traffic mode borrows Camera mode to move, and Done leaves both', () => {
  act(() => setTrafficMode(true));
  expect(useCameraStore.getState().editing).toBe(true);
  const { getByRole, getByText } = render(<TrafficEditor />);
  expect(getByRole('toolbar', { name: 'Traffic mode' })).toBeInTheDocument();
  fireEvent.click(getByText('Done'));
  expect(useTrafficStore.getState().editing).toBe(false);
  expect(useCameraStore.getState().editing).toBe(false);
});

test('the sliders set how many, the speed range (slowest never above fastest) and the car size', () => {
  act(() => setTrafficMode(true));
  const { getByLabelText, getByRole } = render(<TrafficEditor />);
  fireEvent.change(getByLabelText('How many'), { target: { value: '120' } });
  fireEvent.change(getByLabelText('Slowest speed'), { target: { value: '9' } });
  fireEvent.change(getByLabelText('Car size'), { target: { value: '5' } });
  const cars = useTrafficStore.getState().config.cars;
  expect(cars.count).toBe(120);
  expect(cars.speedMin).toBe(9);
  expect(cars.speedMax).toBeGreaterThanOrEqual(9);
  expect(cars.size).toBe(5);
  // boats: no size (they stay true to scale for the bridge), and the river note while no route is drawn
  fireEvent.click(getByRole('tab', { name: /Boats/ }));
  expect(() => getByLabelText('Car size')).toThrow();
  expect(getByRole('toolbar').textContent).toContain('the boats sail the river');
});

test('R opens and closes Traffic mode, also while Camera mode has the keys', () => {
  const traffic = vi.fn();
  const off = bindKeys(useSceneStore, { jump() {}, notes() {}, lang() {}, traffic, isEditing: () => true });
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
  expect(traffic).toHaveBeenCalledTimes(1);
  off();
});
