import { render, screen, fireEvent, within } from '@testing-library/react';
import { JumpMenu } from '../../src/overlay/JumpMenu';
import { useSceneStore } from '../../src/engine/store';
import { useUiStore } from '../../src/engine/ui';
import { SCENES, pageLabel } from '../../src/scenes/index';
import { CHAPTER_NAME, SECTIONS } from '../../src/scenes/sections';

beforeEach(() => {
  useSceneStore.getState().setScenes(SCENES);
  useUiStore.setState({ jumpOpen: true });
});

test('every page appears once, with its preview and its name under it', () => {
  render(<JumpMenu />);
  for (const s of SCENES) {
    // the overview shows each page's running number inside its part, not its id
    const card = screen.getByRole('button', { name: `${CHAPTER_NAME[s.chapter]} ${pageLabel(s.id)} ${s.title}` });
    expect(within(card).getByRole('img').getAttribute('src')).toBe(`./thumbs/${s.id}.jpg`);
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
