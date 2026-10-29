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
