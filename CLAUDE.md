# CityOps Live Experience

A deterministic, offline, click-through 3D web experience for two Oracle LiveLabs workshops on 12 Nov 2026 (Lab 2: RAG to Agents, Lab 3: Agent Memory). Bangkok-themed Oracle city in the Hightopo "smart city" style. No AI at runtime.

**New here?** `README.md` (setup, deploy, layout), `AGENTS.md` (the short entry for coding agents) and the skill `.claude/skills/cityops-live/` (a map of the whole system and a recipe per kind of change). `tools/verify-setup.sh` proves a checkout works. This file is the owner's long memory of rules and decisions.

**Read first:** `docs/HANDOFF-2026-10-24.md` (current city = TerraMesh model, what the owner demanded, open items), then `docs/HANDOFF-2026-10-23.md` for the original decisions.

**Verification rule (owner's words):** never judge a scene from a wide shot. Screenshot at full size and zoom into the close-up before calling anything done.

**Camera rules (owner, 24 Oct):** every camera move must mean something. Five places only: `city`, `ops` (City Operations Control Center), `bridge`, `pier3`, `pier2` (`src/world/shots.ts`); the camera moves only when the story changes place, otherwise it holds and the panel changes. Every city camera looks roughly north. Never show the sky or where the map ends: `tests/world/frame.test.ts` checks the four frame corners of every page and of every move between pages. Harbor Bridge is ~500 m from the map's south edge, so bridge shots keep it low in the frame. The sky stage (`sky`) is the one place allowed to show the haze above the city. Moves must stay calm (owner found bridge <-> Ops moves dizzying): `interpolateShot` flies in orbit space with a climb for long trips, the target slides in proportion to camera distance, and `moveDuration` stretches each move until sideways flow, zoom and turn stay under `CALM` in shots.ts; `tests/world/motion.test.ts` checks every page change.

**Camera mode (owner tool):** Settings › Tools › Camera mode, or the C key (Traffic mode is there too; Settings also holds the sky (Afternoon, Clear blue, Night, or Time of day: a clear morning on the first page to a golden evening on the last, `src/world/timeOfDay.ts`) and the 3D resolution: Auto, FHD, 2K, 4K or a custom 16:9 size, 4K for the event screen). Arrows/WASD walk, Q/E down/up, drag to look, wheel forward; iPad: one finger looks, two fingers move. Save writes `src/content/cameraOverrides.json` through the dev server (`/__camera-overrides`, see vite.config.ts); a saved angle wins over the page's place. Those saves are the owner's choices: never overwrite them without asking.

**Spec:** the storyline doc https://claude.ai/artifact/RuZ6iZL6VdBLEwYhkgjeyG (read it with the Artifact or docs tools, never web-fetch). Task-by-task plan: `docs/superpowers/plans/2026-10-23-cityops-live-experience.md`.

## Rules that never change

- The Jupyter notebooks are never modified. Data names on screen are exactly what the notebooks print: `Harbor Bridge`, `Substation Gamma`, `Pipeline North-7`, `CITY_MESSAGE`, `CITY_MEMORY`, `CITY_INSPECTION_FINDING`, `ALL_MINILM_L12_V2`. Rendered in JetBrains Mono. The two inspectors are just "Mercer" and "Vance" on screen and in the script, never their full notebook names (owner, 29 Oct). The agent is "the AI agent" ("AI Agent" as a label), never "copilot"; only the notebook's own names keep it (`call_copilot`, its section titles and printed output). The model is never named on screen (owner, 24 Oct): it is "the language model", drawn as a 3D neural network with a wave of light running through its layers while it produces (`src/world/NeuralNet.tsx`).
- Pages follow the event agenda (owner, 25 Oct): parts are Introduction, Lab 1 · AI Economics, Lab 2 · RAG to Agents, Lab 3 · Agent Memory; ids are 0.x, 1.x, 2.x, 3.x (the `#scene=` address), and the screen shows only a running number inside each part (`pageNumber`, src/scenes/index.ts). Lab 1 (owner, 29 Oct: material for the Lab 1 team, a bridge repair project manager, model routing, guardrails) is part `chapter: 3`, played between the Introduction and Lab 2 (`PARTS` in sections.ts). It lives in src/scenes/lab1.ts, src/overlay/concepts/lab1/ and tests/overlay/Lab1*; `WITH_LAB1 = false` in lab1.ts takes it out and leaves the rest exactly as before (tests/scenes/lab1.test.ts). Its exercises are "Hands-on 1-5", never "Lab 2/3".
- No pier numbers on screen (owner, 25 Oct): the notebooks happen to put Lab 2's crack on Pier 3 and Lab 3's rust on Pier 2, which confused the audience; say "the crack" and "the rust".
- Never write "Kirkland", "MEA", "MWA" or "BMA". No "fictional scenario" tags anywhere (owner, 24 Oct: everyone already knows).
- Offline: no runtime network calls; fonts and models are bundled.
- Navigation: ArrowRight next, ArrowLeft back, J jump menu, N presenter notes, L language (en/th). Every scene reachable by `#scene=<id>`. Settings › Presentation mode (for a clicker): Page Down/Up and the arrows walk every page and every Jupyter cell in one line, F5 goes full screen instead of reloading, B or . blanks the screen (`src/engine/presentation.ts`).
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

## Where it runs (owner, 25-26 Oct)

- **The live copy is on the cloud VM `jatuponghub`** (Oracle Linux 9, aarch64, SELinux enforcing), folder `/home/opc/cityops-live`, served at https://jatuponghub.duckdns.org/aiexperiencelive2026/ behind a login (nginx basic auth in `/etc/nginx/conf.d/codeserver.conf`; code-server keeps `/`). The login password exists only as a hash on the VM: never print, write or commit it. jatuponghub.com does not resolve; the duckdns name is the address.
- **Services on the VM** (systemd, start at boot): `cityops-dev` is the Vite server on 127.0.0.1:8082 with `CITYOPS_BASE=/aiexperiencelive2026/`, `CITYOPS_BEHIND_LOGIN=1`, `CITYOPS_AUTOCOMMIT=1` (restart: `tools/serve-vm.sh`; logs: `journalctl -u cityops-dev`). `cityops-claude` is Claude Code Remote Control, named "CityOps VM", so the owner can work from the phone with the PC off (the owner installed it; approvals come to the phone). Never stop either one without the owner's say-so.
- **Git:** the VM's `origin` is the bare repo `~/git/cityops-live.git`; its post-receive hook pulls into `~/cityops-live`, which updates the running site. The dev server commits the owner's camera and traffic saves on the VM by itself (identity "CityOps owner (VM)"). On the PC the remote is `jatuponghub`: always `bash tools/sync-vm.sh` (pull, then push), never a force-push.
- **If you are a session running on the VM:** you are editing the live site the audience sees, so every saved file shows at once. Commit your own work and `git push origin main`, so the PC gets it on its next sync. Do not run `tools/sync-vm.sh` there (it is for the PC). Page previews (`tools/capture-thumbs.mjs`) need the PC's headless browser.
- **The PC copy** (`C:\Users\UsEr\claude\cityops-live`, port 5174) is the development copy; its Cloudflare quick tunnel is the old way to share and no longer needed.

## Phone follow (owner, 3 Nov)

The audience follows the talk on their phones: Settings › Phone follow › Start sharing asks the relay for a 6-digit code and shows a join card (QR + code); every page change tells the relay the page id; phones (open page `/aiexperiencelive2026/follow/`, no login) show that page's presenter script, English or Thai, live over Server-Sent Events. The relay is `follow/server.mjs` (zero dependencies, sessions in memory, 12 h), service `cityops-follow` on 127.0.0.1:8090 behind nginx; only `follow/api/create` sits behind the login, the presenter updates need the session's own token. The phone page is `follow/public/index.html`; its `scripts.json` is made by `npx vite-node tools/export-follow-scripts.ts` (also run by `tools/serve-vm.sh`) from each scene's `script`, plus the Thai in `src/content/scriptTh.ts` (Lab 3 pages 1 to 18 so far; other pages show English). It is optional: the show itself stays offline, only the sync needs the network. nginx change: `/etc/nginx/conf.d/codeserver.conf` (backup `/etc/nginx/codeserver.conf.bak-before-follow`).

**Script manager (owner, 3 Nov):** colleagues open `/aiexperiencelive2026/?mode=scripts` (Settings › Script manager) with their own login: edit the Thai or English script of any page, see every version (word diff, restore), and comment in threads. Every save is a version and goes live to phones at once (SSE `script` event). Storage: `follow/data/versions.jsonl` and `comments.jsonl` (append-only, untracked, the relay rebuilds its state from them; back them up). Identity is nginx's `$remote_user` as `X-Remote-User` on `follow/api/m/`; every colleague has an entry in `/etc/nginx/cityops.htpasswd` (add or change with `bash tools/follow-user.sh <name>`; the accounts made on 3 Nov use the email name before the @ and the default password the owner gave: ask them to change it, never write it in the repo). A phone session ends after 90 minutes without a page change.

## Lab 2 selected deck (owner, 3 Nov)

Lab 2 is 37 pages, not 59: 22 pages are out of the show (`LAB2_CUT` in `src/scenes/chapter1.ts`: 0.4b, 2.1, 2.2a, 2.2b, 2.4, 2.4a, 2.4e to 2.4j, 2.6, 2.7b to 2.7d, 2.8, and on 4 Nov, after a colleague's comments in the script manager, the whole Trust chapter 2.8a to 2.8e; the chapter then drops out of the jump menu). They are hidden, not deleted: their code, scripts and notebook data stay, `LAB2_ALL` still has them for the tests, and taking an id out of the set brings the page back. The git tag `lab2-59-pages` is the whole 59-page state. Running numbers follow the show order, so they run 1 to 37 by themselves. Next: four pages get new content (original 08, 16, 17, 18; the handoff in the owner's `Lab-2-AI-Handoff.zip`).

## Lab 2 notebook pages (owner, 30 Oct)

The 18 blue pages of the Harbor Bridge deck (0.6, 2.2c, 2.2d, 2.3, 2.3a, 2.4f-h, 2.5c, 2.5d, 2.6b, 2.6c, 2.7, 2.7c-f, 2.8) use overlay `L2Notebook` (`lab2/NotebookPage.tsx`): everyday picture | numbered steps | only the key notebook lines, with an animated line from the step to its lines. Steps and lines are data in `src/content/lab2Notebook.ts` (`NB_PAGES`); pictures in `nbArtA.tsx`/`nbArtB.tsx`. Step 1 shows at once, each Next lights the next step (`focusStepCount` = steps - 1), and the Jupyter drawer does not open on these pages.

## Lab 3 code map (owner, 4 Nov)

Lab 3's coding part is one page, `3.6m` (overlay `CodeMap`, data in `src/content/lab3Map.ts`, drafted on the canvas "Lab 3 Code Map"): the whole map, Part 0 (how to open the notebook, on a JupyterLab screenshot), then the notebook's Parts 1 to 6 and the two days by Next (`PAGE_STEPS`), the order the code runs.  One numbering rule on the page: the notebook's Part numbers (1a, 1b on the buttons when a Part has two clicks); never a TODO number (the notebook window keeps its own text). Part 3 is three clicks: 3a CITY_ASSET (the code that loads the asset registry), 3b the extraction (the notebook's diagram first, then its code), 3c CITY_MEMORY. Attendees open and run this same complete notebook (owner, 4 Nov), so nothing on the page says they write code. Each Next flies the map to the node while a real notebook window glides to that part of the code; its lines stay, key lines light up, the rest fades to 22%. The window is the owner's run notebook exactly as it is, `notebook_complete_ollama.ipynb` (`src/content/notebooks/lab3_complete.json`): its text, line numbers, execution counts and results, nothing changed, so full inspector names and the model name show there (owner, 4 Nov: "follow my original notebook"). The pages it replaces, 3.6 to 3.14a, are hidden, not deleted: `LAB3_CUT` in `src/scenes/chapter2.ts`. After the map come 3.15 onward (Back on the bridge), the Lab 3 recap and the final recap.

