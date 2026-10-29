import { render } from '@testing-library/react';
import { ThreeLabs } from '../../src/overlay/concepts/ThreeLabs';
import { OVERLAYS } from '../../src/overlay/registry';
import '../../src/overlay/concepts/register';
import { SCENES } from '../../src/scenes/index';

const modes = (c: HTMLElement) => [...c.querySelectorAll('[data-lab]')].map((k) => k.getAttribute('data-mode'));

test('step 0: three equal cards, Lab 1, Lab 2, Lab 3, each with a picture of its problem and one question', () => {
  const c = render(<ThreeLabs step={0} />).container;
  expect(c.querySelector('[data-testid="three-labs"]')!.getAttribute('data-step')).toBe('0');
  expect([...c.querySelectorAll('[data-lab]')].map((k) => k.getAttribute('data-lab'))).toEqual(['1', '2', '3']);
  expect(modes(c)).toEqual(['mini', 'mini', 'mini']);
  for (const w of ['Lab 1 · AI Economics', 'The repair plan', 'Lab 2 · RAG to Agents', 'The crack', 'Lab 3 · Agent Memory', 'The rust']) expect(c.textContent).toContain(w);
  expect(c.querySelectorAll('[data-question]')).toHaveLength(3);
  for (const p of ['sources', 'crack', 'rust']) expect(c.querySelector(`[data-picture="${p}"]`)).not.toBeNull();
  // nothing opened yet
  expect(c.querySelector('[data-part]')).toBeNull();
});

test.each([1, 2, 3] as const)('click %i opens that lab: the problem on the left, three steps of what you build on the right', (n) => {
  const c = render(<ThreeLabs step={n} />).container;
  expect(c.querySelector('[data-testid="three-labs"]')!.getAttribute('data-step')).toBe(String(n));
  expect(modes(c)).toEqual([1, 2, 3].map((k) => (k === n ? 'open' : 'closed')));
  const open = c.querySelector(`[data-lab="${n}"]`)!;
  expect(open.querySelector('[data-part="problem"]')).not.toBeNull();
  expect(open.querySelector('[data-part="build"]')).not.toBeNull();
  expect([...open.querySelectorAll('[data-build-step]')].map((s) => s.getAttribute('data-build-step'))).toEqual(['1', '2', '3']);
  // only the open card shows its story
  expect(c.querySelectorAll('[data-part="problem"]')).toHaveLength(1);
  expect([...c.querySelectorAll('[data-dot]')].map((d) => d.getAttribute('data-on'))).toEqual([1, 2, 3].map((k) => String(k === n)));
});

test('a shrunk card leaves no gap (V5): its problem picture, its question and three numbered chips of what you build', () => {
  const c = render(<ThreeLabs step={2} />).container;
  const pictures = { 1: 'sources', 3: 'rust' } as const;
  for (const n of [1, 3] as const) {
    const card = c.querySelector(`[data-lab="${n}"]`)!;
    expect(card.querySelector(`[data-picture="${pictures[n]}"]`)).not.toBeNull();
    expect(card.querySelector('[data-question]')).not.toBeNull();
    expect(card.textContent).toContain('YOU BUILD');
    expect([...card.querySelectorAll('[data-chip]')].map((x) => x.getAttribute('data-chip'))).toEqual(['1', '2', '3']);
  }
  expect(c.querySelector('[data-lab="1"]')!.textContent).toContain('Guardrails that fail closed');
});

test('each open card tells its own story, with the inspectors only as Mercer and Vance', () => {
  expect(render(<ThreeLabs step={1} />).container.textContent).toMatch(/One assistant over all of it.*The right model for each question.*Guardrails that fail closed/);
  expect(render(<ThreeLabs step={2} />).container.textContent).toMatch(/Decides what to look up.*four shapes of data.*with the evidence/);
  const c3 = render(<ThreeLabs step={3} />).container;
  expect(c3.querySelector('[data-portrait="mercer"]')).not.toBeNull();
  expect(c3.querySelector('[data-portrait="vance"]')).not.toBeNull();
  expect(c3.textContent).toContain('MEMORY · ORACLE AI DATABASE');
});

test('the crack is the one red thing, in every step; no pier numbers, no copilot', () => {
  for (const step of [0, 1, 2, 3] as const) {
    const c = render(<ThreeLabs step={step} />).container;
    const red = [...c.querySelectorAll('[stroke], [fill], [style]')].filter((e) => /--red|#c74634/i.test(`${e.getAttribute('stroke')} ${e.getAttribute('fill')} ${e.getAttribute('style')}`));
    expect(red.length, `step ${step}`).toBeGreaterThan(0);
    for (const e of red) expect(e.getAttribute('data-red')).toBe('crack');
    expect(c.textContent).not.toMatch(/Pier \d|copilot/i);
  }
});

test('0.7 to 0.7c play the four steps at the bridge, registered, with the script lines of the board', () => {
  expect(OVERLAYS.ThreeLabs).toBeDefined();
  const pages = SCENES.filter((s) => s.overlay === 'ThreeLabs');
  expect(pages.map((s) => s.id)).toEqual(['0.7', '0.7a', '0.7b', '0.7c']);
  expect(pages.map((s) => s.script)).toEqual([
    expect.stringContaining('Three times'),
    expect.stringContaining('Lab 1'),
    expect.stringContaining('Lab 2'),
    expect.stringContaining('Lab 3'),
  ]);
});
