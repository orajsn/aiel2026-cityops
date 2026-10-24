import { netLayout, waveAt } from '../../src/world/NeuralNet';

test('the language model is layers of nodes, input to output, left to right', () => {
  const layers = netLayout();
  expect(layers.length).toBeGreaterThanOrEqual(4);
  for (let l = 1; l < layers.length; l++) expect(layers[l][0][0]).toBeGreaterThan(layers[l - 1][0][0]);
});

test('the light wave lights the layer it is passing, not the others', () => {
  expect(waveAt(2, 2)).toBeCloseTo(1, 6);
  expect(waveAt(0, 2)).toBeLessThan(0.01);
  expect(waveAt(4, 2)).toBeLessThan(0.01);
  expect(waveAt(2, 1.5)).toBeGreaterThan(waveAt(3, 1.5));
});
