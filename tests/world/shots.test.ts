import { interpolateShot, SHOTS, type Shot } from '../../src/world/shots';

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
