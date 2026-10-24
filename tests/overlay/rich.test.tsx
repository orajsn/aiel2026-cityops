import { render } from '@testing-library/react';
import { Rich, plain } from '../../src/overlay/Rich';

test('**words** are bold teal, !!words!! bold red, the rest plain', () => {
  const { container } = render(<Rich text="It knows **the world**, not !!your city!!." />);
  expect(container.querySelector('b.hl')?.textContent).toBe('the world');
  expect(container.querySelector('b.hl-red')?.textContent).toBe('your city');
  expect(container.textContent).toBe('It knows the world, not your city.');
  expect(plain('It knows **the world**, not !!your city!!.')).toBe('It knows the world, not your city.');
});
