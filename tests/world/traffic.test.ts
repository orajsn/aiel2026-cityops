import { DEFAULT_TRAFFIC, LIMITS, normalizeTraffic, speedUnits } from '../../src/content/traffic';
import { makePath, placeVehicles, travel } from '../../src/world/trafficPaths';

test('a saved traffic file is cleaned: counts and speeds clamped, bad points and one-point routes dropped', () => {
  const t = normalizeTraffic({
    boats: { count: 999, speedMin: 12, speedMax: -3, size: 0, routes: [{ points: [[1, 2], [3, 'x'], [5, 6]] }, { points: [[1, 1]] }] },
    cars: { count: -4, speedMin: 4, speedMax: 7, size: 3, routes: 'nope' },
  });
  expect(t.boats.count).toBe(LIMITS.boats.count[1]);
  expect(t.boats.speedMin).toBeLessThanOrEqual(t.boats.speedMax);
  expect(t.boats.speedMax).toBeLessThanOrEqual(LIMITS.speed[1]);
  expect(t.boats.size).toBe(LIMITS.size[0]);
  expect(t.boats.routes.map((r) => r.points)).toEqual([[[1, 2], [5, 6]]]);
  expect(t.cars.count).toBe(0);
  expect(t.cars.routes).toEqual([]);
});

test('garbage gives the defaults; the defaults keep today’s look (boats on the river, at today’s speed)', () => {
  expect(normalizeTraffic(null)).toEqual(DEFAULT_TRAFFIC);
  expect(normalizeTraffic('{"x":1}')).toEqual(DEFAULT_TRAFFIC);
  expect(DEFAULT_TRAFFIC.boats.routes).toEqual([]);
  expect(DEFAULT_TRAFFIC.boats.count).toBe(5);
  // today's boats move 1.7 to 2.4 map units a second
  expect(speedUnits(DEFAULT_TRAFFIC.boats.speedMin)).toBeGreaterThan(1.4);
  expect(speedUnits(DEFAULT_TRAFFIC.boats.speedMax)).toBeLessThan(2.6);
});

test('speed 1 to 10 gets faster all the way', () => {
  for (let s = 1; s < 10; s++) expect(speedUnits(s + 1)).toBeGreaterThan(speedUnits(s));
});

test('a route is measured and walked by distance, facing the way it goes', () => {
  const p = makePath([[0, 0], [3, 0], [3, 4]]);
  expect(p.length).toBeCloseTo(7);
  const mid = travel(p, { route: 0, start: 1.5, speed: 0, dir: 1, tint: 0 }, 0);
  expect(mid.x).toBeCloseTo(1.5);
  expect(mid.z).toBeCloseTo(0);
  // along +x: facing angle atan2(dx, dz) = 90 degrees
  expect(mid.angle).toBeCloseTo(Math.PI / 2);
});

test('vehicles go to the end of an open route and come back (never off the route)', () => {
  const p = makePath([[0, 0], [10, 0]]);
  const v = { route: 0, start: 8, speed: 1, dir: 1 as const, tint: 0 };
  const at = (t: number) => travel(p, v, t).x;
  expect(at(0)).toBeCloseTo(8);
  expect(at(2)).toBeCloseTo(10);
  expect(at(4)).toBeCloseTo(8);
  for (let t = 0; t < 60; t += 0.7) {
    expect(at(t)).toBeGreaterThanOrEqual(-1e-9);
    expect(at(t)).toBeLessThanOrEqual(10 + 1e-9);
  }
  // facing turns round at the end
  expect(Math.cos(travel(p, v, 1).angle - Math.PI / 2)).toBeGreaterThan(0.99);
  expect(Math.cos(travel(p, v, 3).angle + Math.PI / 2)).toBeGreaterThan(0.99);
});

test('vehicles are spread over the routes by length, each with its own speed inside the range, the same every time', () => {
  const paths = [makePath([[0, 0], [30, 0]]), makePath([[0, 0], [10, 0]])];
  const a = placeVehicles(paths, 40, 3, 6, 7);
  const b = placeVehicles(paths, 40, 3, 6, 7);
  expect(a).toEqual(b);
  expect(a).toHaveLength(40);
  const onLong = a.filter((v) => v.route === 0).length;
  expect(onLong).toBeGreaterThanOrEqual(28);
  expect(onLong).toBeLessThanOrEqual(32);
  for (const v of a) {
    expect(v.speed).toBeGreaterThanOrEqual(speedUnits(3) - 1e-9);
    expect(v.speed).toBeLessThanOrEqual(speedUnits(6) + 1e-9);
    expect(v.start).toBeGreaterThanOrEqual(0);
    expect(v.start).toBeLessThanOrEqual(paths[v.route].length);
  }
  expect(new Set(a.map((v) => v.dir)).size).toBe(2);
  expect(placeVehicles([], 10, 3, 6, 7)).toEqual([]);
});

test('a file saved before routes had their own settings: the old total is shared by route length, with the old speeds and size', async () => {
  const { normalizeTraffic } = await import('../../src/content/traffic');
  const t = normalizeTraffic({ cars: { count: 40, speedMin: 5, speedMax: 8, size: 3, routes: [{ points: [[0, 0], [30, 0]] }, { points: [[0, 0], [10, 0]] }] } });
  expect(t.cars.routes.map((r) => r.count)).toEqual([30, 10]);
  for (const r of t.cars.routes) expect([r.speedMin, r.speedMax, r.size]).toEqual([5, 8, 3]);
  // a route with its own settings keeps them
  const u = normalizeTraffic({ cars: { count: 40, routes: [{ points: [[0, 0], [5, 0]], count: 7, speedMin: 2, speedMax: 9, size: 6 }] } });
  expect(u.cars.routes[0]).toMatchObject({ count: 7, speedMin: 2, speedMax: 9, size: 6 });
  // boats keep true scale whatever is asked
  expect(normalizeTraffic({ boats: { routes: [{ points: [[0, 0], [5, 0]], size: 8 }] } }).boats.routes[0].size).toBe(1);
});

test('every route gets exactly its own number of vehicles, speeds inside its own range, and its own size', async () => {
  const { placeOnRoutes } = await import('../../src/world/trafficPaths');
  const paths = [makePath([[0, 0], [30, 0]]), makePath([[0, 0], [10, 0]])];
  const v = placeOnRoutes(paths, [{ count: 3, speedMin: 1, speedMax: 2, size: 2 }, { count: 9, speedMin: 8, speedMax: 9, size: 6 }], 5);
  expect(v.filter((x) => x.route === 0)).toHaveLength(3);
  expect(v.filter((x) => x.route === 1)).toHaveLength(9);
  for (const x of v.filter((y) => y.route === 0)) expect([x.size, x.speed <= speedUnits(2) + 1e-9]).toEqual([2, true]);
  for (const x of v.filter((y) => y.route === 1)) expect([x.size, x.speed >= speedUnits(8) - 1e-9]).toEqual([6, true]);
});
