import { verdict, type PerfResult } from '../../src/engine/perfCheck';

const run = (fps: Record<string, number>): PerfResult[] => Object.entries(fps).map(([id, f]) => ({ id: id as PerfResult['id'], label: id, fps: f, slowMs: 1000 / f }));

test('reports the measured improvement from halving pixels', () => {
  const v = verdict(run({ base: 30, pixels: 52, shadows: 33, traffic: 30, empty: 60 }));
  expect(v.join(' ')).toMatch(/pixels: 52 FPS \(\+73% versus baseline\)/);
});

test('reports the shadow comparison without diagnosing its cause', () => {
  expect(verdict(run({ base: 30, pixels: 32, shadows: 50, traffic: 30, empty: 60 })).join(' ')).toMatch(/shadows/i);
});

test('an empty-frame comparison does not claim a CPU or GPU diagnosis', () => {
  expect(verdict(run({ base: 40, pixels: 41, shadows: 41, traffic: 41, empty: 43 })).join(' ')).not.toMatch(/CPU|GPU|graphics chip/);
});

test('59 FPS is reported as a measurement, not an assumed display refresh rate', () => {
  expect(verdict(run({ base: 59, pixels: 60, shadows: 60, traffic: 60, empty: 60 })).join(' ')).toMatch(/Baseline: 59 FPS/);
});

test('missing baseline gives an explicit unavailable result', () => { expect(verdict([])).toEqual(['No baseline measurement was captured.']); });
