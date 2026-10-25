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
    // drawing starts from no car routes (the defaults carry Harbor Bridge's two lanes)
    useTrafficStore.getState().replace({ ...DEFAULT_TRAFFIC, cars: { ...DEFAULT_TRAFFIC.cars, routes: [] } });
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

test('Bridge lanes adds Harbor Bridge’s two lanes to the car routes in one click', () => {
  act(() => setTrafficMode(true));
  const { getByText } = render(<TrafficEditor />);
  fireEvent.click(getByText('+ Bridge lanes'));
  expect(useTrafficStore.getState().config.cars.routes).toHaveLength(2);
  expect(DEFAULT_TRAFFIC.cars.routes).toHaveLength(2);
});

test('a drawn point can be picked, moved and deleted; deleting a route’s last point removes the route', () => {
  const s = useTrafficStore.getState();
  act(() => {
    s.addPoint([-40, -20]);
    s.addPoint([-38, -21]);
    s.addPoint([-36, -22]);
  });
  act(() => useTrafficStore.getState().selectPoint({ route: 0, index: 1 }));
  expect(useTrafficStore.getState().point).toEqual({ route: 0, index: 1 });
  expect(useTrafficStore.getState().route).toBe(0);
  act(() => useTrafficStore.getState().movePoint([-37.5, -25]));
  expect(useTrafficStore.getState().config.cars.routes[0].points[1]).toEqual([-37.5, -25]);
  act(() => useTrafficStore.getState().deletePoint());
  expect(useTrafficStore.getState().config.cars.routes[0].points).toEqual([[-40, -20], [-36, -22]]);
  expect(useTrafficStore.getState().point).toBeNull();
  // a new tap adds to the route, and drops any point selection
  act(() => useTrafficStore.getState().selectPoint({ route: 0, index: 0 }));
  act(() => useTrafficStore.getState().addPoint([-30, -30]));
  expect(useTrafficStore.getState().point).toBeNull();
  // delete down to nothing: the route goes
  for (let i = 0; i < 3; i++) act(() => (useTrafficStore.getState().selectPoint({ route: 0, index: 0 }), useTrafficStore.getState().deletePoint()));
  expect(useTrafficStore.getState().config.cars.routes).toEqual([]);
});

test('the panel shows the picked point with Delete point; the Delete key deletes it too', () => {
  act(() => setTrafficMode(true));
  const s = useTrafficStore.getState();
  act(() => {
    s.addPoint([-40, -20]);
    s.addPoint([-38, -21]);
    s.addPoint([-36, -22]);
    useTrafficStore.getState().selectPoint({ route: 0, index: 2 });
  });
  const { getByText } = render(<TrafficEditor />);
  expect(getByText(/Point 3 of route 1/)).toBeInTheDocument();
  expect(getByText('Delete point')).toBeInTheDocument();
  act(() => void window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' })));
  expect(useTrafficStore.getState().config.cars.routes[0].points).toHaveLength(2);
  // the point is gone, and so is its row
  expect(() => getByText('Delete point')).toThrow();
});

test('a tap near a drawn point on screen picks that point (the nearest within reach), else nothing', async () => {
  const { nearestPoint } = await import('../../src/world/TrafficDraw');
  const pts = [
    { route: 0, index: 0, sx: 100, sy: 100 },
    { route: 0, index: 1, sx: 130, sy: 100 },
    { route: 1, index: 0, sx: 400, sy: 300 },
  ];
  expect(nearestPoint(pts, 126, 104, 18)).toEqual({ route: 0, index: 1 });
  expect(nearestPoint(pts, 395, 310, 18)).toEqual({ route: 1, index: 0 });
  expect(nearestPoint(pts, 250, 200, 18)).toBeNull();
});

test('unsaved routes are kept in this browser and come back after a reload or a failed save', async () => {
  const { loadTraffic, persistTraffic, DRAFT_KEY } = await import('../../src/engine/traffic');
  localStorage.removeItem(DRAFT_KEY);
  act(() => {
    useTrafficStore.getState().addPoint([-40, -20]);
    useTrafficStore.getState().addPoint([-38, -21]);
  });
  const kept = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
  expect(kept?.config.cars.routes).toHaveLength(1);
  // a reload: the page starts from the saved file, then the draft comes back on top, still unsaved
  act(() => useTrafficStore.getState().replace(DEFAULT_TRAFFIC));
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(DEFAULT_TRAFFIC), { headers: { 'content-type': 'application/json' } }));
  vi.stubGlobal('fetch', fetchMock);
  await act(async () => loadTraffic());
  expect(useTrafficStore.getState().config.cars.routes[0].points).toEqual([[-40, -20], [-38, -21]]);
  expect(useTrafficStore.getState().dirty).toBe(true);
  expect(useTrafficStore.getState().restored).toBeTruthy();
  // a failed save keeps the draft; a good one clears it
  fetchMock.mockRejectedValueOnce(new Error('offline'));
  expect(await persistTraffic()).toBe('failed');
  expect(localStorage.getItem(DRAFT_KEY)).not.toBeNull();
  fetchMock.mockResolvedValueOnce(new Response('{}', { status: 200 }));
  expect(await persistTraffic()).toBe('project');
  expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  vi.unstubAllGlobals();
});
