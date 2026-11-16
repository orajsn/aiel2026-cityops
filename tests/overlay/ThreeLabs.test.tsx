import { render, within } from '@testing-library/react';
import { ThreeLabs } from '../../src/overlay/concepts/ThreeLabs';
import { OVERLAYS } from '../../src/overlay/registry';
import '../../src/overlay/concepts/register';
import { SCENES } from '../../src/scenes/index';
const modes = (c: HTMLElement) => [...c.querySelectorAll('[data-lab]')].map(k => k.getAttribute('data-mode'));
const questions = ['Which model should answer this request?', 'What evidence does this crack need?', 'What should the next inspector know?'];
test('overview presents all three learning questions and a persistent route', () => {
  const c = render(<ThreeLabs step={0} />).container;
  expect(c.querySelector('[data-testid="three-labs"]')?.getAttribute('data-step')).toBe('0');
  expect(modes(c)).toEqual(['mini', 'mini', 'mini']);
  expect(within(c).getAllByRole('heading', { level: 2 }).map(e => e.textContent)).toEqual(questions);
  for (const label of ['Choose the model', 'Build the agent', 'Add useful memory']) expect(c.textContent).toContain(label);
  expect(c.textContent).toContain('Check answer quality before comparing cost');
  expect(c.textContent).toContain('private-versus-shared scope');
});
test.each([1, 2, 3] as const)('step %i presents one readable detail and exactly three actions', n => {
  const c = render(<ThreeLabs step={n} />).container;
  expect(c.querySelector('[data-testid="three-labs"]')?.getAttribute('data-step')).toBe(String(n));
  expect(modes(c)).toEqual([1, 2, 3].map(k => k === n ? 'open' : 'closed'));
  expect(within(c).getAllByRole('heading', { level: 2 })).toHaveLength(1);
  expect(within(c).getByRole('heading', { level: 2 }).textContent).toBe(questions[n - 1]);
  expect(within(c).getAllByRole('listitem')).toHaveLength(3);
  expect(c.querySelectorAll('[data-lab]')).toHaveLength(3);
});
test('the three details keep distinct evidence, tooling and memory outcomes', () => {
  expect(render(<ThreeLabs step={1} />).container.textContent).toContain('Route text and image requests');
  expect(render(<ThreeLabs step={2} />).container.textContent).toContain('Inspect the trace and recommendation');
  const c = render(<ThreeLabs step={3} />).container;
  expect(c.textContent).toContain('Mercer records a finding. Vance returns');
  expect(c.textContent).toContain('Keep the original finding');
  expect(c.textContent).not.toMatch(/never sees|guaranteed|copilot|Pier [0-9]/i);
});
test('0.7 through 0.7c retain the same four scene IDs, step order and registered renderer', () => {
  expect(OVERLAYS.ThreeLabs).toBeDefined();
  const pages = SCENES.filter(s => s.overlay === 'ThreeLabs');
  expect(pages.map(s => s.id)).toEqual(['0.7', '0.7a', '0.7b', '0.7c']);
  expect(pages.map(s => s.overlayProps?.step)).toEqual([0, 1, 2, 3]);
  expect(pages[0].script).toContain('fictional Harbor Bridge');
  pages.slice(1).forEach((p, i) => expect(p.script).toContain(`Lab ${i + 1}`));
});
