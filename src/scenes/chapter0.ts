import type { SceneDef } from '../engine/types';

const HB = 'Harbor Bridge';

export const chapter0: SceneDef[] = [
  {
    id: '0.1',
    chapter: 0,
    title: 'Night over the river',
    enterFrom: 'arrive',
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
    world: { bridge: true, inspect: { pier: 'pier3', who: 'character-male-b' } },
    overlay: 'QuestionBubble',
  },
  {
    id: '0.5',
    chapter: 0,
    title: 'One database, four shapes',
    // the database explained on the sky stage over the Ops Center, like 1.1 to 1.3
    shot: 'sky',
    world: { sky: 'shapes', pins: 'all', highlight: ['City Operations Control Center'] },
    overlay: 'CoreCaption',
    overlayProps: { face: 'none' },
    recapMode: true,
  },
  { id: '0.5a', chapter: 0, title: 'Tables', shot: 'sky', world: { sky: 'tables', pins: 'all', highlight: ['City Operations Control Center'] }, overlay: 'CoreCaption', overlayProps: { face: 'tables' } },
  { id: '0.5b', chapter: 0, title: 'JSON', shot: 'sky', world: { sky: 'json', pins: 'all', highlight: ['City Operations Control Center'] }, overlay: 'CoreCaption', overlayProps: { face: 'json' } },
  { id: '0.5c', chapter: 0, title: 'Graph', shot: 'sky', world: { sky: 'graph', pins: 'all', graph: 'Harbor Bridge', highlight: ['City Operations Control Center'] }, overlay: 'CoreCaption', overlayProps: { face: 'graph' } },
  { id: '0.5d', chapter: 0, title: 'Vectors', shot: 'sky', world: { sky: 'vectors', pins: 'all', highlight: ['City Operations Control Center'] }, overlay: 'CoreCaption', overlayProps: { face: 'vectors' } },
  {
    id: '0.6',
    chapter: 0,
    title: 'Meet the small brain',
    shot: 'sky',
    world: { sky: 'brain', pins: 'all', highlight: ['City Operations Control Center'] },
    overlay: 'SmallBrain',
  },
  {
    id: '0.7',
    chapter: 0,
    title: 'The hero asset',
    shot: 'bridge',
    world: { pins: 'all', graph: HB, bridge: true, markers: true },
    overlay: 'BridgeMarkers',
    recapMode: true,
  },
];
