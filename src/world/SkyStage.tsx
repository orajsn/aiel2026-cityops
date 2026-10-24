import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { ASSETS, project } from '../content/geo';
import { useUiStore } from '../engine/ui';
import { FlowArc } from './FlowArc';
import { VectorField } from './VectorField';
import { layoutCloud, nearestK } from './vectorLayout';
import { SkyShapes } from './SkyShapes';
import { SkyLab2, type Lab2Act } from './SkyLab2';
import { NeuralNet } from './NeuralNet';
import type { Vec3 } from './shots';
import { SKY_ANCHOR, MODEL, MODEL_SCALE, MODEL_IN, MODEL_OUT, DB, CLOUD, ENVELOPE, OPS_TOP, along, DB_WIDE, MODEL_WIDE, MODEL_WIDE_IN, BRIEF_AT } from './skyPlaces';
import { UnifiedBoard } from './UnifiedBoard';
import { boardPoint } from './answerBoard';

/**
 * The sky stage: where the AI ideas are explained, floating above City Operations Control Center
 * (the question starts there and the answer must land there). It grows in when a page needs it
 * and shrinks away when the story goes back to the bridge.
 *
 * Acts (Lab 2):
 *  - model:    only the model is up there; the question rises to it and nothing comes back from the city.
 *  - embed:    the database appears; documents rise into it from the pins and become a cloud of points;
 *              the question becomes one point and its 5 nearest light up.
 *  - envelope: those 5 fly into an envelope with the question, the envelope goes to the model,
 *              and the answer comes down to the Ops Center.
 * Acts (the city, 0.5 to 0.6):
 *  - shapes:   what the inspector's answer needs: four panels (table, JSON, graph, vectors) around one Oracle AI Database;
 *  - brain:    the small model alone, centre stage.
 */
export type SkyAct = 'model' | 'embed' | 'envelope' | 'shapes' | 'brain' | 'tools' | 'unified' | Lab2Act;

export { SKY_ANCHOR } from './skyPlaces';
const A = SKY_ANCHOR;
const CLOUD_SCALE = 0.075;
/** the question as a point in the cloud's own space (near the "structural" cluster) */
const QUERY: Vec3 = [8, 6, -4];

const LAB2_ACTS: (SkyAct | null)[] = ['overflow', 'note'];
/** Lab 2 pages 5 and 6: the database far left, the model far right (skyPlaces), the tools or the four shapes between */
const WIDE_ACTS: (SkyAct | null)[] = ['tools', 'unified'];

/**
 * 1.1 · the bare model. The question is the lab's own (rag_to_agents_lab, scenario 1); the answer is a draft
 * (the notebooks keep no recorded outputs): fluent, general, and knows nothing of the city.
 */
const BARE_Q = '“What recent issues have been reported on Harbor Bridge?”';
/** the question stands on the left, the guess on the right, and both stay until the next page (owner: give people time to read) */
const QUESTION_AT: Vec3 = along([MODEL_IN[0], MODEL[1] + 0.7, MODEL_IN[2]], -2.5);
/** the answer stands to the right of the model's last layer */
const ANSWER_AT: Vec3 = along([MODEL_OUT[0], MODEL[1] - 0.9, MODEL_OUT[2]], 0.5);
const BARE_A = '“I don’t have any reports about a Harbor Bridge in your city. In general, bridges can show cracking, corrosion or bearing wear…”';
/** Lab 2 page 3: the answer comes out of the model's last layer, built from the references (draft wording, no recorded run) */
const RAG_ANSWER_AT: Vec3 = along([MODEL_OUT[0], MODEL[1] - 1.4, MODEL_OUT[2]], 0.5);
const RAG_A = '“Harbor Bridge has two recent findings: a hairline crack near a bearing plate, 0.12 mm, and surface corrosion on a bearing assembly, about 25% section loss. From the five reports retrieved.”';

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/** the longest act animation; after this the stage holds still and React stops re-rendering it */
const ACT_MS = 12000;

/**
 * ms since `act` last changed. Re-rendering the stage on every frame rebuilt lines and tubes sixty times
 * a second (the app crawled after a minute), so it ticks at most 30 times a second and stops at ACT_MS;
 * anything that keeps moving after that (the model's wave, the vector search) animates in its own useFrame.
 */
