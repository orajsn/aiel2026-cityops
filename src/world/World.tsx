import { useSceneStore } from '../engine/store';
import type { AssetType } from '../content/geo';
import { City } from './City';
import { Lighting } from './Lighting';
import { Effects } from './Effects';
import { AssetPins } from './AssetPins';
import { CameraRig } from './CameraRig';
import { DataStream } from './DataStream';
import { OracleCore, type Face } from './OracleCore';
import { GraphLines, edgesFor } from './GraphLines';
import { VectorField, type VectorFieldProps } from './VectorField';

export interface WorldProps {
  pins?: AssetType[] | 'all';
  highlight?: string[];
  dataStream?: boolean;
  core?: Face;
  graph?: boolean | string;
  vectors?: Omit<VectorFieldProps, 'position'>;
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
      <DataStream running={!!w.dataStream} />
      {w.core && <OracleCore face={w.core} />}
      {(w.graph || w.core === 'graph') && (
        <GraphLines
          edges={edgesFor(typeof w.graph === 'string' ? w.graph : undefined)}
          highlight={typeof w.graph === 'string' ? w.graph : undefined}
        />
      )}
      {w.vectors && <VectorField {...w.vectors} position={[0, -80, 40]} />}
      <Effects />
    </>
  );
}
