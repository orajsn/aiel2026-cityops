import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { ASSETS, assetPosition, project } from '../content/geo';
import { useSceneStore } from '../engine/store';
import { rng } from './cityLayout';
import { FlowArc } from './FlowArc';
import type { Vec3 } from './shots';

export interface DataStreamProps {
  running: boolean;
  count?: { logs: number; reports: number; findings: number };
  /** Time for the counters to reach `count`. */
  durationMs?: number;
  spawnEveryMs?: number;
}

const OPS = 'City Operations Control Center';
const PIN_TOP = 5;

interface Live {
  id: number;
  from: Vec3;
  color: string;
}

const COLORS = ['#1B8A9C', '#2AA8BC', '#8FD3DE'];

/**
 * Documents fly as arcs of light from random pins into the Ops Center while `running`,
 * and the store counters climb to `count` over `durationMs`.
 */
export function DataStream({
  running,
  count = { logs: 308, reports: 60, findings: 220 },
  durationMs = 9000,
  spawnEveryMs = 120,
}: DataStreamProps) {
  const [live, setLive] = useState<Live[]>([]);
  const next = useRef(0);
  const started = useRef(0);
  const lastSpawn = useRef(0);
  const lastCount = useRef(0);
  const setCounters = useSceneStore((s) => s.setCounters);
  const r = useMemo(() => rng(42), []);

  const to = useMemo<Vec3>(() => {
    const p = assetPosition(OPS);
    return [p.x, PIN_TOP, p.z];
  }, []);
  const sources = useMemo<Vec3[]>(
    () =>
      ASSETS.filter((a) => a.id !== OPS).map((a) => {
        const p = project(a.lat, a.lon);
        return [p.x, PIN_TOP, p.z];
      }),
    [],
  );

  useEffect(() => {
    if (running) {
      started.current = performance.now();
      lastSpawn.current = 0;
      setCounters({ logs: 0, reports: 0, findings: 0 });
    } else {
      setLive([]);
    }
  }, [running, setCounters]);

  useFrame(() => {
    if (!running) return;
    const now = performance.now();
    const elapsed = now - started.current;
    const k = Math.min(1, elapsed / durationMs);
    // ease the count so it rushes early and settles at the end
    const e = 1 - Math.pow(1 - k, 2);
    if (now - lastCount.current > 80) {
      lastCount.current = now;
      setCounters({
        logs: Math.round(count.logs * e),
        reports: Math.round(count.reports * e),
        findings: Math.round(count.findings * e),
      });
    }
    if (k < 1 && now - lastSpawn.current > spawnEveryMs) {
      lastSpawn.current = now;
      const from = sources[Math.floor(r() * sources.length)];
      const color = COLORS[Math.floor(r() * COLORS.length)];
      const id = next.current++;
      setLive((l) => (l.length > 24 ? l : [...l, { id, from, color }]));
    }
  });

  return (
    <group name="data-stream">
      {live.map((a) => (
        <FlowArc
          key={a.id}
          from={a.from}
          to={to}
          color={a.color}
          lift={14 + (a.id % 5) * 3}
          radius={0.18}
          durationMs={1500}
          fadeMs={500}
          onDone={() => setLive((l) => l.filter((x) => x.id !== a.id))}
        />
      ))}
    </group>
  );
}
