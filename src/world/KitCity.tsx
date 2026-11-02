import { useSceneStore } from '../engine/store';
import { BangkokCity } from './BangkokCity';
import { Boats } from './Boats';
import { Cars } from './Cars';
import { useTrafficStore } from '../engine/traffic';
import { TrafficDraw } from './TrafficDraw';
import { HarborBridge } from './HarborBridge';
import { BhumibolBridge } from './BhumibolBridge';
import { useGraphicsStore } from '../engine/graphics';
import type { Who } from './Person';
import { SkyAndHorizon } from './Ground';

/** The city: the TerraMesh Bangkok model as delivered, boats and cars (Traffic mode), and Harbor Bridge. */
export function KitCity() {
  const sceneWorld = useSceneStore((s) => s.scenes[s.index]?.world);
  // Traffic mode: no people or incident markers at the bridge, just the city and its traffic
  const traffic = useTrafficStore((s) => s.editing);
  const bhumibol = useGraphicsStore((s) => s.bridge === 'bhumibol');
  const world = (traffic ? {} : (sceneWorld ?? {})) as { inspect?: { pier: 'pier3' | 'pier2'; who: Who; leave?: boolean }; markers?: boolean | 'pier2'; core?: string; lab1?: 'crack' | 'plan' | 'capture' };
  return (
    <group name="city">
      <SkyAndHorizon ground={!world.core} />
      <BangkokCity />
      <Boats />
      <Cars />
      <TrafficDraw />
      <HarborBridge inspect={world.inspect} markers={world.markers} lab1={world.lab1} />
      {/* Settings › Bridge: the Bhumibol Bridge model on preview */}
      {bhumibol && <BhumibolBridge />}
    </group>
  );
}