function useActClock(act: SkyAct | null) {
  const start = useRef(performance.now());
  const last = useRef(0);
  const [t, setT] = useState(0);
  useEffect(() => {
    start.current = performance.now();
    last.current = 0;
    setT(0);
  }, [act]);
  useFrame(() => {
    const now = performance.now();
    const elapsed = now - start.current;
    if (elapsed > ACT_MS + 100 || now - last.current < 33) return;
    last.current = now;
    setT(Math.min(elapsed, ACT_MS + 100));
  });
  return t;
}

export function SkyStage({ act }: { act: SkyAct | null }) {
  const theme = useUiStore((s) => s.theme);
  const root = useRef<THREE.Group>(null);
  const shown = useRef(0);
  const [visible, setVisible] = useState(false);
  const t = useActClock(act);

  // grow in / shrink away
  useFrame((_, dt) => {
    const target = act ? 1 : 0;
    shown.current += (target - shown.current) * Math.min(1, dt * 3.2);
    const s = ease(shown.current);
    if (root.current) root.current.scale.setScalar(Math.max(0.0001, s));
    const v = shown.current > 0.01;
    if (v !== visible) setVisible(v);
  });

  const sources = useMemo<Vec3[]>(
    () =>
      ASSETS.filter((a) => a.id !== 'City Operations Control Center')
        .filter((_, i) => i % 3 === 0)
        .map((a) => {
          const p = project(a.lat, a.lon);
          return [p.x, 1.1, p.z] as Vec3;
        }),
    [],
  );
  const cloud = useMemo(() => layoutCloud(600, 7), []);
  const near = useMemo(() => nearestK(cloud, QUERY, 5), [cloud]);
  const nearWorld = useMemo<Vec3[]>(
    () => near.map((i) => [CLOUD[0] + cloud[i][0] * CLOUD_SCALE, CLOUD[1] + cloud[i][1] * CLOUD_SCALE, CLOUD[2] + cloud[i][2] * CLOUD_SCALE]),
    [near, cloud],
  );

  const hasDb = act === 'embed' || act === 'envelope';
  const embedded = act === 'envelope' || (act === 'embed' && t > 2600);
  const showQuery = act === 'envelope' || (act === 'embed' && t > 4200);

  // page 3: the 5 references fly in and stack up (0.8-2.2 s), the stack goes into the model's first layer (2.4-3.6 s)
  // and is taken in there; the model writes, and the answer stands at its last layer (5.2 s)
  const fly = act === 'envelope' ? ease((t - 800) / 1200) : 0;
  const travel = act === 'envelope' ? ease((t - 2400) / 1200) : 0;
  // the envelope goes to the model's first layer and is taken in there
  const dock = along(MODEL_IN, -0.45);
  const envPos: Vec3 = [ENVELOPE[0] + (dock[0] - ENVELOPE[0]) * travel, ENVELOPE[1] + (dock[1] - ENVELOPE[1]) * travel, ENVELOPE[2] + (dock[2] - ENVELOPE[2]) * travel];
  // once it has arrived there it fades away in place (a scale would shrink it towards the world origin: a warp)
  const intake = act === 'envelope' ? 1 - ease((t - 3600) / 600) : 1;

  return (
    <>
      {/* 0.5's board sits outside the grow-in: its pieces hand over from 0.4 without a hidden frame */}
      {act === 'shapes' && <SkyShapes red={theme.red} />}
      {act === 'unified' && <UnifiedBoard t={t} />}
      <group name="sky-stage" visible={visible}>
      {/* scale about the anchor so the stage grows out of its own centre */}
      <group position={A}>
        <group ref={root}>
          <group position={[-A[0], -A[1], -A[2]]}>
            {(act === 'model' || act === 'embed' || act === 'envelope') && <ModelOrb position={MODEL} lit={act === 'envelope' && t > 3800} doubt={act === 'model' && t > 2600} producing={(act === 'model' && t > 2300) || (act === 'envelope' && t > 3800)} labelled={visible} scale={MODEL_SCALE} />}
            {act === 'brain' && <ModelOrb position={[A[0], A[1] + 0.4, A[2]]} lit doubt={false} producing labelled={visible} scale={2.2} />}
            {act && LAB2_ACTS.includes(act) && <SkyLab2 act={act as Lab2Act} center={[A[0], A[1] + 0.2, A[2]]} t={t} red={theme.red} opsTop={OPS_TOP} />}
            {hasDb && <SkyDatabase color={theme.red} appearMs={0} t={t} />}
            {act && WIDE_ACTS.includes(act) && <SkyDatabase color={theme.red} appearMs={0} t={9999} position={DB_WIDE} />}
            {act && WIDE_ACTS.includes(act) && <ModelOrb position={MODEL_WIDE} lit doubt={false} producing={act === 'tools' || t > 5600} labelled={visible} scale={MODEL_SCALE} />}
            {hasDb && (
              <group position={CLOUD} scale={CLOUD_SCALE}>
                <VectorField phase={embedded ? 'embedded' : 'documents'} query={showQuery ? QUERY : undefined} k={5} spin={false} documentsOffset={[0, -14, 0]} tweenMs={1400} />
              </group>
            )}
            {act === 'envelope' && (
              <>
                {nearWorld.map((p, i) => (
                  <mesh key={i} position={[p[0] + (envPos[0] - p[0]) * fly, p[1] + (envPos[1] - p[1]) * fly, p[2] + (envPos[2] - p[2]) * fly]} visible={travel < 0.05 && t < 1150 + i * 230}>
                    <sphereGeometry args={[0.09, 10, 10]} />
                    <meshBasicMaterial color={theme.red} toneMapped={false} />
                  </mesh>
                ))}
                <group position={envPos} scale={1.4}>
                  <PaperStack position={[0, 0, 0]} sheets={nearWorld.map((_, i) => t > 1150 + i * 230)} opacity={intake} />
                </group>
                {visible && <SkyLabel position={[ENVELOPE[0], ENVELOPE[1] + 0.9, ENVELOPE[2]]} text="5 references + the question · context is data, not instructions" show={t > 1800 && travel < 0.2} />}
              </>
            )}
          </group>
        </group>
      </group>
      {/* flows between the city and the stage (outside the scaled group so they stay anchored to the city) */}
      {visible && act === 'model' && <FlowArc key="q-up" from={along([QUESTION_AT[0], QUESTION_AT[1] - 0.4, QUESTION_AT[2]], 1.5)} to={MODEL_IN} lift={0.4} radius={0.05} durationMs={1600} delayMs={900} fadeMs={900} color="#ffffff" />}
      {visible && act === 'embed' &&
        sources.map((s, i) => <FlowArc key={`doc-${i}`} from={s} to={DB} lift={2.5} radius={0.04} durationMs={1300} delayMs={500 + i * 180} fadeMs={600} color={theme.data} />)}
      {/* page 6: the query comes up from the Ops Center into the database; the brief goes into the model's first layer */}
      {visible && act === 'unified' && <FlowArc key="query" from={OPS_TOP} to={[DB_WIDE[0], DB_WIDE[1] + 0.5, DB_WIDE[2]]} lift={1.2} radius={0.05} durationMs={1200} delayMs={200} fadeMs={800} color="#ffffff" />}
      {visible && act === 'unified' && <FlowArc key="brief" from={boardPoint(BRIEF_AT.x, BRIEF_AT.y + 0.17)} to={MODEL_WIDE_IN} lift={0.3} radius={0.05} durationMs={1200} delayMs={4600} persist color="#C74634" />}
      {/* 1.1: the inspector's question goes in bare, and a general guess comes out */}
      {visible && act === 'model' && <SkyCard position={QUESTION_AT} who="the question" text={BARE_Q} show={t > 200} />}
      {visible && act === 'model' && <SkyCard position={ANSWER_AT} who="the language model · answer" text={BARE_A} show={t > 3900} tone="grey" anchor="left" />}
      {visible && <SkyLabel position={[DB[0], DB[1] - 1.2, DB[2]]} text="Oracle AI Database · 384 numbers per text" show={act === 'embed' && t > 2800} />}
      {visible && act === 'envelope' && <SkyCard position={RAG_ANSWER_AT} who="the language model · answer, from the references" text={RAG_A} show={t > 5200} anchor="left" />}
      </group>
    </>
  );
}

