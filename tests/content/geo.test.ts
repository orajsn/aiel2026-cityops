import { project } from '../../src/content/geo';

test('project centre is the origin', () => {
  const p = project(13.7, 100.55);
  expect(Math.abs(p.x)).toBeLessThan(1e-6);
  expect(Math.abs(p.z)).toBeLessThan(1e-6);
});

test('one tenth of a degree of longitude is 100 units east', () => {
  expect(Math.abs(project(13.7, 100.65).x - 100)).toBeLessThan(0.01);
});

test('south is positive z', () => {
  expect(project(13.6, 100.55).z).toBeGreaterThan(0);
});
