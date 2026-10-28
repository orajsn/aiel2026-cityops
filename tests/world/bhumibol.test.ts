import { vi } from 'vitest';
vi.mock('@react-three/drei', () => ({ useGLTF: Object.assign(() => ({ scene: null }), { preload: () => {} }) }));
import { BHUMIBOL } from '../../src/world/BhumibolBridge';
import { BRIDGE } from '../../src/world/bridgeFrame';
import { useGraphicsStore } from '../../src/engine/graphics';

// owner, 28 Oct: the Bhumibol Bridge model, scaled evenly so its towers stand where Harbor Bridge's towers stand
test('scaled evenly, the two towers land on the two tower piers, in the water off each bank', () => {
  const [west, east] = BRIDGE.pylonPiers.map((i) => BRIDGE.piers[i]);
  expect(BHUMIBOL.x + -BHUMIBOL.towerM * BHUMIBOL.scale).toBeCloseTo(west, 5);
  expect(BHUMIBOL.x + BHUMIBOL.towerM * BHUMIBOL.scale).toBeCloseTo(east, 5);
  // about 0.42 of real size: lower towers than today's, nearer the real proportions
  expect(BHUMIBOL.scale * 108).toBeGreaterThan(0.38);
  expect(BHUMIBOL.scale * 108).toBeLessThan(0.48);
  expect(BHUMIBOL.towerTopM * BHUMIBOL.scale).toBeLessThan(1);
});

test('the bridge model is a preview setting, Harbor Bridge by default, remembered on this device', () => {
  expect(useGraphicsStore.getState().bridge).toBe('harbor');
  useGraphicsStore.getState().setBridge('bhumibol');
  expect(localStorage.getItem('cityops.bridge')).toBe('bhumibol');
  useGraphicsStore.getState().setBridge('harbor');
});
