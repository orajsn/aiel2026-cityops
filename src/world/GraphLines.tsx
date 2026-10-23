import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import type { Line2, LineSegments2 } from 'three-stdlib';
import connections from '../content/connections.json';
import { assetPosition } from '../content/geo';

export type EdgeType = 'powers' | 'monitors' | 'coordinates' | 'feeds' | 'supports';
export interface Edge {
  from: string;
  to: string;
  type: EdgeType;
}

const EDGES = connections as Edge[];

export function edgesFor(assetId?: string): Edge[] {
  if (!assetId) return EDGES;
  return EDGES.filter((e) => e.from === assetId || e.to === assetId);
}

export const EDGE_COLOR: Record<EdgeType, string> = {
  powers: '#F5B700',
  monitors: '#B8F2E6',
  coordinates: '#FFFFFF',
  feeds: '#4FB3FF',
  supports: '#9AA5B1',
};

const Y = 5.2; // pin head height

export interface GraphLinesProps {
  edges: Edge[];
  /** Edges touching this asset are drawn brighter and thicker. */
  highlight?: string;
  /** Stagger between edges appearing, ms. */
  staggerMs?: number;
}

export function GraphLines({ edges, highlight, staggerMs = 90 }: GraphLinesProps) {
  const start = useRef(performance.now());
  const items = useMemo(
    () =>
      edges.map((e, i) => {
        const a = assetPosition(e.from);
        const b = assetPosition(e.to);
        // a gentle sag upward so the line reads as a link, not a road
        const mid: [number, number, number] = [(a.x + b.x) / 2, Y + 3, (a.z + b.z) / 2];
        const hot = !highlight || e.from === highlight || e.to === highlight;
        return {
          key: `${e.from}->${e.to}`,
          points: [[a.x, Y, a.z], mid, [b.x, Y, b.z]] as [number, number, number][],
          color: EDGE_COLOR[e.type],
          hot,
          at: i * staggerMs,
        };
      }),
    [edges, highlight, staggerMs],
  );
  const refs = useRef<(Line2 | LineSegments2 | null)[]>([]);

  useFrame(() => {
    const el = performance.now() - start.current;
    items.forEach((it, i) => {
      const l = refs.current[i];
      if (!l) return;
      const k = Math.max(0, Math.min(1, (el - it.at) / 500));
      const target = it.hot ? 0.95 : 0.22;
      l.material.opacity = target * k;
    });
  });

  return (
    <group name="graph-lines">
      {items.map((it, i) => (
        <Line
          key={it.key}
          ref={(r) => (refs.current[i] = r)}
          points={it.points}
          color={it.color}
          lineWidth={it.hot ? 2 : 1}
          transparent
          opacity={0}
          depthWrite={false}
        />
      ))}
    </group>
  );
}
