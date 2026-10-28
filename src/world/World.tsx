import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import type { AssetType } from '../content/geo';
import { City } from './City';
import { Lighting } from './Lighting';
import { Effects } from './Effects';
import { TimeOfDay } from './TimeOfDay';
import { FRAME } from '../engine/graphics';
import { AssetPins } from './AssetPins';
import { CameraRig } from './CameraRig';
import { FreeCam } from './FreeCam';
import { DataStream } from './DataStream';
import { DatabaseDiorama, type Face } from './DatabaseDiorama';
import { GraphLines, edgesFor } from './GraphLines';
import { VectorField, type VectorFieldProps } from './VectorField';
import { SkyStage, type SkyAct } from './SkyStage';
import { OpsRoom } from './OpsRoom';
import { BridgeQuestion } from './BridgeQuestion';
import { CITY_DIM } from './BangkokCity';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useTrafficStore } from '../engine/traffic';
import { STREAM_MS } from '../overlay/concepts/DataCounters';

export interface WorldProps {
  pins?: AssetType[] | 'all';
  highlight?: string[];
  dataStream?: boolean;
  core?: Face;
  graph?: boolean | string;
  vectors?: Omit<VectorFieldProps, 'position'>;
  bridge?: boolean;
  /** someone inspecting the damage on a pier (HarborBridge.tsx) */
  inspect?: { pier: 'pier3' | 'pier2'; who: string; leave?: boolean };
  /** true: both incident markers (Pier 3 and Pier 2); 'pier2': only Pier 2, the problem Lab 3 comes back for */
  markers?: boolean | 'pier2';
  /** which AI idea the sky stage over the Ops Center is showing (none = hidden) */
  sky?: SkyAct;
  /** close-up of the Ops Center control room, with the city faded behind it */
  ops?: boolean;
  /** 0.4: the inspector's question and the four shapes of data, in 3D beside the pier */
  question?: boolean;
}

export function World() {
  const scene = useSceneStore((s) => s.scenes[s.index]);
  // Traffic mode clears the page's story pieces away: only the city, its traffic and the routes stay
  const traffic = useTrafficStore((s) => s.editing);
  const w = (traffic ? {} : (scene?.world ?? {})) as WorldProps;
  const theme = useUiStore((s) => s.theme);
  const themeName = useUiStore((s) => s.themeName);
  return (
    <>
      <color attach="background" args={[theme.bg]} />
      <fogExp2 attach="fog" args={[theme.bg, theme.fogDensity]} />
      <CameraRig />
      <FreeCam />
      <Lighting />
      {/* Settings › Sky › Time of day: morning on the first page to evening on the last */}
      {themeName === 'time' && <TimeOfDay />}
      <City />
      {w.pins && <AssetPins visible={w.pins} highlight={w.highlight} />}
      <DataStream running={!!w.dataStream} durationMs={STREAM_MS} />
      {w.core && <DatabaseDiorama face={w.core} />}
      {(w.graph || w.core === 'graph') && (
        <GraphLines
          edges={edgesFor(typeof w.graph === 'string' ? w.graph : undefined)}
          highlight={typeof w.graph === 'string' ? w.graph : undefined}
        />
      )}
      {w.vectors && <VectorField {...w.vectors} position={[0, -80, 40]} />}
      <SkyStage act={w.sky ?? null} />
      <OpsRoom show={!!w.ops} />
      {w.question && !traffic && <BridgeQuestion key={scene?.id} />}
      <CityDimmer dim={w.ops ? 0.62 : 0} />
      <Effects />
      <FrameMeter />
    </>
  );
}

/** eases the city's fade into the haze towards `dim` (0 = clear) */
function CityDimmer({ dim }: { dim: number }) {
  useFrame((_, dt) => {
    CITY_DIM.value += (dim - CITY_DIM.value) * Math.min(1, dt * 2.5);
  });
  return null;
}

/** counts frames for the frame rate readout (Settings › Graphics › Show frame rate) */
function FrameMeter() {
  const n = useRef({ frames: 0, since: 0 });
  useFrame(({ clock }) => {
    const m = n.current;
    m.frames++;
    const now = clock.elapsedTime;
    if (now - m.since >= 0.5) {
      FRAME.fps = Math.round(m.frames / (now - m.since));
      m.frames = 0;
      m.since = now;
    }
  });
  return null;
}
