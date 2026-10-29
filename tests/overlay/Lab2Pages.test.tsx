import { act, render } from '@testing-library/react';
import { chapter1 } from '../../src/scenes/chapter1';
import { OVERLAYS } from '../../src/overlay/registry';
import { LAB2_FOCUS } from '../../src/content/lab2Focus';
import { useDrawerStore } from '../../src/engine/presentation';

/** Lab 2's own pages (the recap is another panel's) */
const PAGES = chapter1.filter((s) => s.overlay?.startsWith('L2'));
const renderPage = (id: string) => {
  const s = chapter1.find((x) => x.id === id)!;
  const C = OVERLAYS[s.overlay!];
  return render(<C {...s.overlayProps} />).container;
};

/** every element drawn in Oracle Red, by inline style or SVG paint */
const redEls = (c: HTMLElement) =>
  [...c.querySelectorAll('*')].filter((e) => /--red|c74634/i.test(`${e.getAttribute('style') ?? ''} ${e.getAttribute('fill') ?? ''} ${e.getAttribute('stroke') ?? ''} ${e.getAttribute('color') ?? ''}`));
/** the red things a viewer sees as separate: red elements not inside another red element */
const redRoots = (c: HTMLElement) => {
  const reds = redEls(c);
  return reds.filter((r) => !reds.some((o) => o !== r && o.contains(r)));
};

beforeEach(() => useDrawerStore.getState().reset());

test('every Lab 2 page renders its panel, headline, takeaway (chapter ends only) and (when it has them) glossary chip and next band', () => {
  expect(PAGES.length).toBe(58);
  for (const s of PAGES) {
    const c = renderPage(s.id);
    const p = s.overlayProps as { takeaway?: string; terms?: unknown[]; next?: string; step?: number };
    expect(c.querySelector('.beat__panel'), s.id).not.toBeNull();
    // the takeaway is only on the chapter's last page, the one with the Next band (owner, 29 Oct)
    if (p.next && p.takeaway) expect(c.querySelector('[data-takeaway]'), s.id).not.toBeNull();
    else expect(c.querySelector('[data-takeaway]'), s.id).toBeNull();
    expect(!!c.querySelector('[data-terms]'), s.id).toBe(!!p.terms?.length);
    expect(!!c.querySelector('[data-next]'), s.id).toBe(!!p.next);
    if (p.step) expect(c.querySelector('.beat__panel')!.getAttribute('data-step'), s.id).toBe(String(p.step));
  }
});

test('at most one red element on every page; when the picture has one, the kicker steps down to teal', () => {
  for (const s of PAGES) {
    const c = renderPage(s.id);
    const roots = redRoots(c);
    expect(roots.length, `${s.id}: ${roots.map((r) => r.outerHTML.slice(0, 80)).join(' | ')}`).toBeLessThanOrEqual(1);
    const kicker = c.querySelector('.beat__kicker') as HTMLElement;
    if (roots.length) expect(kicker.getAttribute('style') ?? '', s.id).toMatch(/teal/);
    else expect(kicker.getAttribute('style') ?? '', s.id).not.toMatch(/teal/);
  }
});

test('no pier numbers, no model name, no "Ollama", never "copilot", "Kirkland" or a fictional tag on any page', () => {
  for (const s of PAGES) {
    const t = renderPage(s.id).textContent ?? '';
    expect(t, s.id).not.toMatch(/\bpier\s*\d/i);
    expect(t, s.id).not.toMatch(/llama|ollama/i);
    expect(t, s.id).not.toMatch(/copilot|Kirkland|fictional|\bMEA\b|\bMWA\b|\bBMA\b/i);
  }
});

test('the data names are the notebook’s, in mono where the panels show them', () => {
  const t = (id: string) => renderPage(id).textContent ?? '';
  expect(t('2.2c')).toContain('ALL_MINILM_L12_V2');
  expect(t('0.3a')).toContain('Substation Gamma');
  expect(t('0.3a')).toContain('Pipeline North-7');
  expect(t('0.5a')).toContain('Demo asset exists: Harbor Bridge');
});

test('the steps of a panel build in order: each click adds its part of the picture', () => {
  // the story: the crack, then Vance's question and the five kinds of evidence, then the route
  expect(renderPage('0.4').querySelector('[data-portrait="mercer"]')).not.toBeNull();
  expect(renderPage('0.4').querySelector('[data-evidence]')).toBeNull();
  expect(renderPage('0.4a').querySelector('[data-portrait="vance"]')).not.toBeNull();
  expect(renderPage('0.4a').querySelectorAll('[data-kind]')).toHaveLength(5);
  expect(renderPage('0.4b').querySelectorAll('[data-stop]')).toHaveLength(11);
  // RAG: the pipeline stays, the picture under it changes
  for (const id of ['2.2', '2.2a', '2.2b']) expect(renderPage(id).querySelectorAll('[data-pipe]'), id).toHaveLength(5);
  expect(renderPage('2.2a').querySelector('[data-side="top-5"]')).not.toBeNull();
  expect(renderPage('2.2b').querySelectorAll('[data-pillar]')).toHaveLength(3);
  // the chief inspector: the figure first, then its loop of four, then what it does and the signed recommendation
  const chief = ['2.4i', '2.4j', '2.4k'].map(renderPage);
  for (const c of chief) expect(c.querySelector('[data-figure="chief-inspector"]')).not.toBeNull();
  expect(chief[1].querySelectorAll('[data-loop-step]')).toHaveLength(4);
  expect(chief[2].querySelector('[data-signed]')).not.toBeNull();
  // the first run, then its trace and checks
  expect(renderPage('2.7g').querySelectorAll('[data-call]')).toHaveLength(5);
  expect(renderPage('2.7h').querySelectorAll('[data-check]')).toHaveLength(5);
  // the three risks: one card at a time is the current one
  expect(['2.8a', '2.8b', '2.8c'].map((id) => renderPage(id).querySelector('[data-now="true"]')?.getAttribute('data-risk'))).toEqual([
    'Prompt injection and poisoning',
    'Excessive agency',
    'Malicious components',
  ]);
});

test('the cast: Mercer reports the crack, Vance asks; the agent is the chief inspector, never a third named person', () => {
  const c = renderPage('0.4a');
  expect(c.textContent).toContain('Mercer');
  expect(c.textContent).toContain('Vance asks');
  const chief = renderPage('2.4i');
  expect(chief.querySelector('[data-figure="chief-inspector"]')!.getAttribute('aria-label')).toBe('AI Agent');
  expect(chief.textContent).toContain('AI AGENT');
});

test('a notebook page follows the drawer: the step with the focus step’s number lights up, the others wait', () => {
  for (const id of ['2.2c', '0.6', '2.3', '2.7c', '2.7d', '2.7e', '2.7f']) {
    const c = renderPage(id);
    const steps = LAB2_FOCUS[id];
    // closed drawer: the whole picture is on
    expect([...c.querySelectorAll('[data-step]')].every((e) => e.getAttribute('data-on') === 'true'), id).toBe(true);
    steps.forEach((st, k) => {
      act(() => useDrawerStore.setState({ open: true, focus: k + 1 }));
      const on = [...c.querySelectorAll('[data-step]')].filter((e) => e.getAttribute('data-on') === 'true').map((e) => Number(e.getAttribute('data-step')));
      expect(on, `${id} focus ${k + 1}`).toEqual([st.n]);
    });
    act(() => useDrawerStore.getState().reset());
  }
});
