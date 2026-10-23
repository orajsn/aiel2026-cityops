import { render } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children?: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: () => {},
  useThree: () => ({}),
}));
vi.mock('../src/world/World', () => ({ World: () => null }));

import App from '../src/App';

test('App renders the overlay host', () => {
  const { container } = render(<App />);
  expect(container.querySelector('#overlay')).not.toBeNull();
});
