import { useSceneStore } from '../engine/store';
import { SenayanDistrict } from './SenayanDistrict';
import { SenayanTraffic } from './SenayanTraffic';
import { BridgeRoadDetail } from './BridgeRoadDetail';
import { HarborBridge } from './HarborBridge';
import type { Who } from './Person';
import { SkyAndHorizon } from './Ground';

/** Source-mapped Senayan context with the existing lesson bridge and inspection actors. */
export function KitCity() {
  const sceneWorld = useSceneStore((s) => s.scenes[s.index]?.world);
  const world = (sceneWorld ?? {}) as {
    inspect?: { pier: 'pier3' | 'pier2'; who: Who; leave?: boolean };
    markers?: boolean | 'pier2';
    core?: string;
  };
  return (
    <group name="Senayan lesson environment">
      <SkyAndHorizon ground={!world.core} />
      <SenayanDistrict />
      <SenayanTraffic />
      <HarborBridge inspect={world.inspect} markers={world.markers} />
      <BridgeRoadDetail />
    </group>
  );
}
