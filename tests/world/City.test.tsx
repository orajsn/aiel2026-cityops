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

test('City falls back to the procedural city when the GLB fails', async () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const r = await ReactThreeTestRenderer.create(<City model="/models/bangkok.glb" />);
  const found = r.scene.findAll((n) => n.instance.name === 'procedural-city');
  expect(found.length).toBeGreaterThan(0);
  spy.mockRestore();
});
