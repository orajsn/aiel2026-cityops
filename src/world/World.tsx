import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import type { AssetType } from '../content/geo';
import { City } from './City';
import { Lighting } from './Lighting';
import { Effects } from './Effects';
import { AssetPins } from './AssetPins';
import { CameraRig } from './CameraRig';
import { FreeCam } from './FreeCam';
import { DataStream } from './DataStream';
import { DatabaseDiorama, type Face } from './DatabaseDiorama';
import { GraphLines, edgesFor } from './GraphLines';
import { VectorField, type VectorFieldProps } from './VectorField';
import { SkyStage, type SkyAct } from './SkyStage';

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
  /** which AI idea the sky stage over the Ops Center is showing (none = hidden) */
  sky?: SkyAct;
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
      <FreeCam />
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
      {w.vectors && <VectorField {...w.vectors} position={[0, -80, 40]} />}
      <SkyStage act={w.sky ?? null} />
      <Effects />
    </>
  );
}
