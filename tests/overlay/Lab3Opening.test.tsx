import { render, act } from '@testing-library/react';
import { Hook, WhyForgot, WhereItGoes, GlassBridge, Handover, Neither } from '../../src/overlay/concepts/Lab3Opening';
import { useDrawerStore, PAGE_STEPS, focusStepCount } from '../../src/engine/presentation';
import { LAB3_ALL, chapter2, LAB3_CUT } from '../../src/scenes/chapter2';

const build = (focus: number) => act(() => useDrawerStore.setState({ open: focus > 0, focus, done: false }));
afterEach(() => build(0));
const shown = (c: HTMLElement, prefix: string) => [...c.querySelectorAll(`[data-reveal^="${prefix}"]`)].map((e) => e.getAttribute('data-shown'));

// owner, 6 Nov: the compressed opening, Mercer first (Day 1), then Vance (Day 2); pages 3.1a to 3.5b are hidden, not deleted
test('the opening runs Mercer first, then Vance, then the logbook, the glass and the handover; no two pages look the same', () => {
  const ids = chapter2.map((s) => s.id);
  expect(ids.slice(0, 12)).toEqual(['3.0', '3.2f', '3.1h', '3.3h', '3.3i', '3.3p', '3.3a', '3.3b', '3.5h', '3.5g', '3.5e', '3.6m']); // the lab page again before the code, then the three disciplines
  const at = (id: string) => LAB3_ALL.find((s) => s.id === id)!;
  expect(at('3.2f').world).toMatchObject({ inspect: { who: 'character-female-a' } });
  expect(at('3.1h').world).toMatchObject({ inspect: { who: 'character-male-d' } });
  for (const id of ['3.1a', '3.1b', '3.1c', '3.2a', '3.2b', '3.2p', '3.2q', '3.2r', '3.2c', '3.2e', '3.4a', '3.4b', '3.4c', '3.4d', '3.5b']) expect(LAB3_CUT.has(id), id).toBe(true);
  // a page that keeps building does not repeat itself on the next page: one page per idea, every Next adds a part
  expect(ids.indexOf('3.15f')).toBeGreaterThan(ids.indexOf('3.6m')); // the four glasses solved are the ending, after the code
  expect(LAB3_CUT.has('3.15b')).toBe(true);
  expect(PAGE_STEPS).toMatchObject({ '3.1h': 3, '3.2f': 4, '3.3h': 2, '3.3i': 3, '3.3p': 3, '3.15f': 4, '3.5h': 4 });
  expect(focusStepCount('3.2f')).toBe(4);
});

test('the memory analogy is Lab 2’s: the visit notebook (short-term) and the bridge logbook (long-term)', () => {
  build(0);
  const c = render(<WhyForgot kicker="k" message="m" />).container;
  expect(c.textContent).toContain('Visit notebook');
  expect(shown(c, 'say-')).toEqual(['false', 'false', 'false']);
  build(2);
  expect(shown(c, 'say-')).toEqual(['true', 'true', 'false']);
  expect(c.querySelector('[data-art="visit-notebook"]')!.getAttribute('data-lines')).toBe('2');
  build(4); // the last click: the chat closes and the notebook is cleared
  expect(c.querySelector('[data-art="visit-notebook"]')!.getAttribute('data-cleared')).toBe('true');
  expect(c.textContent).toContain('SESSION CLOSED');
  build(1);
  const lb = render(<WhereItGoes kicker="k" step={1} message="m" />).container;
  expect(lb.textContent).toContain('Bridge logbook');
  expect(lb.querySelector('[data-art="logbook"]')).not.toBeNull();
  expect(lb.textContent).not.toMatch(/cabinet|librarian/i);
});

test('the hook builds in three clicks: the answer without memory, the locked one, the reveal', () => {
  build(2);
  const a = render(<Hook kicker="k" message="m" />).container;
  expect(shown(a, 'with').slice(-1)).toEqual(['true']); // 'without' and 'with' are both on
  expect(a.querySelector('[data-lock]')).not.toBeNull();
  build(3);
  const b = render(<Hook kicker="k" message="m" />).container;
  expect(b.querySelector('[data-lock]')).toBeNull();
  expect(b.textContent).toContain('Mercer logged');
});

test('each click brings one card together with Vance’s question; the glass and the handover name the notebook Parts', () => {
  build(2);
  const cards = render(<WhereItGoes kicker="k" step={2} message="m" />).container;
  expect(shown(cards, 'card-')).toEqual(['true', 'true', 'false']);
  expect(shown(cards, 'ask-')).toEqual(['true', 'true', 'false']);
  build(4);
  const fixes = render(<GlassBridge kicker="k" message="m" mode="fixes" />).container;
  expect([...fixes.querySelectorAll('[data-fix]')].map((e) => e.getAttribute('data-fix'))).toEqual(['Part 3', 'Parts 4 and 5', 'Part 4', 'Part 6']);
  expect(render(<GlassBridge kicker="k" message="m" mode="pour" />).container.querySelector('[data-glass="pour"]')).not.toBeNull();
  build(1);
  const h = render(<Handover kicker="k" message="m" />).container;
  expect(shown(h, 'watch-')).toEqual(['true', 'false', 'false']);
  // version A: the real code map with the three jobs marked on it, one per click
  expect(h.querySelector('[data-map-preview]')).not.toBeNull();
  expect([...h.querySelectorAll('[data-mark]')].map((m) => m.getAttribute('data-mark'))).toEqual(['1', '1', '2', '3']);
  expect(h.textContent).toContain('Oracle Autonomous AI Database 26ai');
  expect(h.textContent).not.toMatch(/engineering|harness/i);
});

test('where both labs meet: neither alone, then together, then the call, one part per Next (owner, 9 Nov)', () => {
  expect(PAGE_STEPS['3.16']).toBe(3);
  expect(LAB3_CUT.has('3.16a')).toBe(true);
  build(1);
  const c = render(<Neither kicker="k" message="m" />).container;
  expect(shown(c, 'meet-')).toEqual(['true', 'true', 'false']);
  expect(shown(c, 'call')).toEqual(['false']);
  build(3);
  const d = render(<Neither kicker="k" message="m" />).container;
  expect(shown(d, 'meet-')).toEqual(['true', 'true', 'true']);
  expect(shown(d, 'call')).toEqual(['true']);
});
