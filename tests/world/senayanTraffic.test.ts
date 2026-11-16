import { describe, expect, it } from 'vitest';
import DATA from '../../src/world/senayanData';
import { buildSenayanTrafficPaths, sampleSenayanTrafficPath } from '../../src/world/SenayanTraffic';
import type { Point, SenayanRoad } from '../../src/world/senayanTypes';

function road(id: string, line: Point[], oneway = false): SenayanRoad {
  return { id, line, oneway, name: 'Fixture road', kind: 'residential', width: 0.4, bridge: false, layer: 0 };
}

describe('Senayan traffic on mapped roads', () => {
  it('joins connected segments in travel order without mutating the map data', () => {
    const roads = [
      road('a', [[0, 0], [2, 0]]),
      road('c', [[4, 0], [6, 0]]),
      road('b', [[2, 0], [4, 0]]),
    ];
    const before = JSON.stringify(roads);
    const paths = buildSenayanTrafficPaths(roads);
    expect(paths).toHaveLength(1);
    expect(paths[0].line).toEqual([[0, 0], [2, 0], [4, 0], [6, 0]]);
    expect(sampleSenayanTrafficPath(paths[0], 3)).toEqual({ x: 3, z: 0 });
    expect(JSON.stringify(roads)).toBe(before);
  });

  it('does not reverse an oneway segment just to connect two road ends', () => {
    const paths = buildSenayanTrafficPaths([
      road('eastbound', [[0, 0], [4, 0]], true),
      road('westbound', [[8, 0], [4, 0]], true),
    ]);
    expect(paths).toHaveLength(2);
    expect(paths.map(path => path.line)).toEqual([[[0, 0], [4, 0]], [[8, 0], [4, 0]]]);
  });

  it('does not bridge a gap or join a nearby road interior', () => {
    const paths = buildSenayanTrafficPaths([
      road('a', [[0, 0], [4, 0]]),
      road('gap', [[4.02, 0], [8, 0]]),
      road('junction', [[2, 0], [2, 4]]),
    ]);
    expect(paths).toHaveLength(3);
    expect(paths.every(path => path.line.length === 2)).toBe(true);
  });

  it('clamps sampling and passes zero-length consecutive segments safely', () => {
    const [path] = buildSenayanTrafficPaths([road('duplicate', [[0, 0], [0, 0], [4, 0]])]);
    expect(sampleSenayanTrafficPath(path, -10)).toEqual({ x: 0, z: 0 });
    expect(sampleSenayanTrafficPath(path, 0)).toEqual({ x: 0, z: 0 });
    expect(sampleSenayanTrafficPath(path, 2)).toEqual({ x: 2, z: 0 });
    expect(sampleSenayanTrafficPath(path, 10)).toEqual({ x: 4, z: 0 });
    expect(buildSenayanTrafficPaths([road('stationary', [[0, 0], [0, 0]])])).toHaveLength(0);
  });

  it('retains the small mapped Senayan crossing and its source context', () => {
    const crossing = DATA.roads.find(item => item.id === 'way/498447364');
    expect(crossing?.name).toBe('Jalan Terusan Hang Lekir V');
    expect(crossing?.bridge).toBe(true);
    expect(crossing?.width).toBeCloseTo(4 * DATA.meta.units_per_metre);
    expect(crossing?.line).toHaveLength(2);
    if (!crossing) throw new Error('Expected the mapped Senayan crossing');
    const [a, b] = crossing.line;
    const mappedLength = Math.hypot(b[0] - a[0], b[1] - a[1]) / DATA.meta.units_per_metre;
    expect(mappedLength).toBeGreaterThan(14.4);
    expect(mappedLength).toBeLessThan(14.7);
    const midpoint: Point = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    expect(Math.hypot(midpoint[0] - DATA.meta.world_anchor[0], midpoint[1] - DATA.meta.world_anchor[1])).toBeLessThan(0.08);
    expect(DATA.water.some(water => water.id === 'way/28931504' && water.name === 'Kali Grogol')).toBe(true);
  });
});
