---
name: cityops-live
description: Work on the CityOps Live codebase (a click-through 3D smart-city show with 87 pages for the AI Experience Live 2026 workshops: Lab 1 AI Economics, Lab 2 RAG to Agents, Lab 3 Agent Memory). Use it whenever a task touches this repository: add, change, hide or reorder a page; edit a panel's text or picture; change a presenter script (English or Thai); add a click-by-click build; change the Lab 3 code map; move the camera; work on the phone-follow relay or the script manager; run, test, build or deploy the app. It knows where everything lives and how each kind of change is made and checked.
---

# CityOps Live: how to work on it

CityOps Live is a React + three.js app. A **scene** (page) = a camera **shot** + a 3D **world** state + an **overlay panel** (HTML on top) + a presenter **script**. The presenter clicks Next; the audience reads the script on their phones. There is no AI at runtime: everything is data and code, so every page is checked by tests and by looking at it.

Read this file first. Then open only the reference you need:

| You want to… | Open |
|---|---|
| know where a thing lives, how a page change flows through the code | [references/architecture.md](references/architecture.md) |
| do a specific change (add a page, a build step, change the map, move the camera…) | [references/recipes.md](references/recipes.md) |
| change a script, Thai text, the phone relay or the script manager | [references/scripts-and-follow.md](references/scripts-and-follow.md) |
| check your work (tests, looking at the page, the traps) | [references/verification.md](references/verification.md) |
| know the owner's rules before you change wording, colours or data | [references/rules.md](references/rules.md) |
| run, build, deploy, restart, back up | [references/deploy-and-ops.md](references/deploy-and-ops.md) and `deploy/README.md` |

## The five-minute orientation

```
npm ci && npm run dev            # http://localhost:5174   (Node 20+)
bash tools/verify-setup.sh       # install, types, ~390 tests, build, serve, relay: proves a checkout is healthy
npx vitest run                   # the tests alone (~50 s)
npx tsc --noEmit                 # types alone
```

