import { pinColor } from '../../src/world/pinColors';

test('bridge pins are Oracle red', () => {
  expect(pinColor('bridge')).toBe('#C74634');
});

test('every asset type has a colour', () => {
  for (const t of ['substation', 'pipeline', 'water', 'energy', 'sensor', 'comms', 'civil', 'ops'] as const)
    expect(pinColor(t)).toMatch(/^#[0-9A-Fa-f]{6}$/);
});
