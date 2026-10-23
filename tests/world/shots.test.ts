import { interpolateShot, SHOTS, type Shot } from '../../src/world/shots';
import { bangkokCovers } from '../../src/world/BangkokCity';

const a: Shot = { position: [0, 0, 0], target: [0, 0, -10], durationMs: 1000, ease: 'inOut' };
const b: Shot = { position: [10, 20, 30], target: [10, 0, -20], durationMs: 1000, ease: 'inOut' };

test('t = 0 is the start pose', () => {
  expect(interpolateShot(a, b, 0)).toEqual({ position: [0, 0, 0], target: [0, 0, -10] });
});

test('t = 1 is the end pose', () => {
  expect(interpolateShot(a, b, 1)).toEqual({ position: [10, 20, 30], target: [10, 0, -20] });
});

test('t beyond 1 is clamped to the end pose', () => {
  expect(interpolateShot(a, b, 2)).toEqual({ position: [10, 20, 30], target: [10, 0, -20] });
});

test('inOut easing passes through the midpoint at t = 0.5', () => {
  const m = interpolateShot(a, b, 0.5);
  expect(Math.abs(m.position[0] - 5)).toBeLessThan(1e-6);
  expect(Math.abs(m.position[1] - 10)).toBeLessThan(1e-6);
  expect(Math.abs(m.target[2] - -15)).toBeLessThan(1e-6);
});

test('the named shots exist', () => {
  for (const id of [
    'gulf-approach', 'city-high', 'ops-center', 'bridge-pier3', 'bridge-pier2', 'core-dive',
    'core-face-tables', 'core-face-json', 'core-face-graph', 'core-face-vectors', 'vector-field',
    'memory-room', 'toolbelt-wall',
  ])
    expect(SHOTS[id]).toBeDefined();
});

test('city shots keep the camera over the Bangkok model, not past its edge', () => {
  for (const id of ['gulf-approach', 'city-high', 'city-wide', 'city-flow', 'ops-center', 'toolbelt-wall', 'memory-room'] as const) {
    const [x, , z] = SHOTS[id].position;
    expect(bangkokCovers(x, z, 1)).toBe(true);
  }
});

test('database shots look at the diorama under the city, not at empty sky above it', async () => {
  const { BASE_Y, DB_TOP_Y, shapeX } = await import('../../src/world/DatabaseDiorama');
  for (const id of ['core-dive', 'core-face-tables', 'core-face-json', 'core-face-graph', 'core-face-vectors'] as const) {
    const ty = SHOTS[id].target[1];
    expect(ty).toBeGreaterThan(BASE_Y);
    expect(ty).toBeLessThan(DB_TOP_Y + 60);
  }
  expect(Math.abs(SHOTS['core-face-tables'].target[0] - shapeX('tables'))).toBeLessThan(30);
  expect(Math.abs(SHOTS['core-face-vectors'].target[0] - shapeX('vectors'))).toBeLessThan(30);
});