**One script per click (owner, 10 Nov):** the code map's 21 stops (after the three-disciplines page 3.5e) each have their own script (`src/content/scriptSteps.ts`: `STEP_EN`, `STEP_TH`); stop n is the script page `3.6m.n` (label 11a, 11b...), the caption bar and the phones follow the click (`src/engine/follow.ts` sends `3.6m.n`), the manager lists every stop. Thai stops 0 to 10 are the colleague's draft, split at its own Part headings (the whole draft is manager version 130 of `3.6m`).

## Lab 3 opening (owner, 6 Nov)

Before the code map, Lab 3 is the compressed opening drafted on the canvas "Lab 3 Opening, Compressed" (payoff first; overlays in `src/overlay/concepts/Lab3Opening.tsx`, scenes `nForgot1`, `nHook1`, `nWhere1/2`, `nPour`, `nFixes`, `nHandover` in chapter2.ts): 3.0 back at the bridge, 3.2f Mercer talks and the chat closes, 3.1h Vance asks (two answers, the reveal), 3.3h the bridge logbook, 3.3i three cards and Vance's three questions, 3.3p the notes drop toward the glass, the glass page 3.3b (3.3a 'The glass' is hidden since 10 Nov), 3.3f each problem solved with a notebook Part (the 3.15b drawings), 3.5h the handover to the notebook. Mercer first, then Vance (owner). **The memory analogy is Lab 2's (owner, repeatedly): the visit notebook is short-term memory, the bridge logbook is long-term memory** (the pictures of lab2/Lab2Agent.tsx); never a desk, cabinet or librarian. **One page per idea, built up one part per Next** (`PAGE_STEPS`, `useBuild` reads the focus): a following page must never start looking like the end of the one before (owner: "I need to click double"). Pages 3.1a-c, 3.2a, 3.2b, 3.2p-r, 3.2c, 3.2e, 3.4a-d, 3.5b are hidden in `LAB3_CUT`, not deleted. Its Thai script is not written yet (the follow test lists them in `NEW_OPENING`).

## Open items (26 Oct)

- Page 0's script line ("Good afternoon. Below us is Bangkok, from above. Let us fly down.") is a draft for the owner to reword.
- The fly-in from page 0 to page 1 was checked by timing only; watch it on the iPad.
- The Lab 3 side session still works on the PC copy: move it to the VM workflow when the owner says so.
