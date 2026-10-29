import type { SceneDef } from '../engine/types';
import type { ThreeLabsProps } from '../overlay/concepts/ThreeLabs';

const HB = 'Harbor Bridge';

/** the Introduction (owner, 29 Oct): only the city, then the bridge and its three labs */
export const chapter0: SceneDef[] = [
  {
    // page 0 (owner, 25 Oct): the show opens on the wide view over Bangkok, so Next flies the camera down into
    // page 1 instead of page 1 opening on a still frame. Shows as page 0; the pages after keep their numbers.
    id: '0.0',
    chapter: 0,
    title: 'Bangkok from above',
    shot: 'city',
    pageZero: true,
  },
  {
    id: '0.1',
    chapter: 0,
    title: 'Bangkok, our city',
    shot: 'city',
    overlay: 'TitleCard',
    recapMode: true,
  },
  {
    id: '0.2',
    chapter: 0,
    title: 'The city wakes up',
    shot: 'city',
    world: { pins: 'all' },
    overlay: 'PinLegend',
  },
  // 0.7 · one bridge, three labs (owner, 29 Oct, FlowCardsV4): one panel across four clicks. Three equal cards, then
  // each lab's card opens in turn on its problem and what you build. The camera holds on the whole bridge.
  ...(['0.7', '0.7a', '0.7b', '0.7c'] as const).map(
    (id, step): SceneDef => ({
      id,
      chapter: 0,
      title: 'One bridge, three labs',
      shot: 'bridge',
      // no incident markers: the crack drawn in the panel is the one red thing on screen
      world: { pins: 'all', graph: HB, bridge: true },
      overlay: 'ThreeLabs',
      overlayGroup: 'three-labs',
      overlayProps: { step: step as ThreeLabsProps['step'] } satisfies ThreeLabsProps as unknown as Record<string, unknown>,
      ...(step === 0 ? { recapMode: true } : {}),
    }),
  ),
];

/**
 * The city's data, the question on the bridge, the database and the language model (owner, 29 Oct): these open
 * Lab 2 now, before 2.1, so the Introduction is only the city and the bridge. Their ids stay 0.x because the
 * owner's saved camera angles (cameraOverrides.json) and the #scene= addresses are keyed by id.
 */
export const lab2Opening: SceneDef[] = [
  {
    id: '0.3',
    chapter: 1,
    title: 'The data stream',
    shot: 'city',
    world: { pins: 'all', dataStream: true, highlight: ['City Operations Control Center'] },
    overlay: 'DataCounters',
  },
  {
    id: '0.4',
    chapter: 1,
    title: 'The question on the bridge',
    shot: 'pier3',
    // the inspector walks to the crack on Pier 3 and puts a torch on it
    world: { bridge: true, inspect: { pier: 'pier3', who: 'character-male-b' }, question: true },
    overlay: 'QuestionBubble',
  },
  {
    id: '0.5',
    chapter: 1,
    title: 'One database, four shapes',
    // the database explained on the sky stage over the Ops Center, like 1.1 to 1.3
    shot: 'sky',
    world: { sky: 'shapes' },
    overlay: 'CoreCaption',
    recapMode: true,
  },
  {
    id: '0.6',
    chapter: 1,
    title: 'The language model',
    shot: 'sky',
    world: { sky: 'brain', pins: 'all', highlight: ['City Operations Control Center'] },
    overlay: 'SmallBrain',
  },
];
