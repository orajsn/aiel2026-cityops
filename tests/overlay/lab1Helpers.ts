/** Lab 1 panel test helpers: the pages' one red element, and the attributes they list */
export const attrs = (c: HTMLElement, a: string) => [...c.querySelectorAll(`[${a}]`)].map((e) => e.getAttribute(a));

/** every element drawn in Oracle Red */
export const redEls = (c: HTMLElement) =>
  [...c.querySelectorAll('*')].filter((e) => /--red|c74634/i.test(`${e.getAttribute('style') ?? ''} ${e.getAttribute('fill') ?? ''} ${e.getAttribute('stroke') ?? ''} ${e.getAttribute('color') ?? ''}`));

/** no red at all */
export const expectNoRed = (c: HTMLElement) => expect(redEls(c)).toHaveLength(0);

/** red is used, and only inside the one element the page marks */
export const expectOneRed = (c: HTMLElement, selector: string) => {
  const one = c.querySelectorAll(selector);
  expect(one).toHaveLength(1);
  const reds = redEls(c);
  expect(reds.length).toBeGreaterThan(0);
  for (const r of reds) expect(one[0] === r || one[0].contains(r)).toBe(true);
};

/** cost is drawn, never counted: no digits next to money, no "% saved" */
export const expectNoCostNumbers = (c: HTMLElement) => {
  expect(c.textContent).not.toMatch(/\$\s*\d|\d\s*%|saved|saving of/i);
};
