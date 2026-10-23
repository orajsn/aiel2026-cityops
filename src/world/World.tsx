import { useSceneStore } from '../engine/store';
import type { AssetType } from '../content/geo';
import { City } from './City';
import { Lighting } from './Lighting';
import { Effects } from './Effects';
import { AssetPins } from './AssetPins';
import { CameraRig } from './CameraRig';

export interface WorldProps {
  pins?: AssetType[] | 'all';
  highlight?: string[];
}

export function World() {
  const scene = useSceneStore((s) => s.scenes[s.index]);
  const w = (scene?.world ?? {}) as WorldProps;
  return (
    <>
      <fogExp2 attach="fog" args={['#0B0E14', 0.0024]} />
      <CameraRig />
      <Lighting />
      <City />
      {w.pins && <AssetPins visible={w.pins} highlight={w.highlight} />}
      <Effects />
    </>
  );
}
