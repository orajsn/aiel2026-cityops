import { render, screen } from '@testing-library/react';
import { PinCardBody } from '../../src/world/PinCard';
import { assetById } from '../../src/content/geo';

test('PinCard shows the name, a spec key and five filled criticality dots', () => {
  const hb = assetById('Harbor Bridge')!;
  const { container } = render(<PinCardBody asset={hb} />);
  expect(screen.getByText('Harbor Bridge')).toBeInTheDocument();
  expect(screen.getByText('span_length_m')).toBeInTheDocument();
  expect(container.querySelectorAll('[data-dot].filled')).toHaveLength(5);
});

test('PinCard fills only as many dots as the criticality', () => {
  const a = assetById('Air Quality Monitor NI-01')!;
  const { container } = render(<PinCardBody asset={a} />);
  expect(container.querySelectorAll('[data-dot].filled')).toHaveLength(2);
  expect(container.querySelectorAll('[data-dot]')).toHaveLength(5);
});
