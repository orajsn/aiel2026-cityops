import { render, screen, fireEvent, within } from '@testing-library/react';
import { JumpMenu } from '../../src/overlay/JumpMenu';
import { useSceneStore } from '../../src/engine/store';
import { useUiStore } from '../../src/engine/ui';
import { SCENES, pageLabel } from '../../src/scenes/index';
import { CHAPTER_NAME, SECTIONS } from '../../src/scenes/sections';
import { MAP_STEPS, stepName } from '../../src/content/lab3Map';
import { useDrawerStore } from '../../src/engine/presentation';

beforeEach(() => {
  useSceneStore.getState().setScenes(SCENES);
  useUiStore.setState({ jumpOpen: true });
});

test('every page appears once, with its page label and current title', () => {
  render(<JumpMenu />);
  for (const s of SCENES) {
    // the overview shows each page's running number inside its part, not its id
    const card = screen.getByRole('button', { name: `${CHAPTER_NAME[s.chapter]} ${pageLabel(s.id)} ${s.title}` });
    expect(within(card).getByText(pageLabel(s.id))).toBeInTheDocument();
    expect(within(card).queryByRole('img')).toBeNull();
    expect(within(card).getByText(s.title)).toBeInTheDocument();
  }
});

test('pages are grouped into chapters and story sections, in story order', () => {
  render(<JumpMenu />);
  expect(screen.getByRole('heading', { name: 'Lab 2 · RAG to Agents' })).toBeInTheDocument();
  // every page belongs to exactly one section, sections follow the page order
  const ids = SECTIONS.flatMap((sec) => sec.pages);
  expect(ids).toEqual(SCENES.map((s) => s.id));
  for (const sec of SECTIONS) expect(screen.getByRole('heading', { name: sec.name })).toBeInTheDocument();
});

test('clicking a preview jumps to that page and closes the overview', () => {
  render(<JumpMenu />);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Lab 3 · Agent Memory ${pageLabel('3.15')} `) }));
  expect(useSceneStore.getState().current().id).toBe('3.15');
  expect(useUiStore.getState().jumpOpen).toBe(false);
});

test('opening and closing the overview does not crash where scrollIntoView returns a Promise (Chromium 140+)', () => {
  const orig = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function () {
    return Promise.resolve() as unknown as void;
  };
  const { unmount } = render(<JumpMenu />);
  expect(() => unmount()).not.toThrow();
  Element.prototype.scrollIntoView = orig;
});

// owner, 4 Nov: in All pages each step of the code map is a page of its own, shown as a sub-page: 19, 19a, 19b ...
test('the code map shows each of its steps as a named sub-page', () => {
  render(<JumpMenu />);
  const n = pageLabel('3.6m');
  const tile = (label: string) => screen.getByRole('button', { name: new RegExp(`^Lab 3 · Agent Memory ${label} `) });
  // the page itself first, then one tile per step, lettered in order
  expect(within(tile(n)).getByText(n)).toBeInTheDocument();
  MAP_STEPS.slice(1).forEach((m, k) => {
    const label = `${n}${String.fromCharCode(97 + k)}`;
    const card = tile(label);
    expect(within(card).getByText(label)).toBeInTheDocument();
    expect(within(card).getByText(stepName(m))).toBeInTheDocument();
  });
  expect(screen.getAllByRole('button', { name: new RegExp(`^Lab 3 · Agent Memory ${pageLabel('3.6m')}[a-z]? `, 'i') }).length).toBe(MAP_STEPS.length);
});

test('clicking a step of the code map opens that step; the open step is the current one', () => {
  render(<JumpMenu />);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Lab 3 · Agent Memory ${pageLabel('3.6m')}i `) }));
  expect(useSceneStore.getState().current().id).toBe('3.6m');
  expect(useDrawerStore.getState()).toMatchObject({ open: true, focus: 9 });
  expect(useUiStore.getState().jumpOpen).toBe(false);
  // reopened, the overview marks that step as the current one
  useUiStore.setState({ jumpOpen: true });
  const { container } = render(<JumpMenu />);
  const current = container.querySelectorAll('.jump__card.current');
  expect(current).toHaveLength(1);
  expect(current[0].textContent).toContain(stepName(MAP_STEPS[9]));
  // the first tile goes back to the whole map
  fireEvent.click(within(container).getByRole('button', { name: new RegExp(`^Lab 3 · Agent Memory ${pageLabel('3.6m')} The code`) }));
  expect(useDrawerStore.getState()).toMatchObject({ open: false, focus: 0 });
});

test('the sub-page names are all different, so each step can be told apart', () => {
  const names = MAP_STEPS.slice(1).map(stepName);
  expect(new Set(names).size).toBe(names.length);
  expect(names).toContain('Day 1b · Day 1, step 2: Mercer records');
  expect(names).toContain('0 · Run the cell.');
});


test('search filters pages and Escape closes the searchable dialog', () => {
  render(<JumpMenu />);
  fireEvent.change(screen.getByRole('searchbox', {name: 'Search presentation pages'}), {target: {value: 'no-such-lesson-xyz'}});
  expect(screen.getByRole('status')).toHaveTextContent('No matching pages');
  fireEvent.change(screen.getByRole('searchbox'), {target: {value: 'memory'}});
  expect(screen.queryByRole('status')).toBeNull();
  fireEvent.keyDown(screen.getByRole('searchbox'), {key: 'Escape'});
  expect(useUiStore.getState().jumpOpen).toBe(false);
});
