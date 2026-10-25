import type { SceneDef } from '../engine/types';

const HB = 'Harbor Bridge';

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
  {
    id: '0.3',
    chapter: 0,
    title: 'The data stream',
    shot: 'city',
    world: { pins: 'all', dataStream: true, highlight: ['City Operations Control Center'] },
    overlay: 'DataCounters',
  },
  {
    id: '0.4',
    chapter: 0,
    title: 'The question on the bridge',
    shot: 'pier3',
    // the inspector walks to the crack on Pier 3 and puts a torch on it
    world: { bridge: true, inspect: { pier: 'pier3', who: 'character-male-b' }, question: true },
    overlay: 'QuestionBubble',
  },
  {
    id: '0.5',
    chapter: 0,
    title: 'One database, four shapes',
    // the database explained on the sky stage over the Ops Center, like 1.1 to 1.3
    shot: 'sky',
    world: { sky: 'shapes' },
    overlay: 'CoreCaption',
    recapMode: true,
  },
  {
    id: '0.6',
    chapter: 0,
    title: 'The language model',
    shot: 'sky',
    world: { sky: 'brain', pins: 'all', highlight: ['City Operations Control Center'] },
    overlay: 'SmallBrain',
  },
  {
    id: '0.7',
    chapter: 0,
    title: 'One bridge, two problems',
    shot: 'bridge',
    world: { pins: 'all', graph: HB, bridge: true, markers: true },
    overlay: 'BridgeMarkers',
    recapMode: true,
  },
];
