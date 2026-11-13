# Recipes: how each kind of change is made

Every recipe ends the same way: `npx tsc --noEmit`, `npx vitest run`, **look at the page** (`scripts/shot.cjs`), then scripts export, commit, push. Find any page first with `npx vite-node .claude/skills/cityops-live/scripts/where.ts <id>`.

## 1. Change the text or picture on a page
1. `where.ts <id>` → the overlay component file.
2. Edit the JSX/inline styles. Panels are plain React with inline styles on the shared pieces: `WidePanel` (`overlay/concepts/WidePanel.tsx`), `Fill` (scales content down to fit; Lab 1's `parts.tsx` `Fill` also scales up with `max`), `Rich` (`**teal**` / `!!red!!`), icons `LineIcon` (`concepts/icons.tsx`, names in `PATHS`), `EASE`.
3. Text that is data (a scene's `message`, a list in a page's props) lives in the scene definition in `src/scenes/*.ts`: edit it there, not in the component.
4. Render it, read the text sizes, check nothing clips (`fillH` vs `inner` scroll heights in `shot` output are a hint).

## 2. Add a new page (Lab 3 example; Lab 1 and Lab 2 are the same idea in their files)
1. **Component**: `src/overlay/concepts/MyPage.tsx`, exports `function MyPage({ kicker, message, notebook }: MyPageProps)` returning `<WidePanel kicker={kicker} message={message} notebook={notebook} testId="my-page">…</WidePanel>`. Model it on `WhyOracle.tsx` (builds one row per click) or `Disciplines.tsx`.
2. **Register**: `src/overlay/concepts/register.ts`: `import { MyPage } from './MyPage'; registerOverlay('MyPage', MyPage);`.
3. **Scene**: in `src/scenes/chapter2.ts`: `const bMy = atRust('3.15x', 'Title', 'MyPage', { kicker: '…', message: 'One line with **teal** words.' });` (`atRust` = camera at the rust with Vance; `atOps` = the Ops centre; check `shots.ts` for others). Add it to the `LAB3_ALL` array in the position you want. Pick an id that is not in use (`where.ts <id>` says).
4. **Jump menu**: add the id to the right section in `src/scenes/sections.ts` (a test fails if a page is missing or doubled).
5. **Clicks inside the page** (optional): `PAGE_STEPS['3.15x'] = n` in `src/engine/presentation.ts`; the component reads `useBuild()` (exported by `Lab3Opening.tsx`) and shows part `i` when `L >= i`. See `WhyOracle.tsx`.
6. **Scripts**: English in `src/scenes/script.ts` (`'3.15x': '…'`, plain text with `**teal**`, `!!red!!` allowed); Thai in `src/content/scriptTh.ts` (array of paragraphs; for a page with clicks put `"*▶ Next*"` between the blocks, one block per click). Every Lab 3 page needs a Thai entry (a test enforces it).
7. **Tests that count**: `tests/scenes/chapters12.test.ts` (`CH2_BEATS` list and the total), `tests/follow.test.ts` (`SCRIPT_TH` key count), and `tests/overlay/Lab3Opening.test.tsx` if the page is in the opening. Run them; they say what is off.
8. `npx vite-node tools/export-follow-scripts.ts` (phones and manager list the page). A preview picture for the jump menu: `node tools/capture-thumbs.mjs` (needs a browser) or `scripts/shot.cjs <id> <clicks> public/thumbs/<id>.jpg --thumb`.
- Lab 2 page: add it with `page({...})` inside `LAB2_CHAPTERS` in `src/scenes/chapter1.ts`; update `CH1_BEATS` in `tests/scenes/chapters12.test.ts`. The Lab 2 notebook-style pages are data: `src/content/lab2Notebook.ts` (`NB_PAGES`).
- Lab 1 page: add it in `src/scenes/lab1.ts` (`atBridge(...)`, its script in `LAB1_SCRIPT`, its section in `LAB1_SECTIONS`); update `tests/scenes/lab1.test.ts` (ids and overlay keys).

## 3. Hide, show or reorder a page
- Hide: add its id to `LAB3_CUT` (`chapter2.ts`) or `LAB2_CUT` (`chapter1.ts`). Remove it from `sections.ts` and from the beats lists in `tests/scenes/chapters12.test.ts`. Its script disappears from the manager's list (saved versions stay in `follow/data`).
- Show again: reverse it. Reorder: move the entry in the `LAB3_ALL` / chapter array, and in `sections.ts`.
- Take a whole lab out: `WITH_LAB1 = false` in `src/scenes/lab1.ts` (Lab 1 only).

## 4. Make a page build up, one part per Next
```tsx
import { useBuild } from './Lab3Opening';          // s.open ? s.focus : 0
const L = useBuild();                              // 0 on arrival, +1 for each Next
<motion.div initial={false} animate={{ opacity: L >= 2 ? 1 : 0, y: L >= 2 ? 0 : 10 }} transition={{ duration: 0.5, ease: EASE }}>…</motion.div>
```
Keep the layout of hidden parts (opacity, not unmounting) so nothing jumps. Register the count in `PAGE_STEPS`. The first state must not look like the end of the previous page. A page whose picture is in the 3D world (a sky stage) reads the same store inside the world component (`SkyStage4.tsx` `Vector4` holds a frame until the click).

## 5. One script per click (like the Lab 3 code map)
The caption bar, the phone page and the script manager follow clicks through `src/content/scriptSteps.ts`: `STEP_PAGES` (page → number of stops), `STEP_EN` and `STEP_TH` (one string per stop; stop 0 is the page itself). Stop `n` of page `p` is the script page `p.n`. The pieces that read it: `Overlay.tsx` (the caption: `STEP_EN[scene.id]?.[stop]`), `engine/follow.ts` (sends `p.n` to the phones), `tools/export-follow-scripts.ts` (adds the `p.n` pages to `scripts.json`).
**Today only the code map uses it**: the export tool takes the stop titles from `MAP_STEPS` (`stepName`). To give another page per-click scripts, add it to `STEP_PAGES`, give both arrays one entry per stop, and generalise that title lookup in the export tool (it is the only code-map-specific line). A test (`tests/follow.test.ts`) checks the counts match `MAP_STEPS`.
For a page whose clicks are only a few, the simpler way is one script with `*▶ Next*` markers between blocks (Thai) and no per-click pages.

## 6. Change the Lab 3 code map (page 3.6m)
Steps are `MAP_STEPS` in `src/content/lab3Map.ts`. Each: `title`, `rail` (the button label: 1a, 2a, 3b, 4a, 5, 6, Day 1a…), `tag` (the badge: PART 3b), `cam` (the map camera), `ask` (the question), `plain` (one or two lines), `see` (the line "YOU SHOULD SEE"), `nodes` (map nodes lit), `lines` (arrows lit), and `code`:
```ts
code: { cell: 46, from: '# Inspector Vance searches', to: 'max_results=10', keys: ['user_id="Jordan_Vance"'], out: ['Multi-tenancy verified'] }
```
`cell` is the index in `notebooks/lab3_complete.json` `cells` (0-based); `from`/`to` are text that must occur in that cell's lines; `keys` are the lines that light; `out` picks printed result lines. If a string is not in the cell the page **throws** (the test catches it). The window shows the owner's notebook exactly: you only choose what to light.
- **Part name and discipline** after the badge: `PART_KIND` in the same file, keyed by `rail`.
- **Adding or removing a stop**: edit `MAP_STEPS`; keep `STEP_EN`/`STEP_TH` in `scriptSteps.ts` in step (same length, same index); `PAGE_STEPS['3.6m']` = stops − 1 and `STEP_PAGES['3.6m']` = stops (`presentation.ts`, `scriptSteps.ts`); fix the index-based tests in `tests/overlay/CodeMap.test.tsx` (`go(n)`) and `JumpMenu.test.tsx`; renumber the previews `public/thumbs/3.6m_<n>.jpg` (`tools/capture-code-map-thumbs.mjs`); re-export `docs/Lab3-presenter-script.md` section.
- The map drawing itself (nodes, arrows, shapes) is `CodeMap.tsx` + `codeMap.css`; the guide pictures (Part 0, the extraction figure) are `src/assets/lab3/`.
- Every Part claim must match the notebook: see `docs/Lab3-notebook-audit-2026-11-10.md`.

## 7. Move the camera
`src/world/shots.ts`: a shot is `{ position, target, durationMs }`; build one with `northShot(subject, dist, pitchDeg, screenX, ms, headingDeg?, lead?)` (a camera south of the subject looking north; `screenX` slides the subject away from the right-hand panel). Add it to `SHOTS` and use its key as the scene's `shot`. Then run `npx vitest run tests/world`: **frame** (no sky, no map edge in the four corners) and **motion** (each move stays calm) tests check every page and every move. Do **not** edit `cameraOverrides.json` (the owner's saved angles); an angle saved for a page id wins over the page's shot.

