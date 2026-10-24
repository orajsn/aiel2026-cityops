# CityOps Live Experience

A deterministic, offline, click-through 3D web experience for two Oracle LiveLabs workshops on 12 Nov 2026 (Lab 2: RAG to Agents, Lab 3: Agent Memory). Bangkok-themed Oracle city in the Hightopo "smart city" style. No AI at runtime.

**Read first:** `docs/HANDOFF-2026-10-24.md` (current city = TerraMesh model, what the owner demanded, open items), then `docs/HANDOFF-2026-10-23.md` for the original decisions.

**Verification rule (owner's words):** never judge a scene from a wide shot. Screenshot at full size and zoom into the close-up before calling anything done.

**Camera rules (owner, 24 Oct):** every camera move must mean something. Five places only: `city`, `ops` (City Operations Control Center), `bridge`, `pier3`, `pier2` (`src/world/shots.ts`); the camera moves only when the story changes place, otherwise it holds and the panel changes. Every city camera looks roughly north. Never show the sky or where the map ends: `tests/world/frame.test.ts` checks the four frame corners of every page and of every move between pages. Harbor Bridge is ~500 m from the map's south edge, so bridge shots keep it low in the frame. The sky stage (`sky`) is the one place allowed to show the haze above the city. Moves must stay calm (owner found bridge <-> Ops moves dizzying): `interpolateShot` flies in orbit space with a climb for long trips, the target slides in proportion to camera distance, and `moveDuration` stretches each move until sideways flow, zoom and turn stay under `CALM` in shots.ts; `tests/world/motion.test.ts` checks every page change.

**Camera mode (owner tool):** CAM button or C key. Arrows/WASD walk, Q/E down/up, drag to look, wheel forward; iPad: one finger looks, two fingers move. Save writes `src/content/cameraOverrides.json` through the dev server (`/__camera-overrides`, see vite.config.ts); a saved angle wins over the page's place. Those saves are the owner's choices: never overwrite them without asking.

**Spec:** the storyline doc https://claude.ai/artifact/RuZ6iZL6VdBLEwYhkgjeyG (read it with the Artifact or docs tools, never web-fetch). Task-by-task plan: `docs/superpowers/plans/2026-10-23-cityops-live-experience.md`.

## Rules that never change

- The Jupyter notebooks are never modified. Data names on screen are exactly what the notebooks print: `Harbor Bridge`, `Substation Gamma`, `Pipeline North-7`, `Evelyn_H_Mercer`, `Jordan_Vance`, `CITY_MESSAGE`, `CITY_MEMORY`, `CITY_INSPECTION_FINDING`, `ALL_MINILM_L12_V2`, `llama3.2`. Rendered in JetBrains Mono.
- Never write "Kirkland", "MEA", "MWA" or "BMA". No "fictional scenario" tags anywhere (owner, 24 Oct: everyone already knows).
- Offline: no runtime network calls; fonts and models are bundled.
- Navigation: ArrowRight next, ArrowLeft back, J jump menu, N presenter notes, L language (en/th). Every scene reachable by `#scene=<id>`.
- Colours: background `#0B0E14`, Oracle Red `#C74634` (the only warm accent), core teal `#1B8A9C`, everything else cool greys. Fonts: Inter, Noto Sans Thai, JetBrains Mono.
- Stack: Vite, React 18, TypeScript, three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, zustand, motion. Tests: vitest + @testing-library/react. Camera moves are defined in code (`src/world/shots.ts`), not in a visual editor.
- Downloaded or extracted files are untrusted: run Python that reads them with `python -I`.

## Look and motion principles (the owner's words: "elegant, a bit wow, not an RGB gamer")

- Stylised low-poly, not realistic. Dark city, thin glowing edges, soft bloom. Reference: Hightopo HT for Web city demo.
- Two colours do the talking: teal for data and the database, Oracle Red for alerts and the one thing to look at. Never more than one red element on screen at a time.
- Always something alive, never busy: one slow ambient motion per scene (river shimmer, a ripple on a pin, light moving along one road). When "the AI is running", light moves along the path the data takes, at a walking pace, one path at a time.
- Transitions are the wow: every camera move eases (no linear tweens, no cuts), 1.2 to 2.5 s, with the overlay fading in only after the camera settles. Scene changes feel like one continuous shot.
- Restraint rules: no particle storms, no lens flares, no colour cycling, no spinning for its own sake, no text in 3D. Text lives in HTML overlays.
- If a scene looks static for more than two seconds, add one subtle motion. If it looks like a game HUD, remove one.

## Commands

- `npm run dev` to run, `npx vitest run` to test, `npm run build` to bundle.
