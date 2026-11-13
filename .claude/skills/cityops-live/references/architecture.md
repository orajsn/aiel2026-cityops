# Architecture: how CityOps Live is put together

## The one idea

The show is a **list of scenes** (`SceneDef`, `src/engine/types.ts`). A store holds the list and an index. Everything on screen is a function of the current scene:

```
SCENES (src/scenes/index.ts)
   └─ useSceneStore (src/engine/store.ts): index, next(), prev(), jumpTo(id), settled
        ├─ World (src/world/World.tsx)      reads scene.world      → what the 3D city shows
        ├─ CameraRig (src/world/CameraRig)  reads scene.shot       → flies the camera to SHOTS[shot] (or the owner's saved angle)
        ├─ Overlay (src/overlay/Overlay.tsx) reads scene.overlay   → mounts OVERLAYS[key] with scene.overlayProps once the camera has settled
        │                                     scene.script         → the caption bar (CC hides it)
        └─ follow client (src/engine/follow.ts) tells the phone relay the page id (and the click inside the page)
```

`settled` turns true when the camera arrives; panels fade in on it. Moves are eased and slowed by `moveDuration` so they stay calm.

## SceneDef (the fields you will touch)

`id`, `chapter` (0 intro, 1 Lab 2, 2 Lab 3, 3 Lab 1: yes, the numbers are historical), `title`, `shot` (a key of `SHOTS`), `world`, `overlay` (key) and `overlayProps`, `overlayGroup` (consecutive pages with one group keep one mounted panel and only change its props: a diagram that builds click by click), `pageSub` (an extra page shown as `4a`), `pageZero`, `sameAngleAs` (use another page's saved camera angle), `heldView`, `script` (filled in from the script maps by `src/scenes/index.ts`).

Numbers and labels are computed in `src/scenes/index.ts`; `PARTS` and `SECTIONS` in `src/scenes/sections.ts` order the parts and group pages for the jump menu. Every page must be in a section (a test checks the jump menu shows each page once).

## Where each part's pages are defined

| Part | Scenes | Overlays (components) | Data |
|---|---|---|---|
| Introduction | `src/scenes/chapter0.ts` | `overlay/concepts/` (`TitleCard`, `Beat`, `ThreeLabs`, `LabGo`…) | |
| Lab 1 AI Economics | `src/scenes/lab1.ts` (`atBridge`, `atSky` helpers; `LAB1_SCRIPT`, `LAB1_SECTIONS`; `WITH_LAB1`) | `overlay/concepts/lab1/` (`Lab1Intro`, `Lab1Data`, `Lab1Models`, `Lab1Story`, `Lab1Recap`, shared `parts.tsx`) | `content/lab1HandsOn.ts`, `seerGuide.json` (made by `tools/gen-seer-guide.py`), `labStops.ts` |
| Lab 2 RAG to Agents | `src/scenes/chapter1.ts` (`page()` helper, `LAB2_CHAPTERS`, `LAB2_CUT`) | `overlay/concepts/lab2/` (`Lab2Opening`, `Lab2Rag`, `Lab2Agent`, `Lab2Workflow`, `Lab2Trust`, `Lab2Dims`, `NotebookPage` + art files) | `content/lab2Notebook.ts` (the blue notebook pages), `lab2Focus.ts`, `lab2Tools.ts`, `notebooks/lab2_rag_to_agents.json` |
| Lab 3 Agent Memory | `src/scenes/chapter2.ts` (`atRust`, `atOps` helpers; `LAB3_ALL`, `LAB3_CUT`; `chapter2` = the visible ones) | `Lab3Opening.tsx` (hook, why it forgot, logbook, pour, fixes, handover, "neither"), `Glass.tsx`, `CodeMap.tsx` + `codeMap.css`, `Disciplines.tsx`, `WhyOracle.tsx`, `Ending.tsx`, `AllLabs.tsx`, `Recap.tsx`, `BackOnBridge.tsx`, `MemoryMap.tsx` | `content/lab3Map.ts` (code-map steps), `notebooks/lab3_complete.json` and `lab3_student.json` |
| "Open the lab" pages | `src/scenes/labGo.ts` (`GO_LAB1`, `GO_LAB2`, `GO_LAB3`, `GO_LAB3_CODE`) | `overlay/concepts/LabGo.tsx`; pictures in `src/assets/livelabs/` | |

Overlay keys are registered in `src/overlay/concepts/register.ts` (and `lab1/register.ts`, `lab2/register.ts`): `registerOverlay('CodeMap', CodeMap)`. To find the component for a page, read the scene's `overlay` string and grep `registerOverlay('<key>'`.

## Clicks inside a page

Next normally moves to the next page. A page can hold clicks of its own:

- **`PAGE_STEPS`** (`src/engine/presentation.ts`): `{ '3.6m': 20, '3.15d': 4, … }` = how many extra clicks the page has. The step is the drawer store's `focus` while `open` (`useDrawerStore`). An overlay reads it (`useBuild()` in `Lab3Opening.tsx` = `s.open ? s.focus : 0`) and shows more as it grows. **Click 0 is the page on arrival.**
- Notebook pages (Lab 2) and Jupyter stops use the same drawer store via `focusStepCount` (`lab2Notebook.ts` `NB_PAGES`, `lab2Focus.ts`, `labStops.ts`).
- **Presentation mode** (Settings) makes every clicker press walk pages and every drawer step in one line (`presentNext` / `presentPrev`).
- The follow client sends the phones `pageId` or, for a page with one script per click, `pageId.<click>` (e.g. `3.6m.4`).

## The 3D world

`src/world/shots.ts` holds the five places of the story (`city`, `ops`, `bridge`, `pier3`, `pier2`), the sky stages, helper `northShot(...)`, and the calm-motion maths (`interpolateShot`, `moveDuration`, `CALM`). `World.tsx` turns on pieces from the page's `world` (`bridge`, `inspect`, `markers`, `pins`, `sky`, `ops`, `vectors`…). The Bangkok map is `BangkokCity.tsx` (a glTF with a custom edge-fade/haze shader; `CITY_DIM` fades it on Ops pages). Cars and boats follow paths drawn in Traffic mode (`engine/traffic.ts`, `Cars.tsx`, `Boats.tsx`). Text never lives in 3D: labels are HTML (`ReadyHtml`).

The camera rules and their tests: every city camera looks roughly north; no frame shows the sky or the end of the map (`tests/world/frame.test.ts`); every move between pages stays under `CALM` (`tests/world/motion.test.ts`). **Saved angles** (Camera mode → Save) are `src/content/cameraOverrides.json`, keyed by page id; they win over the page's shot. They are the owner's choices.

## The dev server's extras (`vite.config.ts`)

Plugins: `cameraOverrides` and `trafficSaves` (GET/POST `/__camera-overrides`, `/__traffic`, write the JSON files; with `CITYOPS_AUTOCOMMIT=1` each save is committed and pushed), `fullReloadForScene`, `viewersCount` (`/__viewers`), `captureGuard`, `fastModels`. A static build has none of these: the app falls back to the bundled JSON (that is why two requests 404 in a static deployment, by design).

`base` is `CITYOPS_BASE` (default `./` for builds): `src/engine/base.ts` `at(path)` makes every file and endpoint URL, so the same code runs at `/` or `/aiexperiencelive2026/`. **Always build with the real address** (`tools/deploy-static.sh` does).

`public/sw.js` (registered in `src/main.tsx`) keeps the ~50 MB map on the device after the first visit; it needs https or localhost.

## Phone follow and the script manager (one relay)

`follow/server.mjs` is a zero-dependency Node server: sessions in memory (a 6-digit code + a presenter token), Server-Sent Events to phones, and the script store (`follow/data/versions.jsonl` and `comments.jsonl`, append-only, **not in git**). The phone page is `follow/public/index.html` (+ `md.js`, a small markdown renderer); it reads `follow/public/scripts.json`, generated by `tools/export-follow-scripts.ts` from the scenes' English script, `scriptTh.ts` and `scriptSteps.ts`. The manager UI is `src/scripts/ScriptManager.tsx` (open `/?mode=scripts`). Details: `scripts-and-follow.md`.

## Tests (what they protect)

`tests/scenes/*` the page lists (ids, order, counts, Thai coverage), `tests/overlay/*` each panel's structure and builds, `tests/world/*` camera frames, motion, shadows, traffic, `tests/engine/*`, `tests/content/*` data against the notebooks, `tests/follow.test.ts` the relay end to end (it starts a real relay on a free port). Many tests count things on purpose: when you add or remove a page they tell you which list to update.
