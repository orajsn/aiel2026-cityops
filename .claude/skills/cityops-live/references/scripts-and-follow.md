# Presenter scripts, the phone relay and the script manager

## Where a page's script comes from

| Layer | File | Format |
|---|---|---|
| English default | `src/scenes/script.ts` (`SCRIPT[id]`); Lab 1: `LAB1_SCRIPT` in `lab1.ts`; open-the-lab pages: `GO_SCRIPT` in `labGo.ts` | one string; the in-app caption bar renders `**teal**` and `!!red!!` (`overlay/Rich.tsx`); no markdown, no click markers |
| Thai default | `src/content/scriptTh.ts` (`SCRIPT_TH[id]`) | array of paragraphs, markdown allowed; for a page with clicks put `"*▶ Next*"` between the blocks |
| One script per click | `src/content/scriptSteps.ts` (`STEP_EN`, `STEP_TH`, `STEP_PAGES`) | stop `n` of page `p` is the script page `p.n` (`3.6m.4`) |
| **Saved versions** | `follow/data/versions.jsonl` (relay, **not in git**) | what colleagues saved in the manager; **wins over every default** |

`npx vite-node tools/export-follow-scripts.ts` joins the defaults into `follow/public/scripts.json` (`{ pages: [{ id, label, part, title, en, th }] }`; also run by `tools/serve-vm.sh` and `tools/verify-setup.sh`). The relay reads that file on every request and replaces each page's text by its latest saved version (`merged()` in `follow/server.mjs`).

**The trap**: changing a default in code does nothing on a page that already has a saved version. Check first:
```bash
curl -s -H 'x-remote-user: me' http://127.0.0.1:8090/<FOLLOW_BASE>api/m/pages | jq '.pages[] | select(.id=="3.15f") | {vEn, vTh, byEn, byTh}'   # v > 0 means a saved version exists
```
To change such a page, save a new version (below) or edit in the manager. Never overwrite a colleague's version without reading it: read the text from the API and change only what you need; the old text stays in the version history (restorable).

## The relay's API (`follow/server.mjs`; every URL is under `FOLLOW_BASE`, e.g. `/aiexperiencelive2026/follow/`)

Public (the audience; no login): `GET ` the phone page, `scripts.json`, `thumbs/…`; `GET api/pages` (pages with the live text); `GET api/s/<code>` (does the session exist: 404 "no such session" if not); `GET api/s/<code>/events` (Server-Sent Events: state, script updates, end).
Presenter: `POST api/create` (behind the login) → `{code, token}`; `POST api/s/<code>/state` header `x-token`, body `{id}`; `POST api/s/<code>/end`. A session ends after `FOLLOW_IDLE_MS` (default 90 min) without a presenter call, or 24 h; the presenter's app repeats the page every 5 minutes as a heartbeat.
Script manager (behind the login; nginx sets `X-Remote-User`): `GET api/m/me`, `GET api/m/pages`, `PUT api/m/script/<id>` body `{lang:'en'|'th', text, base, note}` (`base` = the version you started from; 409 if someone saved first; 200 `unchanged` if the text is the same), `GET api/m/versions/<id>?lang=th`, comments: `GET|POST|PATCH api/m/comments/<id>` (`POST {text, parent?}`; `PATCH {op:'resolve'|'delete', cid, value?}`).

From the server itself you can call it directly (no nginx): `curl -H 'x-remote-user: yourname' -H 'content-type: application/json' -X PUT http://127.0.0.1:8090<FOLLOW_BASE>api/m/script/3.15f -d '{"lang":"th","text":"…","base":<vTh>,"note":"why"}'`.

## Writing scripts (the owner's rules)
- It must be **what the presenter actually says on stage**: whole spoken sentences, not slide notes (no bullet lists, no "Next ×3: …" descriptions). One block per click, separated by a bare `*▶ Next*` line.
- Highlights: `**bold**` for the key idea. Thai first for the Thai audience; keep English product names in English.
- A page without a Thai script shows English on the phone; every Lab 3 page needs Thai (tests).
- Wording rules apply (`rules.md`): "the AI agent", Mercer and Vance, no pier numbers.

## The manager UI and review loop
`/?mode=scripts` (Settings › Script manager): left, pages by part; centre, the editor (English or Thai, side by side); versions with word diff and restore; comment threads per page. Colleagues' comments are the review: read the open ones (`GET api/m/pages` → `open` count; `GET api/m/comments/<id>`), make the change, reply in the thread (`POST … {text, parent}`) and leave resolving to the commenter.

## Phone page
`follow/public/index.html` (join with a 6-digit code or `?c=` from the QR; English/Thai toggle; shows the page picture `thumbs/<id>.jpg` and its script; code-map stops use `thumbs/3.6m_<n>.jpg`), `md.js` renders `# headings`, `**bold**`, `*italic*`, `` `code` ``, links, lists, quotes (not `==highlight==`). A tiny SSE client; no framework.

## Adding a colleague
`bash tools/follow-user.sh <name>` (on the host with `/etc/nginx/cityops.htpasswd`): asks for the password, stores only the hash. The name is what versions and comments show.
