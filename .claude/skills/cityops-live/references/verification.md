# Verifying a change (what "done" means here)

## The commands
```bash
npx tsc --noEmit                    # types
npx vitest run                      # ~390 tests, ~50 s; one file: npx vitest run tests/overlay/CodeMap.test.tsx
npm run build                       # tsc -b + production build
bash tools/verify-setup.sh          # everything from a clean install, including the relay (SKIP_INSTALL=1 to reuse node_modules)
```
`tests/follow.test.ts` starts a real relay on a free port; it needs no network.

## Look at the page (not optional)
```bash
npm run dev &                                                       # 5174
node .claude/skills/cityops-live/scripts/shot.cjs 3.15d 4 /tmp/p.png --clean    # page id, number of Next presses
```
Then open the picture. Check: nothing clipped or overflowing, text sizes (read computed `font-size`, the panel often renders larger than the numbers in code), spacing and alignment, the first state and the last state of a build, that a following page does not open like the end of the previous one. **A headless browser without WebGL does not draw the 3D city** (the page behind the panel is plain): say "panels checked, 3D not checked". Wait ~5 s after the last click before shooting (animations).

## When you add, remove or move a page, update these (tests tell you which)
| What changed | Update |
|---|---|
| a page in Lab 3 | `LAB3_ALL` order in `chapter2.ts`; `sections.ts`; `CH2_BEATS` in `tests/scenes/chapters12.test.ts`; `tests/overlay/Lab3Opening.test.tsx` id lists if it is in the opening; Thai in `scriptTh.ts` and the key count in `tests/follow.test.ts` (`SCRIPT_TH` length); `PAGE_STEPS` if it has clicks |
| a page in Lab 2 | `chapter1.ts` (`LAB2_CHAPTERS`, `LAB2_CUT`); `CH1_BEATS` (and the 37-page count) in `tests/scenes/chapters12.test.ts` |
| a page in Lab 1 | `lab1.ts` (list, `LAB1_SECTIONS`, `LAB1_SCRIPT`); `tests/scenes/lab1.test.ts` (ids and overlay keys); the Lab 1 hands-on tests if it has a drawer |
| a code-map stop | `MAP_STEPS`, `STEP_EN`/`STEP_TH`, `PAGE_STEPS['3.6m']`, `STEP_PAGES['3.6m']`; `tests/overlay/CodeMap.test.tsx` (`go(n)` indices), `JumpMenu.test.tsx` |
| a script's wording | the export (`npx vite-node tools/export-follow-scripts.ts`), `docs/Lab3-presenter-script.md` if Lab 3 |
| a new overlay | `register.ts` (a test checks every scene's overlay key is registered) |
| a camera shot | `tests/world/frame.test.ts` and `motion.test.ts` run over every page automatically |

## Known traps
- **A replacement that did not apply** (sed or a script `str.replace` matching nothing) leaves the old text and a green build. Assert it happened and render.
- **Saved script versions override code defaults** (see `scripts-and-follow.md`): a Thai fix in `scriptTh.ts` may not show on phones.
- `follow/public/scripts.json` is generated but tracked: regenerate and commit it after script or page changes.
- The dev server watches with polling and the saved-angles file is excluded from the watcher; if the page shows stale code, restart the dev server.
- `public/` is large (~130 MB of models); do not add big assets casually. `dist/`, `node_modules`, `follow/data/` and `assets-original/` are git-ignored.
- The Vite dev server on a host with SELinux or a proxy: the base address must match `CITYOPS_BASE`; a wrong base shows a blank page with 404s for `/assets/…`.
- Python helpers that read downloaded files must run with `python -I`.
- Do not commit the VM's `follow/data`, passwords, tokens, or screenshots showing personal emails.

## Reporting
Say what you changed, what you ran, and what you saw (including what you could not check). Report failing tests with their output; do not hide them.
