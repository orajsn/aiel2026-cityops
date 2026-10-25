import { useSceneStore } from '../engine/store';
import { BangkokCity } from './BangkokCity';
import { Boats } from './Boats';
import { Cars } from './Cars';
import { TrafficDraw } from './TrafficDraw';
import { HarborBridge } from './HarborBridge';
import type { Who } from './Person';
import { SkyAndHorizon } from './Ground';

/** The city: the TerraMesh Bangkok model as delivered, boats and cars (Traffic mode), and Harbor Bridge. */
export function KitCity() {
  const sceneWorld = useSceneStore((s) => s.scenes[s.index]?.world);
  const world = (sceneWorld ?? {}) as { inspect?: { pier: 'pier3' | 'pier2'; who: Who; leave?: boolean }; markers?: boolean | 'pier2'; core?: string };
  return (
    <group name="city">
      <SkyAndHorizon ground={!world.core} />
      <BangkokCity />
      <Boats />
      <Cars />
      <TrafficDraw />
      <HarborBridge inspect={world.inspect} markers={world.markers} />
    </group>
  );
}
