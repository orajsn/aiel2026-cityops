import { render, screen } from '@testing-library/react';
import { TitleCard } from '../../src/overlay/concepts/TitleCard';

test('the O of CityOps is the Oracle O, and the word still reads CityOps', () => {
  const { container } = render(<TitleCard />);
  const h = screen.getByRole('heading', { name: 'CityOps' });
  const o = h.querySelector('svg.title__o');
  expect(o).not.toBeNull();
  expect(o?.getAttribute('aria-hidden')).toBe('true');
  expect(h.textContent).toBe('Cityps');
  expect(container.textContent).toContain('Oracle Cloud Engineering Thailand');
});

test('the card is balanced: the two small lines are the same size, the word about five times that', async () => {
  // @ts-expect-error node:fs has no type declarations here (vitest runs in node)
  const css: string = (await import('node:fs')).readFileSync('src/styles.css', 'utf8');
  const size = (cls: string) => Number(css.match(new RegExp(String.raw`\n\.${cls} \{[^}]*font-size: (\d+)px`))?.[1]);
  expect(size('title__kicker')).toBe(size('title__org'));
  const ratio = size('title__word') / size('title__kicker');
  expect(ratio).toBeGreaterThan(4);
  expect(ratio).toBeLessThan(6);
});

test('the word Oracle in both small lines is Oracle Red', async () => {
  const { container } = render(<TitleCard />);
  const marks = [...container.querySelectorAll('.title__oracle')].map((e) => e.textContent);
  expect(marks).toEqual(['Oracle', 'Oracle']);
  // @ts-expect-error node:fs has no type declarations here (vitest runs in node)
  const css: string = (await import('node:fs')).readFileSync('src/styles.css', 'utf8');
  expect(css).toMatch(/\n\.title__oracle \{[^}]*color: var\(--red\)/);
});
