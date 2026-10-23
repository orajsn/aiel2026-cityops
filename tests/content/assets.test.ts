import assets from '../../src/content/assets.json';
import connections from '../../src/content/connections.json';

test('there are 28 assets with unique ids', () => {
  expect(assets).toHaveLength(28);
  expect(new Set(assets.map((a) => a.id)).size).toBe(28);
});

test('Harbor Bridge is the criticality 5 hero', () => {
  const hb = assets.find((a) => a.id === 'Harbor Bridge')!;
  expect(hb.criticality).toBe(5);
  expect(hb.type).toBe('bridge');
  expect(hb.specs.span_length_m).toBe(485);
});

test('required named assets exist', () => {
  const ids = new Set(assets.map((a) => a.id));
  for (const id of [
    'Substation Gamma',
    'Pipeline North-7',
    'City Operations Control Center',
    'Emergency Operations Center',
    'Northern Reservoir',
    'Air Quality Monitor NI-01',
    'Harbor Bridge Sensor Array A',
    'Harbor Bridge Sensor Array B',
  ])
    expect(ids.has(id)).toBe(true);
});

test('every connection endpoint is an asset', () => {
  const ids = new Set(assets.map((a) => a.id));
  for (const c of connections) {
    expect(ids.has(c.from)).toBe(true);
    expect(ids.has(c.to)).toBe(true);
  }
});

test('Harbor Bridge has its powers, monitors and coordinates edges', () => {
  const has = (from: string, type: string) =>
    connections.some((c) => c.from === from && c.to === 'Harbor Bridge' && c.type === type);
  expect(has('Substation Gamma', 'powers')).toBe(true);
  expect(has('Harbor Bridge Sensor Array A', 'monitors')).toBe(true);
  expect(has('Harbor Bridge Sensor Array B', 'monitors')).toBe(true);
  expect(has('City Operations Control Center', 'coordinates')).toBe(true);
});

test('seven districts including Harbor District', () => {
  const d = new Set(assets.map((a) => a.district));
  expect(d.size).toBe(7);
  expect(d.has('Harbor District')).toBe(true);
});