Find a page: `npx vite-node .claude/skills/cityops-live/scripts/where.ts <id or part of the title>` prints its number, part, shot, overlay component file, script state, clicks, hidden state, where it is defined and the tests that name it.
Test a running site (all pages, phone follow, script manager): `node .claude/skills/cityops-live/scripts/smoke.cjs <app url> [user password]`.
Look at a page: `node .claude/skills/cityops-live/scripts/shot.cjs <id> <clicks> out.png --clean` (needs the dev server and Playwright, see the script's header).

### Pages and their ids

- **87 pages**, four parts in show order: Introduction (ids `0.x`, 7 pages) → **Lab 1** (ids `1.x`, 23) → **Lab 2** (ids `0.4g`, `0.5`… `2.x`, 38; its first pages keep old `0.x` ids) → **Lab 3** (ids `3.x`, 19).
- The number on screen is a running number inside the part (`pageLabel(id)` in `src/scenes/index.ts`), **not** the id. A page with `pageSub` is an extra page shown as `4a`. The id is for the address: `#scene=<id>`.
- Hidden pages are **not deleted**: `LAB2_CUT` (`src/scenes/chapter1.ts`), `LAB3_CUT` (`src/scenes/chapter2.ts`). Removing an id from the set brings the page back. `WITH_LAB1` (`src/scenes/lab1.ts`) takes the whole of Lab 1 out.
- Page ids you will meet: `3.6m` = the Lab 3 code map (21 stops, one script each: `3.6m`, `3.6m.1`… `3.6m.20`); `3.5e` three disciplines; `3.15d` why Oracle AI Database; `1.6b` Lab 1 "ask the app about the PDF"; `0.4g`, `1.0g`, `3.0g`, `3.5g` are "open the lab" pages (`src/scenes/labGo.ts`).

### The map of the code (one line each)

| Where | What |
|---|---|
| `src/scenes/` | the page lists (`chapter0.ts` intro, `lab1.ts`, `chapter1.ts` Lab 2, `chapter2.ts` Lab 3), English scripts (`script.ts`, Lab 1's in `lab1.ts`, open-the-lab in `labGo.ts`), `sections.ts` (the jump menu's groups), `index.ts` (joins them, numbers them) |
| `src/overlay/` | what is drawn over the 3D view: `Overlay.tsx` (mounts the current page's panel, the script bar, drawers), `concepts/` (one file per page family; `register.ts` files map an overlay key to a component), `jupyter/`, `handsOn/`, `JumpMenu.tsx`, `SettingsPanel.tsx`, `CameraEditor.tsx`, `TrafficEditor.tsx` |
| `src/world/` | the 3D city: `shots.ts` (every camera place), `World.tsx` (what a scene's `world` object turns on), the Bangkok model, bridge, cars, boats, sky stages, lights |
| `src/engine/` | stores: scenes (`store.ts`), address (`hash.ts`), keys, **presentation mode and in-page clicks** (`presentation.ts`: `PAGE_STEPS`), phone follow client (`follow.ts`), camera and traffic overrides, graphics, UI |
| `src/content/` | data: real notebooks as JSON (`notebooks/`), Thai scripts (`scriptTh.ts`), per-click scripts (`scriptSteps.ts`), the Lab 3 map (`lab3Map.ts`), Lab 2 notebook pages (`lab2Notebook.ts`, `lab2Focus.ts`), Jupyter stops (`labStops.ts`, `labGuide.ts`), Lab 1 (`lab1HandsOn.ts`, `seerGuide.json`), saved camera angles (`cameraOverrides.json`), traffic (`traffic.json`) |
| `src/scripts/` | the script manager UI (`?mode=scripts`) |
| `follow/` | the phone relay (`server.mjs`), the phone page (`public/index.html`, `md.js`), generated `public/scripts.json`, data in `data/` (not in git) |
| `tests/` | vitest: `scenes/`, `overlay/`, `world/` (camera frames and motion), `engine/`, `content/`, `follow.test.ts` |
| `tools/` | `verify-setup.sh`, `deploy-static.sh`, `export-follow-scripts.ts`, preview capture, VM scripts |
| `deploy/` | nginx and systemd templates and `README.md` |

## The loop for any change

1. **Locate** it (`where.ts`, then `references/architecture.md` if the page is new to you).
2. **Read the owner's rules** for the area (`references/rules.md`): wording, colours, data names, "one page per idea".
3. **Change the smallest thing** that does it. Match the file's style (comment density, naming, inline-style panels).
4. **Update the places that count pages or ids** (a short list, in `references/verification.md`): tests fail loudly when you forget one.
5. **Check**: `npx tsc --noEmit`, `npx vitest run`, and **look at the page** with `shot.cjs` at full size. Read computed text sizes; never judge from a wide shot. State what you saw.
6. **Scripts**: if the page's meaning changed, change its English and Thai script, and the export (`npx vite-node tools/export-follow-scripts.ts`). Mind the script manager's saved versions (see `scripts-and-follow.md`).
7. Commit with a message that says what changed and why; push `main`. Never put a password, token or personal email in the repo.

## Hard rules (the short list; the full one is `references/rules.md`)

- **The Jupyter notebooks are never modified.** Names on screen are exactly what they print (`Harbor Bridge`, `CITY_MEMORY`, `ALL_MINILM_L12_V2`…).
- Say **"the AI agent"**, never "copilot" (except the notebook's own `call_copilot`). Never name the model on screen: "the language model". Inspectors are "Mercer" and "Vance". No pier numbers: "the crack", "the rust".
- Colours: teal for data and the database, **Oracle Red for the one thing to look at, never two red elements**, cool greys for the rest.
- **One idea per page, built one part per Next.** A following page must never start looking like the end of the one before.
- Never overwrite `src/content/cameraOverrides.json` or `traffic.json` (the owner's saved choices) without asking.
- Hide pages (`*_CUT`), never delete them. Do not rewrite history on `main`.
- This machine class may have **no WebGL**: the 3D city cannot be checked there. Say so; never claim 3D was verified.