## 8. Change a presenter script, English or Thai
See `scripts-and-follow.md`. Short form: the code default lives in `src/scenes/script.ts` / `scriptTh.ts`; **a saved version in the script manager overrides the code default**, so check the manager first.

## 9. Data on a page that comes from a notebook (Lab 2 notebook pages, Jupyter stops, Lab 1 hands-on)
- Lab 2's blue notebook pages: `src/content/lab2Notebook.ts` (`NB_PAGES`: the cell, an excerpt of lines `[cell, line, part, cut?]`, steps, output). The text comes from the Harbor Bridge deck; change a line only to follow the deck.
- The Jupyter drawer on Lab 2 and Lab 3 stop pages: `labStops.ts` (`LAB_STOPS`: which cells to run, the success line), `labGuide.ts` (guide sections).
- Lab 1's Hands-on drawer: `lab1HandsOn.ts` (3A and 3B paths) with the workshop guide's text in `seerGuide.json` (generated by `tools/gen-seer-guide.py` from the guide; text copied verbatim).
- Tests check that every success line really appears in its cell.

## 10. Add a picture or logo
Put the file in `src/assets/<folder>/` and import it (`import logo from '../../assets/oracle/x.png'`): Vite bundles it. Big or many-page images belong in `public/` (served as-is, kept by the service worker). LiveLabs screenshots for the "open the lab" pages: `src/assets/livelabs/` (cover the presenter's email with a black block before committing).

## 11. Traffic, cars, boats
Traffic mode (Settings) draws routes; Save writes `src/content/traffic.json` through the dev server (previous file kept as `traffic.prev.json`, git-ignored). Cars are `world/Cars.tsx` (colours in `CAR_COLOURS`, fade with `CITY_DIM` on Ops pages), boats `Boats.tsx`. These are the owner's saved choices.

## 12. Export the deck (PPTX with speaker notes, PDF, Word scripts)
Done once, reproducible: open every page in **presentation mode** (set `localStorage['cityops.presentation']='on'`), press ArrowRight in a loop, screenshot each state (hide `.counter,.stepper,.progress`, hide the canvas if there is no GPU), then build the files with `python-pptx` (one slide per screen, notes = the page's Thai then English script from `GET api/m/pages`), `img2pdf` and `python-docx`. Pages with clicks inside (`PAGE_STEPS`) become one slide per click.

## 13. Previews for the jump menu
`public/thumbs/<id>.jpg` (384 × 216). `node tools/capture-thumbs.mjs` (a browser with WebGL gives the real city), or `scripts/shot.cjs <id> <clicks> public/thumbs/<id>.jpg --thumb` for a panel-only preview on a GPU-less machine. The code map's stops: `public/thumbs/3.6m_<n>.jpg`.
