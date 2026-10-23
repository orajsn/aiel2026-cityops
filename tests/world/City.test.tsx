import ReactThreeTestRenderer from '@react-three/test-renderer';
import { vi } from 'vitest';

vi.mock('@react-three/drei', async () => {
  const actual = await vi.importActual<typeof import('@react-three/drei')>('@react-three/drei');
  return {
    ...actual,
    useGLTF: () => {
      throw new Error('glb missing');
    },
  };
});

import { City } from '../../src/world/City';

// the owner's map is the only city: never show the old generated box city, not even while loading
test('City never falls back to the old procedural city', async () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const r = await ReactThreeTestRenderer.create(<City />);
  expect(r.scene.findAll((n) => n.instance.name === 'procedural-city')).toHaveLength(0);
  spy.mockRestore();
});
