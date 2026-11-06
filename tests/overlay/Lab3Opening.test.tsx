import { render } from '@testing-library/react';
import { Hook, WhyForgot, WhereItGoes, GlassBridge, Handover } from '../../src/overlay/concepts/Lab3Opening';
import { LAB3_ALL, chapter2, LAB3_CUT } from '../../src/scenes/chapter2';

// owner, 6 Nov: the compressed opening, Mercer first (Day 1), then Vance (Day 2); pages 3.1a to 3.5b are hidden, not deleted
test('the opening runs Mercer first, then Vance, then the cabinet, the glass and the handover', () => {
  const ids = chapter2.map((s) => s.id);
  expect(ids.slice(0, 14)).toEqual(['3.0', '3.2f', '3.2g', '3.1h', '3.1i', '3.3h', '3.3i', '3.3j', '3.3p', '3.3a', '3.3b', '3.3f', '3.5h', '3.6m']);
  const at = (id: string) => LAB3_ALL.find((s) => s.id === id)!;
  expect(at('3.2f').world).toMatchObject({ inspect: { who: 'character-female-a' } });
  expect(at('3.1h').world).toMatchObject({ inspect: { who: 'character-male-d' } });
  for (const id of ['3.1a', '3.1b', '3.1c', '3.2a', '3.2b', '3.2p', '3.2q', '3.2r', '3.2c', '3.2e', '3.4a', '3.4b', '3.4c', '3.4d', '3.5b']) expect(LAB3_CUT.has(id), id).toBe(true);
});

test('the hook: the with-memory answer is locked, then revealed; the without-memory one never changes', () => {
  const a = render(<Hook kicker="k" step={1} message="m" />).container;
  expect(a.querySelector('[data-lock]')).not.toBeNull();
  const b = render(<Hook kicker="k" step={2} message="m" />).container;
  expect(b.querySelector('[data-lock]')).toBeNull();
  expect(b.textContent).toContain('Mercer logged');
  expect(a.querySelector('[data-hook="without"]')!.textContent).toBe(b.querySelector('[data-hook="without"]')!.textContent);
});

test('Mercer is the character at the desk and by the cabinet, and the book is open, then shut', () => {
  const open = render(<WhyForgot kicker="k" step={1} message="m" />).container;
  const shut = render(<WhyForgot kicker="k" step={2} message="m" />).container;
  expect(open.querySelector('[data-art="book-open"] image')).not.toBeNull();
  expect(shut.querySelector('[data-art="book-shut"]')).not.toBeNull();
  expect(shut.textContent).toContain('SESSION CLOSED');
  const cab = render(<WhereItGoes kicker="k" step={1} message="m" />).container;
  expect(cab.querySelector('[data-art="cabinet"] image')).not.toBeNull();
});

test('three cards, then Vance’s three questions pull them back; the glass and the handover name the notebook Parts', () => {
  const cards = render(<WhereItGoes kicker="k" step={2} message="m" />).container;
  expect(cards.textContent).toContain('episodic');
  expect(cards.textContent).not.toContain('What happened here?');
  const pull = render(<WhereItGoes kicker="k" step={3} message="m" />).container;
  expect(pull.textContent).toContain('What happened here?');
  const fixes = render(<GlassBridge kicker="k" message="m" mode="fixes" />).container;
  expect([...fixes.querySelectorAll('[data-fix]')].map((e) => e.getAttribute('data-fix'))).toEqual(['Part 3', 'Part 4', 'Part 4', 'Part 6']);
  expect(render(<GlassBridge kicker="k" message="m" mode="pour" />).container.querySelector('[data-glass="pour"]')).not.toBeNull();
  const h = render(<Handover kicker="k" message="m" />).container;
  expect(h.textContent).toMatch(/Part 6 · one whole turn/);
  expect(h.textContent).not.toMatch(/engineering|harness/i);
});
