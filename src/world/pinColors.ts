import type { AssetType } from '../content/geo';

const COLORS: Record<AssetType, string> = {
  bridge: '#C74634',
  substation: '#F5B700',
  pipeline: '#4FB3FF',
  water: '#2EC4B6',
  energy: '#FF8C42',
  sensor: '#B8F2E6',
  comms: '#C77DFF',
  civil: '#9AA5B1',
  ops: '#FFFFFF',
};

export function pinColor(type: AssetType): string {
  return COLORS[type];
}

/** Order in which pin types rise out of the map in scene 0.2. */
export const TYPE_ORDER: AssetType[] = [
  'bridge',
  'substation',
  'pipeline',
  'water',
  'energy',
  'sensor',
  'comms',
  'civil',
  'ops',
];

export const TYPE_LABEL: Record<AssetType, string> = {
  bridge: 'bridges',
  substation: 'substations',
  pipeline: 'pipelines',
  water: 'water',
  energy: 'energy',
  sensor: 'sensors',
  comms: 'comms',
  civil: 'seawalls',
  ops: 'ops centers',
};
