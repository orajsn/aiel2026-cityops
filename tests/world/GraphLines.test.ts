import { edgesFor } from '../../src/world/GraphLines';
import connections from '../../src/content/connections.json';

test('edgesFor an asset returns only edges touching it, at least four for Harbor Bridge', () => {
  const e = edgesFor('Harbor Bridge');
  expect(e.length).toBeGreaterThanOrEqual(4);
  for (const x of e) expect(x.from === 'Harbor Bridge' || x.to === 'Harbor Bridge').toBe(true);
});

test('edgesFor with no asset returns all edges', () => {
  expect(edgesFor()).toHaveLength(connections.length);
});