/**
 * The language model: a 3D neural network (NeuralNet.tsx). A wave of light runs through its layers while it
 * writes an answer; grey when it has nothing to go on, teal when it has the evidence.
 */
function ModelOrb({ position, lit, doubt, labelled, producing, scale = 1 }: { position: Vec3; lit: boolean; doubt: boolean; labelled: boolean; producing: boolean; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <NeuralNet producing={producing} doubt={!lit} />
      {/* HTML does not inherit 3D visibility: only mount the name while the stage is up */}
      {labelled && (
        <Html position={[0, 1.15, 0]} center zIndexRange={[16, 0]} style={{ pointerEvents: 'none' }}>
          <div className="sky-name">{doubt ? 'language model · ?' : 'language model'}</div>
        </Html>
      )}
    </group>
  );
}

/** the Oracle database: three red discs, rising in one after another */
function SkyDatabase({ color, t, position = DB }: { color: string; appearMs: number; t: number; position?: Vec3 }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => {
        const k = ease((t - i * 180) / 700);
        return (
          <mesh key={i} position={[0, i * 0.42 - (1 - k) * 0.6, 0]} scale={[1, Math.max(0.001, k), 1]} castShadow>
            <cylinderGeometry args={[1.05, 1.05, 0.34, 48]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        );
      })}
      <Line points={[[0, -0.4, 0], [0, -DB[1] + 1.2, 0]]} color="#1B8A9C" lineWidth={1} transparent opacity={0.35} dashed dashSize={0.25} gapSize={0.2} />
    </group>
  );
}

