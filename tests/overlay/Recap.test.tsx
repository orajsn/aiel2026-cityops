import { render } from '@testing-library/react';
import { Lab2Recap, Lab3Recap, NEXT_AT, pointAt, type RecapProps } from '../../src/overlay/concepts/Recap';
import { L1Recap } from '../../src/overlay/concepts/lab1/Lab1Recap';
import { AllLabs, type AllLabsProps } from '../../src/overlay/concepts/AllLabs';
import { OVERLAYS } from '../../src/overlay/registry';
import '../../src/overlay/concepts/register';
import { SCENES } from '../../src/scenes/index';
import { lab1 } from '../../src/scenes/lab1';
import { chapter1 } from '../../src/scenes/chapter1';
import { chapter2 } from '../../src/scenes/chapter2';
import { expectNoRed, expectOneRed, redEls } from './lab1Helpers';

const props = <T,>(ch: { id: string; overlayProps?: unknown }[], id: string) => ch.find((s) => s.id === id)!.overlayProps as T;
const RECAPS = [
  { id: '1.10', lab: 1, Comp: L1Recap, scenes: lab1, band: 'crack' },
  { id: '2.9', lab: 2, Comp: Lab2Recap, scenes: chapter1, band: 'rust' },
  { id: '3.17', lab: 3, Comp: Lab3Recap, scenes: chapter2, band: 'labs' },
] as const;

test.each(RECAPS)('$id: "LAB n · WHAT WE BUILT", three points each with a picture, then a NEXT band with its animated graphic', ({ id, lab, Comp, scenes, band }) => {
  const p = props<RecapProps>(scenes, id);
  expect(p.kicker).toBe(`Lab ${lab} · What we built`);
  const c = render(<Comp {...p} />).container;
  expect([...c.querySelectorAll('[data-point]')].map((e) => e.getAttribute('data-point'))).toEqual(['1', '2', '3']);
  for (const n of ['1', '2', '3']) expect(c.querySelector(`[data-point="${n}"] [data-picture="${n}"]`)!.children.length).toBeGreaterThan(0);
  for (const pt of p.points) expect(c.textContent).toContain(pt.title);
  const next = c.querySelector('[data-next]')!;
  expect(next.textContent).toContain('NEXT');
  expect(next.querySelector(`[data-band="${band}"]`)).not.toBeNull();
  // the kicker is teal: the page's one red thing (if any) is elsewhere
  expect((c.querySelector('.beat__kicker') as HTMLElement).style.color).toBe('var(--teal)');
});

test('the points play one after another, the NEXT band last', () => {
  expect(pointAt(0)).toBeLessThan(pointAt(1));
  expect(pointAt(1)).toBeLessThan(pointAt(2));
  expect(pointAt(2)).toBeLessThan(NEXT_AT);
});

test('at most one red element: the crack on 1.10, none on 2.9 (the rust is brown) or 3.17', () => {
  const c1 = render(<L1Recap {...props<RecapProps>(lab1, '1.10')} />).container;
  expectOneRed(c1, '[data-red="crack"]');
  expectNoRed(render(<Lab2Recap {...props<RecapProps>(chapter1, '2.9')} />).container);
  expectNoRed(render(<Lab3Recap {...props<RecapProps>(chapter2, '3.17')} />).container);
});

test('no gold or amber anywhere on the recaps; cost is drawn with teal coins, never a number', () => {
  for (const { id, Comp, scenes } of RECAPS) {
    const c = render(<Comp {...props<RecapProps>(scenes, id)} />).container;
    expect(c.innerHTML, id).not.toMatch(/#(f5c|e8b|d4a|c99a2e|ffc|fc0|f2c)/i);
    expect(c.textContent, id).not.toMatch(/\$\s*\d|\d\s*%/);
  }
});

test('Lab 3 recap: Mercer files the finding, Vance finds it; four stores fold into one Oracle AI Database', () => {
  const c = render(<Lab3Recap {...props<RecapProps>(chapter2, '3.17')} />).container;
  expect(c.querySelector('[data-portrait="mercer"]')).not.toBeNull();
  expect(c.querySelector('[data-portrait="vance"]')).not.toBeNull();
  expect([...c.querySelectorAll('[data-store]')].map((e) => e.getAttribute('data-store'))).toEqual(['Vectors', 'SQL', 'JSON', 'Graph']);
  expect(c.querySelector('[data-one-store]')!.textContent).toContain('one Oracle AI Database');
  expect(c.textContent).not.toMatch(/copilot/i);
});

test('3.18 is the last page: a three-step staircase on one teal foundation, and the quiz is the one red thing', () => {
  const last = SCENES[SCENES.length - 1];
  expect(last.id).toBe('3.18');
  expect(last.chapter).toBe(2);
  expect(last.shot).toBe('bridge');
  expect(OVERLAYS[last.overlay!]).toBe(AllLabs);
  const p = last.overlayProps as unknown as AllLabsProps;
  const c = render(<AllLabs {...p} />).container;
  expect([...c.querySelectorAll('[data-stair]')].map((e) => e.getAttribute('data-stair'))).toEqual(['1', '2', '3']);
  for (const w of ['An assistant', 'An agent', 'An agent that remembers', 'the repair plan', 'the crack', 'the rust']) expect(c.textContent).toContain(w);
  expect(c.querySelectorAll('[data-foundation]')).toHaveLength(1);
  expect(c.querySelector('[data-foundation]')!.textContent).toBe('One Oracle AI Database, ready for AI workloads, under all three');
  expectOneRed(c, '[data-quiz]');
  expect(c.querySelector('[data-quiz]')!.textContent).toContain('80% to pass');
  expect(c.querySelector('[data-portrait="mercer"]')).not.toBeNull();
  expect(c.querySelector('[data-portrait="vance"]')).not.toBeNull();
});

test('the quiz has moved off 3.17 to 3.18', () => {
  const c = render(<Lab3Recap {...props<RecapProps>(chapter2, '3.17')} />).container;
  expect(c.querySelector('[data-quiz]')).toBeNull();
  expect(redEls(c)).toHaveLength(0);
  expect(SCENES.filter((s) => s.overlay === 'AllLabs').map((s) => s.id)).toEqual(['3.18']);
});
