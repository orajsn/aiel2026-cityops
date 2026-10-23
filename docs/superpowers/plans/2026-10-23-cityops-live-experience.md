# CityOps Live Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A deterministic, offline, click-through 3D web experience (Bangkok-themed Oracle city) that carries the story for Lab 2 (RAG to Agents) and Lab 3 (Agent Memory) on 12 Nov 2026, with hand-off cards that point attendees at notebook cells and recap panels that show the recorded outputs.

**Architecture:** A Vite + React + TypeScript app. A scene engine (zustand store, scene registry, keyboard navigation) drives a React Three Fiber world (city GLB, pins, Oracle core, vector field, flow arcs, code-defined camera shots) and a 2D overlay layer (hand-off cards, recap panels rendered from recorded-output JSON, animated concept panels in SVG). No network calls and no AI at runtime; every output shown comes from `src/content/recorded/*.json`.

**Tech Stack:** Vite 5, React 18, TypeScript 5, three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, zustand, motion (framer-motion), vitest + @testing-library/react + jsdom, Python 3 + osm2threejs for the city model, vite-plugin-singlefile optional.

**Spec:** The storyline doc "CityOps Live Experience: Storyline and Research" (https://claude.ai/artifact/RuZ6iZL6VdBLEwYhkgjeyG). Scene numbers below (0.1 to 0.7, 1.1 to 1.9, 2.0 to 2.17) are the spec's scene numbers. Source notebooks: `rag_to_agents_lab.ipynb`, `notebook_student_ollama.ipynb`, `notebook_complete_ollama.ipynb` in `C:\Users\UsEr\Downloads\Oracle-LiveLabs-Complete-Record.zip`.

## Global Constraints

- Runs offline from a local folder on a Windows laptop with an integrated GPU, 1920x1080, 60 fps target with a "low" quality tier that disables post-processing.
- No runtime network calls. Fonts (Inter, Noto Sans Thai, JetBrains Mono) and the city GLB are bundled.
- Navigation is forward/back only: ArrowRight = next, ArrowLeft = back, J = jump menu, N = presenter notes, L = language toggle (en/th). Every scene is reachable by `#scene=<id>` in the URL.
- Data names on screen are exactly the notebook's: `Harbor Bridge`, `Substation Gamma`, `Pipeline North-7`, `City Operations Control Center`, `Emergency Operations Center`, `Evelyn_H_Mercer`, `Jordan_Vance`, `CITY_MESSAGE`, `CITY_MEMORY`, `CITY_INSPECTION_FINDING`, `store_incident`, `ALL_MINILM_L12_V2`, `llama3.2`. Rendered in JetBrains Mono.
- The word "Kirkland" and the names MEA, MWA, BMA never appear. Every incident overlay shows the tag "fictional scenario".
- Brand: Oracle Red `#C74634` is the only warm accent; the Oracle core is teal `#1B8A9C`; background `#0B0E14`. Fonts: Inter (body), Noto Sans Thai (Thai narration), JetBrains Mono (data names). Oracle Sans only if the team supplies licensed files.
- Embedding dimension shown everywhere is 384. LLM shown as `llama3.2`, 3B, CPU, 30-60 s per step.
- Lab 2 hand-off cards reference notebook sections by heading number (0.4-0.10, 1.2-1.5, 1.7-1.9, 2.3-2.7, 3.2, 3.3, 4.3-4.5, 5.3-5.7, 5.8, 6.1). Lab 3 cards reference Part 1-6 and TODO 1-6.

## Review Focus

- Pressing ArrowRight repeatedly at the last scene, or ArrowLeft at the first, must stay on the edge scene without error or flicker (Task 2 tests `next` and `prev` clamping).
- Opening `#scene=unknown` or an empty hash must land on scene `0.1`, not a blank canvas (Task 2 test `hashToIndex`).
- The city GLB missing or failing to load must fall back to the procedural city, never a black screen (Task 4 test `City` renders `ProceduralCity` when `useGLTF` throws).
- A recorded output key that has no entry in the JSON must render a visible "output not recorded" panel, never crash the overlay (Task 12 test `RecapPanel` with unknown key).
- Thai narration missing for a scene must fall back to English without an empty panel (Task 17 test `narrationFor(id, 'th')` falls back).

## File Structure

```
cityops-live/
  package.json, vite.config.ts, tsconfig.json, index.html
  public/models/bangkok.glb              # from tools/build_city.py (Task 5)
  public/fonts/*.woff2                   # Inter, Noto Sans Thai, JetBrains Mono
  src/main.tsx, src/App.tsx              # Canvas + Overlay host
  src/engine/types.ts                    # SceneDef, HandoffCard, RecapRef, ShotId, OverlayKey
  src/engine/store.ts                    # useSceneStore: index, next, prev, jumpTo
  src/engine/hash.ts                     # hashToIndex, indexToHash, bindHash
  src/engine/keys.ts                     # bindKeys
  src/content/assets.json                # 28 assets with Bangkok lat/lon, specs
  src/content/connections.json           # graph edges
  src/content/geo.ts                     # project(lat, lon) -> {x, z}
  src/content/narration.ts               # NARRATION[sceneId] = {en, th?}
  src/content/recorded/lab2.json, lab3.json, schema.ts
  src/world/City.tsx, ProceduralCity.tsx, Lighting.tsx, Effects.tsx
  src/world/AssetPins.tsx, PinCard.tsx
  src/world/shots.ts, CameraRig.tsx      # code-defined camera shots
  src/world/FlowArc.tsx, arc.ts
  src/world/OracleCore.tsx, GraphLines.tsx
  src/world/VectorField.tsx, vectorLayout.ts
  src/world/World.tsx                    # composes the world from the current scene
  src/overlay/Overlay.tsx, HandoffCard.tsx, RecapPanel.tsx, JumpMenu.tsx, PresenterNotes.tsx
  src/overlay/concepts/*.tsx             # one animated SVG panel per concept scene
  src/scenes/chapter0.ts, chapter1.ts, chapter2.ts, index.ts
  tools/build_city.py                    # osm2threejs bbox -> GLB
  tools/capture_outputs.py               # executed .ipynb -> recorded JSON
  tests/**                               # vitest
```

---

### Task 1: Scaffold

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `vitest.config.ts`, `tests/smoke.test.tsx`, `.gitignore`, `README.md`

**Interfaces:**
- Produces: `App` renders a full-screen `<Canvas>` with background `#0B0E14` and an empty `<Overlay />` div with id `overlay`.

- [ ] **Step 1: Create the project** in `C:\Users\UsEr\claude\cityops-live` with `npm create vite@latest . -- --template react-ts`, then install `three @react-three/fiber @react-three/drei @react-three/postprocessing zustand motion` and dev deps `vitest jsdom @testing-library/react @testing-library/jest-dom @types/three`.
- [ ] **Step 2: Write the failing test** `tests/smoke.test.tsx`: render `<App />`, assert an element with id `overlay` exists.
- [ ] **Step 3: Run** `npx vitest run tests/smoke.test.tsx` and confirm FAIL (App not found).
- [ ] **Step 4: Implement** `App.tsx` with `<Canvas>` (mock `@react-three/fiber` Canvas in tests via `vi.mock`) and `<div id="overlay" />`; `styles.css` sets `html, body, #root { margin:0; height:100% }` and the font-face rules for the three bundled fonts (fonts added in Task 11).
- [ ] **Step 5: Run** the test and confirm PASS; run `npm run dev` and confirm a dark full-screen canvas in the browser.
- [ ] **Step 6: Commit** `git init && git add -A && git commit -m "chore: scaffold cityops-live"`.

### Task 2: Scene engine

**Files:**
- Create: `src/engine/types.ts`, `src/engine/store.ts`, `src/engine/hash.ts`, `src/engine/keys.ts`
- Test: `tests/engine/store.test.ts`, `tests/engine/hash.test.ts`

**Interfaces:**
- Produces:
  - `type ShotId = string; type OverlayKey = string;`
  - `interface HandoffCard { run: string; expect: string; minutes: string }`
  - `interface RecapRef { lab: 'lab2' | 'lab3'; key: string; note: string }`
  - `interface SceneDef { id: string; chapter: 0 | 1 | 2; title: string; shot: ShotId; world?: Record<string, unknown>; overlay?: OverlayKey; overlayProps?: Record<string, unknown>; card?: HandoffCard; recap?: RecapRef }`
  - `useSceneStore: { scenes: SceneDef[]; index: number; setScenes(s: SceneDef[]): void; next(): void; prev(): void; jumpTo(id: string): void; current(): SceneDef }`
  - `hashToIndex(hash: string, scenes: SceneDef[]): number` (0 when unknown or empty); `indexToHash(i: number, scenes: SceneDef[]): string` (`#scene=<id>`); `bindHash(store): () => void`
  - `bindKeys(store, handlers: { jump(): void; notes(): void; lang(): void }): () => void`

- [ ] **Step 1: Write failing tests** `store.test.ts`: with three fake scenes, `next()` twice then `next()` again leaves `index === 2`; `prev()` at 0 leaves 0; `jumpTo('nope')` leaves index unchanged; `jumpTo('b')` sets 1. `hash.test.ts`: `hashToIndex('#scene=b', s) === 1`, `hashToIndex('', s) === 0`, `hashToIndex('#scene=zzz', s) === 0`, `indexToHash(1, s) === '#scene=b'`.
- [ ] **Step 2: Run** `npx vitest run tests/engine` and confirm FAIL.
- [ ] **Step 3: Implement** `store.ts` with zustand `create`, `hash.ts`, `keys.ts` (keydown listener mapping ArrowRight/ArrowLeft/J/N/L; returns an unbind function).
- [ ] **Step 4: Run** the tests and confirm PASS.
- [ ] **Step 5: Commit** `git commit -am "feat: scene engine with hash and keyboard navigation"`.

### Task 3: City content and projection

**Files:**
- Create: `src/content/assets.json`, `src/content/connections.json`, `src/content/geo.ts`
- Test: `tests/content/geo.test.ts`, `tests/content/assets.test.ts`

**Interfaces:**
- Produces:
  - `assets.json`: array of `{ id: string; type: 'bridge'|'substation'|'pipeline'|'water'|'energy'|'sensor'|'comms'|'civil'|'ops'; district: string; criticality: 1|2|3|4|5; lat: number; lon: number; specs: Record<string, number|string> }`, 28 entries. Required ids: `Harbor Bridge` (bridge, criticality 5, lat 13.665, lon 100.573, specs `span_length_m: 485, load_capacity_t`), `Substation Gamma`, `Pipeline North-7`, `City Operations Control Center`, `Emergency Operations Center`, `Northern Reservoir`, `Air Quality Monitor NI-01`, `Harbor Bridge Sensor Array A`, `Harbor Bridge Sensor Array B`. Districts: `Harbor District` plus six Bangkok district names.
  - `connections.json`: array of `{ from: string; to: string; type: 'powers'|'monitors'|'coordinates'|'feeds'|'supports' }`; must include Substation Gamma powers Harbor Bridge, both sensor arrays monitor Harbor Bridge, City Operations Control Center coordinates Harbor Bridge.
  - `project(lat: number, lon: number): { x: number; z: number }` Mercator-like linear projection centred on (13.700, 100.550), 1 degree lon = 1000 units, z positive southward.

- [ ] **Step 1: Write failing tests**: `project(13.700, 100.550)` is `{x: 0, z: 0}` within 1e-6; `project(13.700, 100.650).x` is 100 within 0.01; assets.json has 28 entries, unique ids, every `connections.json` endpoint exists in assets, `Harbor Bridge` has criticality 5.
- [ ] **Step 2: Run** `npx vitest run tests/content` and confirm FAIL.
- [ ] **Step 3: Write** the two JSON files (28 assets placed on real Bangkok coordinates: port and river for Harbor District, Sathorn for Substation Gamma, Bang Khen for Northern Reservoir and the pipeline's north end, Din Daeng for the control center) and `geo.ts`.
- [ ] **Step 4: Run** the tests and confirm PASS.
- [ ] **Step 5: Commit** `git commit -am "feat: city asset content and projection"`.

### Task 4: World base: city, lighting, effects

**Files:**
- Create: `src/world/City.tsx`, `src/world/ProceduralCity.tsx`, `src/world/Lighting.tsx`, `src/world/Effects.tsx`, `src/world/World.tsx`, `src/engine/quality.ts`
- Modify: `src/App.tsx`
- Test: `tests/world/City.test.tsx`

**Interfaces:**
- Consumes: `project` from Task 3.
- Produces:
  - `<City />` loads `/models/bangkok.glb` with drei `useGLTF`; on error renders `<ProceduralCity />`.
  - `<ProceduralCity />`: a deterministic grid of 400 box buildings (seeded, heights 2-30) and a river plane along z, sized to the projected bbox of assets.json.
  - `<Lighting />`: ambient 0.15, one key directional light, hemisphere with ground `#0B0E14`.
  - `<Effects />`: Bloom (intensity 0.8, luminanceThreshold 0.6) only when `quality() === 'high'`.
  - `quality(): 'high' | 'low'` reads `localStorage.cityops.quality`, default `high`.
  - `<World />` renders Lighting, City, Effects and (later tasks) pins, core, arcs, vector field based on `useSceneStore().current().world`.

- [ ] **Step 1: Write failing test** `City.test.tsx`: mock `@react-three/drei` `useGLTF` to throw; render `<City />` inside `@react-three/test-renderer`; assert a mesh named `procedural-city` exists.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** the five components and `quality.ts`; wire `<World />` into `App`.
- [ ] **Step 4: Run** the test and confirm PASS; `npm run dev` shows the procedural night city with bloom.
- [ ] **Step 5: Commit** `git commit -am "feat: world base with procedural city fallback"`.

### Task 5: Bangkok city model pipeline

**Files:**
- Create: `tools/build_city.py`, `tools/README.md`, `public/models/bangkok.glb`

**Interfaces:**
- Produces: `bangkok.glb`, a stylised low-poly model of the box lon 100.49-100.62, lat 13.62-13.78 (Khlong Toei port and Bhumibol Bridge in the south, Phra Nakhon in the north, Sathorn and Siam inland), dark theme, under 25 MB, with the river as a separate mesh named `water`.

- [ ] **Step 1: Write** `tools/build_city.py`: `pip install osm2threejs`; call `from_bbox((100.49, 13.62, 100.62, 13.78), theme="Dark Glow", name="Bangkok CityOps")` then `to_glb("public/models/bangkok.glb")`. Run with `python -I tools/build_city.py` from the project root.
- [ ] **Step 2: Verify** the file exists and is under 25 MB; open `npm run dev`, confirm `<City />` now renders the GLB (no `procedural-city` mesh in the scene) and the river mesh is named `water` (check via the three.js devtools or `scene.getObjectByName('water')` in the console).
- [ ] **Step 3: Align** `geo.ts` scale and centre so the `Harbor Bridge` pin lands on the river by the port; adjust the constants in `geo.ts` and update the `project` test values accordingly.
- [ ] **Step 4: Commit** `git add tools public/models && git commit -m "feat: Bangkok city model from OpenStreetMap"`.

### Task 6: Asset pins and cards

**Files:**
- Create: `src/world/AssetPins.tsx`, `src/world/PinCard.tsx`, `src/world/pinColors.ts`
- Modify: `src/world/World.tsx`
- Test: `tests/world/pinColors.test.ts`, `tests/world/PinCard.test.tsx`

**Interfaces:**
- Consumes: `assets.json`, `project`.
- Produces:
  - `pinColor(type: AssetType): string` (bridge `#C74634`, substation `#F5B700`, pipeline `#4FB3FF`, water `#2EC4B6`, energy `#FF8C42`, sensor `#B8F2E6`, comms `#C77DFF`, civil `#9AA5B1`, ops `#FFFFFF`).
  - `<AssetPins visible={AssetType[] | 'all'} highlight={string[]} onHover={(id)=>void} />`: one drei `Billboard` + mesh per asset; pins of a type pop in with a 60 ms stagger when `visible` changes.
  - `<PinCard asset={Asset} />`: drei `Html` card with name (JetBrains Mono), type, district, criticality dots, and the `specs` key-value list.
  - World props read from `SceneDef.world`: `{ pins?: AssetType[] | 'all'; highlight?: string[] }`.

- [ ] **Step 1: Write failing tests**: `pinColor('bridge') === '#C74634'`; `PinCard` for Harbor Bridge renders the text `Harbor Bridge`, `span_length_m` and five criticality dots (`[data-dot].filled` count 5).
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** the three files; add pins to `World`.
- [ ] **Step 4: Run** the tests and confirm PASS; in the browser, hover a pin and see its card.
- [ ] **Step 5: Commit** `git commit -am "feat: asset pins and spec cards"`.

### Task 7: Camera shots

**Files:**
- Create: `src/world/shots.ts`, `src/world/CameraRig.tsx`
- Modify: `src/world/World.tsx`
- Test: `tests/world/shots.test.ts`

**Interfaces:**
- Produces:
  - `interface Shot { position: [number, number, number]; target: [number, number, number]; durationMs: number; ease?: 'inOut' | 'out' }`
  - `SHOTS: Record<ShotId, Shot>` with at least: `gulf-approach`, `city-high`, `ops-center`, `bridge-pier3`, `bridge-pier2`, `core-dive`, `core-face-tables`, `core-face-json`, `core-face-graph`, `core-face-vectors`, `vector-field`, `memory-room`, `toolbelt-wall`.
  - `interpolateShot(a: Shot, b: Shot, t: number): { position: Vec3; target: Vec3 }` with t clamped to [0,1] and the named easing applied.
  - `<CameraRig />` reads `current().shot`, tweens from the live camera pose to the shot over `durationMs` using `useFrame`; ArrowLeft tweens back the same way.

- [ ] **Step 1: Write failing tests**: `interpolateShot(a, b, 0)` equals a's pose; `t = 1` equals b's; `t = 2` equals b's (clamped); `ease: 'inOut'` at `t = 0.5` is the midpoint within 1e-6.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** `shots.ts` (positions chosen against the GLB from Task 5) and `CameraRig.tsx`.
- [ ] **Step 4: Run** the tests and confirm PASS; in the browser, change `#scene=` between two scenes and watch the camera fly.
- [ ] **Step 5: Commit** `git commit -am "feat: code-defined camera shots"`.

### Task 8: Flow arcs and the data stream

**Files:**
- Create: `src/world/arc.ts`, `src/world/FlowArc.tsx`, `src/world/DataStream.tsx`
- Modify: `src/world/World.tsx`
- Test: `tests/world/arc.test.ts`

**Interfaces:**
- Consumes: `project`, `assets.json`.
- Produces:
  - `arcCurve(from: Vec3, to: Vec3, lift: number): THREE.CubicBezierCurve3` with control points lifted by `lift` above the midpoint.
  - `<FlowArc from to progress color />`: TubeGeometry (64 segments, radius 0.6) revealed with `setDrawRange` as `progress` goes 0 to 1, then a landing dot and a ring that scales 1 to 3 and fades.
  - `<DataStream running count={{ logs: 308, reports: 60, findings: 220 }} />`: spawns arcs from random pins to `City Operations Control Center` every 120 ms while `running`, and exposes the three counters to the overlay through the store field `counters`.
  - World props: `{ dataStream?: boolean }`.

- [ ] **Step 1: Write failing tests**: `arcCurve` point at t=0.5 has y greater than both endpoints by at least `lift * 0.5`; endpoints match.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** the three files.
- [ ] **Step 4: Run** the test and confirm PASS; in the browser, documents fly into the Ops Center and counters climb.
- [ ] **Step 5: Commit** `git commit -am "feat: flow arcs and data stream"`.

### Task 9: Oracle core with four faces

**Files:**
- Create: `src/world/OracleCore.tsx`, `src/world/GraphLines.tsx`
- Modify: `src/world/World.tsx`
- Test: `tests/world/GraphLines.test.ts`

**Interfaces:**
- Consumes: `connections.json`, `project`.
- Produces:
  - `<OracleCore face={'none'|'tables'|'json'|'graph'|'vectors'} />`: an icosahedron (radius 40, teal emissive) under the city at y = -80, four face markers; the active face glows and emits its reveal: `tables` (rows of thin bars rise), `json` (five spec cards fan out), `graph` (delegates to GraphLines on the map above), `vectors` (delegates to VectorField, Task 10).
  - `edgesFor(assetId?: string): Edge[]` returns all edges or those touching one asset.
  - `<GraphLines edges highlight />`: lines between projected pin positions, colour by edge type, with `highlight` edges brighter.
  - World props: `{ core?: Face; graph?: boolean | string }`.

- [ ] **Step 1: Write failing test**: `edgesFor('Harbor Bridge')` returns at least 4 edges and every edge touches `Harbor Bridge`; `edgesFor()` returns all.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** the two files and wire into `World`.
- [ ] **Step 4: Run** the test and confirm PASS; in the browser, step through the four faces.
- [ ] **Step 5: Commit** `git commit -am "feat: Oracle core with four faces and graph lines"`.

### Task 10: Vector field

**Files:**
- Create: `src/world/vectorLayout.ts`, `src/world/VectorField.tsx`
- Modify: `src/world/World.tsx`
- Test: `tests/world/vectorLayout.test.ts`

**Interfaces:**
- Produces:
  - `layoutCloud(n: number, seed: number): Vec3[]` deterministic positions in a sphere of radius 30 with three visible clusters.
  - `nearestK(points: Vec3[], query: Vec3, k: number): number[]` indices sorted by distance.
  - `applyWalls(points: Vec3[], tags: Record<string,string>[], filter: Record<string,string>): boolean[]` true where every filter key matches the tag.
  - `<VectorField n={600} seed={7} phase={'documents'|'embedded'} query?: Vec3 k?: number walls?: Record<string,string> tags?: ... />`: InstancedMesh of points; `phase` tween from a stacked "documents" layout (a 20x30 grid) to the cloud over 1500 ms; the nearest `k` to `query` glow red with lines drawn to the query point; walls dim points outside the filter.
  - World props: `{ vectors?: { phase; query?; k?; walls? } }`.

- [ ] **Step 1: Write failing tests**: `layoutCloud(10, 1)` equals `layoutCloud(10, 1)` and differs from seed 2; `nearestK` on three known points returns the expected order; `applyWalls` with `{asset: 'Harbor Bridge'}` keeps only matching tags.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** both files; wire into `World` and into `OracleCore` face `vectors`.
- [ ] **Step 4: Run** the tests and confirm PASS; in the browser, the documents fly into the star field and five points light up.
- [ ] **Step 5: Commit** `git commit -am "feat: vector field with nearest-k and walls"`.

### Task 11: Overlay system, fonts, cards, jump menu

**Files:**
- Create: `src/overlay/Overlay.tsx`, `src/overlay/HandoffCard.tsx`, `src/overlay/JumpMenu.tsx`, `src/overlay/registry.ts`, `public/fonts/*.woff2`
- Modify: `src/App.tsx`, `src/styles.css`
- Test: `tests/overlay/HandoffCard.test.tsx`, `tests/overlay/Overlay.test.tsx`

**Interfaces:**
- Consumes: `useSceneStore`.
- Produces:
  - `OVERLAYS: Record<OverlayKey, React.ComponentType<any>>` registry; `<Overlay />` renders `current().overlay` from the registry with `overlayProps`, the `card` as `<HandoffCard />` when present, the chapter and scene title in a top-left strip, and `<JumpMenu open />` when J is pressed.
  - `<HandoffCard card />`: full-screen dark card, title "Now run", the `run` text large, `expect` in a green `ok` line style, `minutes` as a pill.
  - Fonts bundled: Inter 400/600, Noto Sans Thai 400/600, JetBrains Mono 400.

- [ ] **Step 1: Write failing tests**: `HandoffCard` renders `run`, `expect` and `minutes` text; `Overlay` with a scene whose `overlay` key is unknown renders the text `overlay not found: <key>` instead of throwing.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement**; download the three font families as woff2 into `public/fonts` and reference them in `styles.css`.
- [ ] **Step 4: Run** the tests and confirm PASS.
- [ ] **Step 5: Commit** `git commit -am "feat: overlay host, hand-off cards, jump menu, fonts"`.

### Task 12: Recorded outputs and recap panel

**Files:**
- Create: `src/content/recorded/schema.ts`, `src/content/recorded/lab2.json`, `src/content/recorded/lab3.json`, `src/overlay/RecapPanel.tsx`, `tools/capture_outputs.py`
- Test: `tests/overlay/RecapPanel.test.tsx`, `tests/content/recorded.test.ts`

**Interfaces:**
- Produces:
  - `type RecordedOutput = { kind: 'ok'; text: string } | { kind: 'text'; text: string } | { kind: 'table'; headers: string[]; rows: string[][] } | { kind: 'json'; value: unknown } | { kind: 'trace'; steps: { step: string; tool: string; latency_ms: number; tokens_in?: number; tokens_out?: number; detail: string }[] }`
  - `lab2.json`, `lab3.json`: `Record<string, RecordedOutput[]>` keyed by the hand-off step (`"0.10"`, `"1.5"`, `"todo1"`, `"day1"`, `"compare"`, ...). Until the real recording run (team task), seed with the values quoted in the spec: readiness READY, 5 chunks with distances, TODO lines (`TODO 1 passed - embedder returns float32 ((1, 384)) arrays`, `TODO 5 passed - broad=5, asset-filtered=5, category-filtered=4`), the top-3 findings (0.187, 0.190, 0.208), Vance's hit score 0.289, the with/without comparison rows.
  - `recordedFor(lab, key): RecordedOutput[] | undefined`
  - `<RecapPanel recap />`: right-side panel styled like Jupyter output (monospace, green `ok` lines with a check mark, HTML tables), the `note` in Oracle red below; unknown key renders `output not recorded: <key>`.
  - `tools/capture_outputs.py <executed.ipynb> <out.json> <map.json>`: reads an executed notebook, maps cell indices to keys using `map.json`, and writes `RecordedOutput[]` per key from stream text, `text/html` tables and `text/plain` outputs. Run with `python -I`.

- [ ] **Step 1: Write failing tests**: `recordedFor('lab3', 'todo5')[0]` has kind `ok` and text containing `broad=5`; `RecapPanel` with key `nope` renders `output not recorded: nope`; a `table` output renders the headers.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** schema, seed JSON, panel, and the capture script (test the script by hand on `aiw_notebook_complete_oci.ipynb` from the zip, the only executed notebook available, with a two-entry map).
- [ ] **Step 4: Run** the tests and confirm PASS.
- [ ] **Step 5: Commit** `git commit -am "feat: recorded outputs and recap panel"`.

### Task 13: Chapter 0 scenes

**Files:**
- Create: `src/scenes/chapter0.ts`, `src/scenes/index.ts`, `src/overlay/concepts/TitleCard.tsx`, `src/overlay/concepts/QuestionBubble.tsx`, `src/overlay/concepts/SmallBrain.tsx`
- Modify: `src/App.tsx` (setScenes from `scenes/index.ts`), `src/overlay/registry.ts`
- Test: `tests/scenes/chapter0.test.ts`

**Interfaces:**
- Consumes: everything above.
- Produces: scenes `0.1` to `0.7` exactly as the spec table: `0.1` shot `gulf-approach` then `city-high`, overlay `TitleCard`; `0.2` pins pop in by type with `pins: 'all'`; `0.3` `dataStream: true` with counters; `0.4` shot `bridge-pier3`, overlay `QuestionBubble` (four arrows); `0.5` shot `core-dive` then four sub-scenes `0.5a-d` with `core` faces; `0.6` overlay `SmallBrain`; `0.7` shot `bridge-pier3`, `graph: 'Harbor Bridge'`, two markers, tag "fictional scenario". A `recapMode` flag on `0.1`, `0.5`, `0.7` marks the Lab 3 recap subset.

- [ ] **Step 1: Write failing test**: chapter0 exports scenes whose ids start with `0.`, first is `0.1`, every `shot` exists in `SHOTS`, every `overlay` exists in `OVERLAYS`.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** the scene list and the three small overlays.
- [ ] **Step 4: Run** the test and confirm PASS; click through 0.1 to 0.7 in the browser.
- [ ] **Step 5: Commit** `git commit -am "feat: chapter 0 shared opening"`.

### Task 14: Chapter 1 scenes (Lab 2)

**Files:**
- Create: `src/scenes/chapter1.ts`, `src/overlay/concepts/MaturityLadder.tsx`, `Envelope.tsx`, `Toolbelt.tsx`, `SopClipboard.tsx`, `UnifiedBeams.tsx`, `AgentLoop.tsx`, `StickyNote.tsx`
- Modify: `src/scenes/index.ts`, `src/overlay/registry.ts`
- Test: `tests/scenes/chapter1.test.ts`, `tests/overlay/AgentLoop.test.tsx`

**Interfaces:**
- Produces: scenes `1.1` to `1.9`, each with its hand-off `card` and `recap` keys as in the spec tables (cards: `0.4-0.10`, `1.2-1.5`, `1.7-1.9`, `2.3-2.7` optional, `3.2-3.3`, `4.3-4.5`, `5.3-5.7`, `5.8-6.1`).
  - `<AgentLoop steps={TraceStep[]} playing />`: SVG of the two-node loop (model, tools) plus the `enforce` safety-net node; replays a recorded trace step by step at 900 ms per step, lighting `recall`, `get_asset_incident_brief`, `remember`, `final`.
  - `<Toolbelt tools={string[]} wired={Record<string, Face>} />`: eight cards on a wall; hovering a card shows name, signature and docstring text from `src/content/tools.ts`.
  - `<SopClipboard />`: the five SOP steps and the four thresholds; `section loss > 25%` marked in Oracle red.
  - `<UnifiedBeams />`: triggers core faces in order and shows the four JSON keys `asset`, `specifications`, `graph_context`, `ranked_evidence`.

- [ ] **Step 1: Write failing tests**: chapter1 ids `1.1` to `1.9` in order with cards on 1.1, 1.2, 1.3, 1.5, 1.7, 1.8, 1.9; `AgentLoop` with a 4-step trace renders four step labels and marks `remember` as `data-state="done"` after playback (use fake timers).
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** the scene list and the seven overlays.
- [ ] **Step 4: Run** the tests and confirm PASS; click through Chapter 1.
- [ ] **Step 5: Commit** `git commit -am "feat: chapter 1 RAG to Agents"`.

### Task 15: Chapter 2 concept scenes (Lab 3, 2.0 to 2.5)

**Files:**
- Create: `src/scenes/chapter2.ts` (concept part), `src/overlay/concepts/ForgetfulAgent.tsx`, `MemoryMap.tsx`, `ContextGlass.tsx`, `ThreeDials.tsx`, `LoopWithMemory.tsx`
- Modify: `src/scenes/index.ts`, `src/overlay/registry.ts`
- Test: `tests/overlay/ContextGlass.test.tsx`

**Interfaces:**
- Produces: scenes `2.0` (Chapter 0 recap subset via `recapMode`), `2.1` to `2.5`.
  - `<MemoryMap selected? />`: shelves per the deck classification: short-term (context window, session, working memory, semantic cache), long-term (procedural: workflow, toolbox, tool logs; episodic: conversations, summaries; semantic: knowledge base, entity, persona), shared memory; clicking a shelf shows its city example.
  - `<ContextGlass failure={'none'|'volume'|'relevance'|'accuracy'|'timing'} />`: a glass with blocks (system prompt, tool schemas, retrieved context, history, user message); each failure animates as the spec describes.
  - `<ThreeDials active />`: memory, context, harness.
  - `<LoopWithMemory />`: read, reason and act, write back, summarize.

- [ ] **Step 1: Write failing test**: `ContextGlass` with `failure="volume"` renders an element `[data-overflow]`; with `accuracy` renders the text `size 9` struck through.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement** the scenes and the five overlays.
- [ ] **Step 4: Run** the test and confirm PASS; click through 2.0 to 2.5.
- [ ] **Step 5: Commit** `git commit -am "feat: chapter 2 concept scenes"`.

### Task 16: Chapter 2 hands-on scenes (2.6 to 2.17)

**Files:**
- Modify: `src/scenes/chapter2.ts`
- Create: `src/overlay/concepts/WritePath.tsx`, `ScopeKey.tsx`, `FindingsShelf.tsx`, `DoorsAndHall.tsx`, `CopilotTurn.tsx`, `ContextCardXml.tsx`, `InspectorDay.tsx`, `SplitCompare.tsx`, `ThresholdMeet.tsx`, `Takeaways.tsx`
- Test: `tests/scenes/chapter2.test.ts`, `tests/overlay/WritePath.test.tsx`

**Interfaces:**
- Produces: scenes `2.6` to `2.17` with cards (TODO 1 to TODO 6, Part 5, Day 1, Day N, compare) and recap keys (`todo1`...`todo6`, `part5`, `day1`, `dayN`, `compare`).
  - `<WritePath narrative extracted={{type: 'fact'|'preference'|'guideline'|'memory'; text: string}[]} />`: the paragraph splits; one copy files into `CITY_MESSAGE`, cards peel off into `CITY_MEMORY` coloured fact blue, preference green, guideline amber, memory grey.
  - `<CopilotTurn step />`: eight steps lit in order with the spec's names; `<ContextCardXml />` shows the four XML blocks.
  - `<DoorsAndHall />`: Vance's beam bounces off Mercer's door, finds the guideline in the hall; shows `personal hits: 0`, `city hits: 1`.
  - `<InspectorDay who='Mercer'|'Vance' />` and `<SplitCompare />` render recorded outputs through `RecapPanel`.
  - World for 2.10: `vectors` with `walls: { asset: 'Harbor Bridge', category: 'corrosion' }`; for 2.13/2.14 shot `bridge-pier2`.

- [ ] **Step 1: Write failing tests**: chapter2 ids `2.0` to `2.17` in order, cards on 2.6 to 2.15, no card on 2.16 and 2.17; `WritePath` with three extracted records renders three cards with `data-type` attributes.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement**.
- [ ] **Step 4: Run** the tests and confirm PASS; click through 2.6 to 2.17.
- [ ] **Step 5: Commit** `git commit -am "feat: chapter 2 hands-on scenes"`.

### Task 17: Narration, presenter notes, language toggle

**Files:**
- Create: `src/content/narration.ts`, `src/overlay/PresenterNotes.tsx`
- Modify: `src/overlay/Overlay.tsx`, `src/engine/store.ts` (field `lang: 'en' | 'th'`, `toggleLang()`)
- Test: `tests/content/narration.test.ts`

**Interfaces:**
- Produces: `NARRATION: Record<string, { en: string; th?: string }>` with the spec's "one line the presenter lands" for every scene in English; `narrationFor(id, lang): string` falls back to `en`; `<PresenterNotes open />` shows the current scene's narration, the next scene's title and the elapsed time since the chapter started.

- [ ] **Step 1: Write failing test**: every scene id in `scenes/index.ts` has an `en` entry; `narrationFor('0.1', 'th')` returns the `en` text when `th` is missing.
- [ ] **Step 2: Run** and confirm FAIL.
- [ ] **Step 3: Implement**; Thai text is added by the team later (keep `th` optional).
- [ ] **Step 4: Run** the test and confirm PASS.
- [ ] **Step 5: Commit** `git commit -am "feat: narration and presenter notes"`.

### Task 18: Build, packaging, offline check

**Files:**
- Modify: `vite.config.ts`, `README.md`, `package.json` (scripts `build`, `serve`)

- [ ] **Step 1: Configure** `base: './'` and `assetsInlineLimit: 0`; add script `serve: "npx serve dist"` (or `python -m http.server 8080 -d dist`).
- [ ] **Step 2: Run** `npm run build`; confirm `dist/` under 60 MB and no absolute URLs in `dist/index.html`.
- [ ] **Step 3: Verify offline**: disable the network adapter, run `npm run serve`, open `http://localhost:8080/#scene=2.14`, confirm the scene loads with the GLB and fonts.
- [ ] **Step 4: Write** `README.md`: how to run on the presenter laptop, the keys, the quality toggle, how to regenerate recorded outputs with `tools/capture_outputs.py`.
- [ ] **Step 5: Commit** `git commit -am "chore: offline build and run instructions"`.

### Task 19: Recorded outputs from a real run

- [ ] **Step 1:** In the LiveLabs sandbox, run `rag_to_agents_lab.ipynb` and `notebook_complete_ollama.ipynb` top to bottom; download both executed `.ipynb` files.
- [ ] **Step 2:** Write `tools/maps/lab2.json` and `tools/maps/lab3.json` mapping executed cell indices to recap keys; run `python -I tools/capture_outputs.py <nb> src/content/recorded/labN.json tools/maps/labN.json` for each.
- [ ] **Step 3:** Run `npx vitest run tests/content/recorded.test.ts`, confirm PASS; click through every recap scene and confirm the panels show real values.
- [ ] **Step 4: Commit** `git commit -am "content: recorded outputs from the sandbox run"`.
