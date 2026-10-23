import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import type { AssetType } from '../content/geo';
import { City } from './City';
import { Lighting } from './Lighting';
import { Effects } from './Effects';
import { AssetPins } from './AssetPins';
import { CameraRig } from './CameraRig';
import { DataStream } from './DataStream';
import { DatabaseDiorama, type Face } from './DatabaseDiorama';
import { GraphLines, edgesFor } from './GraphLines';
import { VectorField, type VectorFieldProps } from './VectorField';
import { HarborBridge } from './HarborBridge';

export interface WorldProps {
  pins?: AssetType[] | 'all';
  highlight?: string[];
  dataStream?: boolean;
  core?: Face;
  graph?: boolean | string;
  vectors?: Omit<VectorFieldProps, 'position'>;
  bridge?: boolean;
  inspector?: boolean;
  markers?: boolean;
}

export function World() {
  const scene = useSceneStore((s) => s.scenes[s.index]);
  const w = (scene?.world ?? {}) as WorldProps;
  const theme = useUiStore((s) => s.theme);
  return (
    <>
      <color attach="background" args={[theme.bg]} />
      <fogExp2 attach="fog" args={[theme.bg, theme.fogDensity]} />
      <CameraRig />
      <Lighting />
      <City />
      {w.pins && <AssetPins visible={w.pins} highlight={w.highlight} />}
      <DataStream running={!!w.dataStream} />
      {w.core && <DatabaseDiorama face={w.core} />}
      {(w.graph || w.core === 'graph') && (
        <GraphLines
          edges={edgesFor(typeof w.graph === 'string' ? w.graph : undefined)}
          highlight={typeof w.graph === 'string' ? w.graph : undefined}
        />
      )}
      {w.bridge && <HarborBridge inspector={w.inspector} markers={w.markers} />}
      {w.vectors && <VectorField {...w.vectors} position={[0, -80, 40]} />}
      <Effects />
    </>
  );
}
