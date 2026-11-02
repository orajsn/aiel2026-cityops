import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { BEAT_MS, L1Capture, L1Crack, L1Plan } from '../../src/overlay/concepts/lab1/Lab1Story';
import { expectNoRed } from './lab1Helpers';

beforeEach(() => vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'performance', 'Date'] }));
afterEach(() => vi.useRealTimers());

const props = { kicker: 'Lab 1 · Test', message: 'A headline **here.**' };
const at = (s: number) => act(() => void vi.advanceTimersByTime(s * 1000));
const step = (c: HTMLElement, n: number) => c.querySelector(`[data-step="${n}"]`) as HTMLElement;
const pillOn = (c: HTMLElement) => (c.querySelector('[data-pill]') as HTMLElement).style.opacity === '1';

test('a beat is 2.3 s', () => {
  expect(BEAT_MS).toBe(2300);
});

test.each([
  ['crack', L1Crack, ['Walk the site', 'Notice the crack', 'Record the issue', 'Start the project']],
  ['plan', L1Plan, ['Define the scope', 'Specify materials', 'Schedule delivery', 'Engineer approval']],
  ['capture', L1Capture, ['Specification', 'Supplier records', 'Delivery photo']],
])('%s: steps in order', (_n, C, titles) => {
  const { container } = render(<C {...props} />);
  const got = [...container.querySelectorAll('[data-step]')].map((e) => e.lastElementChild!.children[0].textContent);
  expect(got).toEqual(titles);
});

test.each([[L1Crack], [L1Plan]])('steps tick in turn and the pill arrives at 6.9 s', (C) => {
  const { container } = render(<C {...props} />);
  expect(step(container, 1).dataset.on).toBeDefined();
  expect(step(container, 1).dataset.done).toBeUndefined();
  expect(step(container, 2).dataset.on).toBeUndefined();
  at(2.4);
  expect(step(container, 1).dataset.done).toBeDefined();
  expect(step(container, 2).dataset.on).toBeDefined();
  expect(pillOn(container)).toBe(false);
  at(4.6);
  expect(pillOn(container)).toBe(true);
  expect(step(container, 3).dataset.done).toBeDefined();
  expect(step(container, 4).dataset.on).toBeDefined();
  expect(step(container, 4).dataset.done).toBeUndefined();
});

test('the capture page starts with steps 1 and 2 ticked, ticks the photo, then the pill', () => {
  const { container } = render(<L1Capture {...props} />);
  expect(step(container, 1).dataset.done).toBeDefined();
  expect(step(container, 2).dataset.done).toBeDefined();
  expect(step(container, 3).dataset.done).toBeUndefined();
  at(2.4);
  expect(step(container, 3).dataset.on).toBeDefined();
  at(3.6);
  expect(step(container, 3).dataset.done).toBeDefined();
  expect(pillOn(container)).toBe(false);
  at(1);
  expect(pillOn(container)).toBe(true);
});

test('one panel on the right like Lab 3, no team card, no red, no banned words', () => {
  for (const C of [L1Crack, L1Plan, L1Capture]) {
    const { container, unmount } = render(<C {...props} />);
    expect(container.querySelectorAll('.beat__panel')).toHaveLength(1);
    expect(container.querySelector('[data-team]')).toBeNull();
    expectNoRed(container);
    expect(container.textContent).not.toMatch(/Lab [23]\b|pier \d|Kirkland|\bMEA\b|\bMWA\b|\bBMA\b|fictional|copilot|GPT|Llama|Claude|Gemini|team/i);
    unmount();
  }
});