/** the references: sheets of paper piling up flat as the retrieved reports arrive, the question (a red line) on top */
function PaperStack({ position, sheets, opacity = 1 }: { position: Vec3; sheets: boolean[]; opacity?: number }) {
  const n = sheets.filter(Boolean).length;
  return (
    <group position={position} visible={opacity > 0.01}>
      {sheets.map((on, i) => (
        <mesh key={i} position={[(i % 2) * 0.05 - 0.025, i * 0.055, (i % 3) * 0.03 - 0.03]} rotation={[0, (i % 2 ? -1 : 1) * 0.12 * (i % 3), 0]} visible={on} castShadow>
          <boxGeometry args={[0.95, 0.035, 0.68]} />
          <meshStandardMaterial color={i % 2 ? '#f3eee2' : '#faf7ef'} roughness={0.85} transparent opacity={opacity} />
        </mesh>
      ))}
      {/* the question, a red line on the top sheet */}
      <mesh position={[0, n * 0.055 - 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={n > 0}>
        <planeGeometry args={[0.5, 0.07]} />
        <meshBasicMaterial color="#C74634" transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  );
}

function SkyLabel({ position, text, show, tone = 'teal' }: { position: Vec3; text: string; show: boolean; tone?: 'teal' | 'grey' }) {
  return (
    <Html position={position} center zIndexRange={[16, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`sky-label tone-${tone}`} style={{ opacity: show ? 1 : 0 }}>
        {text}
      </div>
    </Html>
  );
}

/** a small card in the sky: who is speaking, and the words */
/** a sky card's box on the stage (styles.css .sky-card: 460 px wide plus padding), used to keep it on screen */
const CARD_W = 500;
const CARD_H = 210;
const EDGE = 24;
const cardPos = new THREE.Vector3();

/**
 * A speaking card in the sky: who is speaking, and the words. Anchored at its centre, or by its left edge
 * ('left': an answer standing right of the model's last layer). Whatever the camera does, the card stays
 * inside the stage: its screen position is clamped before it is placed (owner: words ran off the screen).
 */
function SkyCard({ position, who, text, show, tone = 'teal', anchor = 'center' }: { position: Vec3; who: string; text: string; show: boolean; tone?: 'teal' | 'grey'; anchor?: 'center' | 'left' }) {
  const place = (el: THREE.Object3D, camera: THREE.Camera, size: { width: number; height: number }): [number, number] => {
    cardPos.setFromMatrixPosition(el.matrixWorld).project(camera);
    let x = ((cardPos.x + 1) / 2) * size.width;
    let y = ((-cardPos.y + 1) / 2) * size.height;
    const left = anchor === 'left' ? 0 : CARD_W / 2;
    x = Math.min(Math.max(x, EDGE + left), size.width - EDGE - (CARD_W - left));
    y = Math.min(Math.max(y, EDGE + CARD_H / 2), size.height - 150 - CARD_H / 2); // 150: the script bar
    return [x, y];
  };
  return (
    <Html position={position} calculatePosition={place} zIndexRange={[16, 0]} style={{ pointerEvents: 'none', transform: anchor === 'left' ? 'translate(0, -50%)' : 'translate(-50%, -50%)' }}>
      <div className={`sky-card tone-${tone}`} style={{ opacity: show ? 1 : 0 }}>
        <div className="sky-card__who">{who}</div>
        <div className="sky-card__text">{text}</div>
      </div>
    </Html>
  );
}

