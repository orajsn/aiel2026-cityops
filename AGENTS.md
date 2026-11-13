# AGENTS.md: start here (Codex, Claude Code and any coding agent)

**CityOps Live** is a click-through 3D smart-city show (React, TypeScript, three.js, Vite) with 87 pages for three Oracle workshops: Lab 1 AI Economics, Lab 2 RAG to Agents, Lab 3 Agent Memory. No AI runs at runtime. The audience follows the presenter's script on their phones (a small Node relay), and colleagues edit scripts in a manager.

## Set it up (this is all you need)

```bash
git clone https://github.com/markerxz/aiel2026-cityops.git && cd aiel2026-cityops
npm ci                           # Node 20 or newer; ~130 MB of 3D models come with the repo
npm run dev                      # http://localhost:5174  (fixed port)
bash tools/verify-setup.sh       # PROVES the checkout is healthy: types, ~390 tests, build, serve, dev server, phone relay (3 to 5 min)
```

Other commands: `npx vitest run` (tests), `npx tsc --noEmit` (types), `npm run build` (→ `dist/`).

## Deploy

- Static build behind nginx + the relay: `bash tools/deploy-static.sh /var/www/cityops`, then `deploy/nginx-cityops.conf` and `deploy/cityops-follow.service`. Full steps and the checks that were run: **`deploy/README.md`**.
- The workshop's own setup (Vite dev server as the live site on a VM) is described in `deploy/README.md` (option C) and `.claude/skills/cityops-live/references/deploy-and-ops.md`.

## Read, in this order

1. **`README.md`**: what it is, layout, where to change what.
2. **The skill `cityops-live`**: `.claude/skills/cityops-live/SKILL.md` (also linked at `.agents/skills/cityops-live/`). It knows the whole system and has a recipe for each kind of change. Load it for any task in this repo. Its `scripts/where.ts` finds any page's files; `scripts/shot.cjs` takes a picture of a page.
3. **`CLAUDE.md`**: the owner's long list of rules and decisions, with dates (the skill's `references/rules.md` is the working summary).
4. `docs/HANDOFF-*.md` (history), `docs/Lab3-notebook-audit-2026-11-10.md` (where Lab 3's pages differ from the real notebook), `docs/Lab3-presenter-script.md`.

## Rules that must not be broken

- **Never modify the Jupyter notebooks** (`src/content/notebooks/*.json` are the owner's run notebooks). Data names are exactly what they print.
- Say **"the AI agent"** (not "copilot"), **Mercer** and **Vance**, **no pier numbers** ("the crack", "the rust"), never name the model on screen.
- Colours: teal for data, **Oracle Red for the one thing to look at, never two red elements**, cool greys otherwise. No text in 3D.
- **One page per idea, built one part per Next** (`PAGE_STEPS`). Hide pages in `LAB2_CUT`/`LAB3_CUT`; never delete them.
- Do not overwrite `src/content/cameraOverrides.json` or `traffic.json` (the owner's saved choices).
- Colleagues' saved script versions (the manager) override the code defaults in `scriptTh.ts`/`script.ts`: check before you change a script.
- **Verify by looking**: render the page at full size (`scripts/shot.cjs`), read the text sizes, then say what you saw. A machine without WebGL cannot draw the 3D city: say so, never claim it was checked.
- Never commit a password, token, personal email or the contents of `follow/data/`. Never force-push `main`.

## Working agreement

- Make the smallest change that does the job and follow the file's style. Update the tests that count pages or ids when you add or move a page (`references/verification.md` has the list). Run `npx tsc --noEmit` and `npx vitest run` before you commit; `bash tools/verify-setup.sh` before a deploy.
- Commit messages say what changed and why. Push `main` (the workshop host updates itself on push to its own git; GitHub is `github` remote).
- When a task is ambiguous in a way that changes what the audience sees, ask the owner; otherwise pick the obvious option and say what you chose.
