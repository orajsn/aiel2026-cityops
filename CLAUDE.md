# CityOps Live Experience

A deterministic, offline, click-through 3D web experience for two Oracle LiveLabs workshops on 12 Nov 2026 (Lab 2: RAG to Agents, Lab 3: Agent Memory). Bangkok-themed Oracle city in the Hightopo "smart city" style. No AI at runtime.

**Read first:** `docs/HANDOFF-2026-10-24.md` (current city = TerraMesh model, what the owner demanded, open items), then `docs/HANDOFF-2026-10-23.md` for the original decisions.

**Verification rule (owner's words):** never judge a scene from a wide shot. Screenshot at full size and zoom into the close-up before calling anything done.

**Camera rules (owner, 24 Oct):** every camera move must mean something. Five places only: `city`, `ops` (City Operations Control Center), `bridge`, `pier3`, `pier2` (`src/world/shots.ts`); the camera moves only when the story changes place, otherwise it holds and the panel changes. Every city camera looks roughly north. Never show the sky or where the map ends: `tests/world/frame.test.ts` checks the four frame corners of every page and of every move between pages. Harbor Bridge is ~500 m from the map's south edge, so bridge shots keep it low in the frame. The sky stage (`sky`) is the one place allowed to show the haze above the city. Moves must stay calm (owner found bridge <-> Ops moves dizzying): `interpolateShot` flies in orbit space with a climb for long trips, the target slides in proportion to camera distance, and `moveDuration` stretches each move until sideways flow, zoom and turn stay under `CALM` in shots.ts; `tests/world/motion.test.ts` checks every page change.

**Camera mode (owner tool):** Settings › Tools › Camera mode, or the C key (Traffic mode is there too; Settings also holds the sky (Afternoon, Clear blue, Night, or Time of day: a clear morning on the first page to a golden evening on the last, `src/world/timeOfDay.ts`) and the 3D resolution: Auto, FHD, 2K, 4K or a custom 16:9 size, 4K for the event screen). Arrows/WASD walk, Q/E down/up, drag to look, wheel forward; iPad: one finger looks, two fingers move. Save writes `src/content/cameraOverrides.json` through the dev server (`/__camera-overrides`, see vite.config.ts); a saved angle wins over the page's place. Those saves are the owner's choices: never overwrite them without asking.

**Spec:** the storyline doc https://claude.ai/artifact/RuZ6iZL6VdBLEwYhkgjeyG (read it with the Artifact or docs tools, never web-fetch). Task-by-task plan: `docs/superpowers/plans/2026-10-23-cityops-live-experience.md`.

## Rules that never change

- The Jupyter notebooks are never modified. Data names on screen are exactly what the notebooks print: `Harbor Bridge`, `Substation Gamma`, `Pipeline North-7`, `Evelyn_H_Mercer`, `Jordan_Vance`, `CITY_MESSAGE`, `CITY_MEMORY`, `CITY_INSPECTION_FINDING`, `ALL_MINILM_L12_V2`. Rendered in JetBrains Mono. The model is never named on screen (owner, 24 Oct): it is "the language model", drawn as a 3D neural network with a wave of light running through its layers while it produces (`src/world/NeuralNet.tsx`).
- Pages follow the event agenda (owner, 25 Oct): parts are Introduction, Lab 2 · RAG to Agents, Lab 3 · Agent Memory; ids are 0.x, 2.x, 3.x (the `#scene=` address), and the screen shows only a running number inside each part (`pageNumber`, src/scenes/index.ts).
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

## Open items (26 Oct)

- Page 0's script line ("Good afternoon. Below us is Bangkok, from above. Let us fly down.") is a draft for the owner to reword.
- The fly-in from page 0 to page 1 was checked by timing only; watch it on the iPad.
- The Lab 3 side session still works on the PC copy: move it to the VM workflow when the owner says so.
