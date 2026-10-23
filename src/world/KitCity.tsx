import { useSceneStore } from '../engine/store';
import { BangkokCity } from './BangkokCity';
import { Boats } from './Boats';
import { HarborBridge } from './HarborBridge';
import { SkyAndHorizon } from './Ground';

/** The city: the TerraMesh Bangkok model as delivered, the boats on the real river, and Harbor Bridge. */
export function KitCity() {
  const sceneWorld = useSceneStore((s) => s.scenes[s.index]?.world);
  const world = (sceneWorld ?? {}) as { inspector?: boolean; markers?: boolean; core?: string };
  return (
    <group name="city">
      <SkyAndHorizon ground={!world.core} />
      <BangkokCity />
      <Boats />
      <HarborBridge inspector={!!world.inspector} markers={!!world.markers} />
    </group>
  );
}
