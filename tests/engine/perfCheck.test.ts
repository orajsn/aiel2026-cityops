import { verdict, type PerfResult } from '../../src/engine/perfCheck';

const run = (fps: Record<string, number>): PerfResult[] => Object.entries(fps).map(([id, f]) => ({ id: id as PerfResult['id'], label: id, fps: f, slowMs: 1000 / f }));

test('pixel-bound: halving the pixels helps a lot', () => {
  const v = verdict(run({ base: 30, pixels: 52, shadows: 33, traffic: 30, empty: 60 }));
  expect(v.join(' ')).toMatch(/too many pixels/);
});

test('shadow-bound: turning shadows off helps a lot', () => {
  expect(verdict(run({ base: 30, pixels: 32, shadows: 50, traffic: 30, empty: 60 })).join(' ')).toMatch(/shadows/i);
});

test('not the graphics chip: even an empty frame is slow', () => {
  expect(verdict(run({ base: 40, pixels: 41, shadows: 41, traffic: 41, empty: 43 })).join(' ')).toMatch(/not the graphics chip/);
});

test('already at the screen’s refresh rate', () => {
  expect(verdict(run({ base: 59, pixels: 60, shadows: 60, traffic: 60, empty: 60 })).join(' ')).toMatch(/refresh/);
});
