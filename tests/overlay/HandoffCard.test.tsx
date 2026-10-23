import { render, screen } from '@testing-library/react';
import { HandoffCard } from '../../src/overlay/HandoffCard';

test('HandoffCard shows run, expect and minutes', () => {
  render(<HandoffCard card={{ run: 'Run Section 1.2 to 1.5', expect: 'READY', minutes: '4 min' }} />);
  expect(screen.getByText('Run Section 1.2 to 1.5')).toBeInTheDocument();
  expect(screen.getByText('READY')).toBeInTheDocument();
  expect(screen.getByText('4 min')).toBeInTheDocument();
  expect(screen.getByText('Now run')).toBeInTheDocument();
});
