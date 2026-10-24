import { interpolateShot, SHOTS, type Shot } from '../../src/world/shots';
import { BASE_Y, DB_TOP_Y, shapeX } from '../../src/world/DatabaseDiorama';

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

test('a sideways move at the same distance looks half way between the targets half way through', () => {
  const p: Shot = { position: [0, 10, 10], target: [0, 0, 0], durationMs: 1000 };
  const q: Shot = { position: [20, 10, 10], target: [20, 0, 0], durationMs: 1000 };
  const m = interpolateShot(p, q, 0.5);
  expect(m.target[0]).toBeCloseTo(10, 3);
  expect(m.position[1]).toBeCloseTo(10, 3);
});

test('moving from a close-up, the view slides slowly while close and faster once pulled back', () => {
  const close: Shot = { position: [0, 0.5, 1], target: [0, 0, 0], durationMs: 1000 };
  const far: Shot = { position: [20, 12, 24], target: [20, 0, 0], durationMs: 1000 };
  const early = interpolateShot(close, far, 0.2).target[0];
  expect(early).toBeLessThan(20 * 0.2 * 0.5); // well behind a straight-line pan
});

test('the named shots exist', () => {
  for (const id of [
    'arrive', 'city', 'sky', 'ops', 'bridge', 'pier3', 'pier2', 'core-dive',
    'core-face-tables', 'core-face-json', 'core-face-graph', 'core-face-vectors', 'vector-field',
  ])
    expect(SHOTS[id]).toBeDefined();
});


test('database shots look at the diorama under the city, not at empty sky above it', () => {
  for (const id of ['core-dive', 'core-face-tables', 'core-face-json', 'core-face-graph', 'core-face-vectors'] as const) {
    const ty = SHOTS[id].target[1];
    expect(ty).toBeGreaterThan(BASE_Y);
    expect(ty).toBeLessThan(DB_TOP_Y + 60);
  }
  expect(Math.abs(SHOTS['core-face-tables'].target[0] - shapeX('tables'))).toBeLessThan(30);
  expect(Math.abs(SHOTS['core-face-vectors'].target[0] - shapeX('vectors'))).toBeLessThan(30);
});
