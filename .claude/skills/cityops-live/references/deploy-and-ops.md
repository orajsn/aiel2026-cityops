# Running, deploying and operating

The full, tested procedure with config files is **`deploy/README.md`**. This file adds the operating knowledge.

## Choose a setup
- Rehearse or edit: `npm run dev` (http://localhost:5174, fixed port).
- A shared address: **static build + nginx + relay** (`tools/deploy-static.sh`, `deploy/nginx-cityops.conf`, `deploy/cityops-follow.service`).
- The workshop's own setup (camera and traffic saves from the live site): **the Vite dev server as the live site** (`deploy/cityops-dev.service`, `tools/vm-setup.sh`).

## The workshop's host (what was running, for whoever inherits it)
- A cloud VM, Oracle Linux 9 (aarch64, SELinux enforcing), folder `~/cityops-live`, served at `https://jatuponghub.duckdns.org/aiexperiencelive2026/` behind nginx basic auth (`/etc/nginx/conf.d/codeserver.conf`, logins in `/etc/nginx/cityops.htpasswd`; code-server keeps `/`).
- systemd services: `cityops-dev` (Vite on 127.0.0.1:8082 with `CITYOPS_BASE=/aiexperiencelive2026/`, `CITYOPS_BEHIND_LOGIN=1`, `CITYOPS_AUTOCOMMIT=1`), `cityops-follow` (relay on 127.0.0.1:8090, `FOLLOW_BASE=/aiexperiencelive2026/follow/`), `cityops-claude` (Claude Code Remote Control, the owner's phone access). **Never stop `cityops-dev` or `cityops-claude` without the owner's say-so**; restarting `cityops-follow` ends every phone session.
- Git on that VM: `origin` is a bare repo (`~/git/cityops-live.git`) whose post-receive hook pulls into `~/cityops-live`, so **a push to origin updates the live site at once**; the dev server commits the owner's camera and traffic saves itself (`CITYOPS_AUTOCOMMIT=1`) and pushes them. Working on the VM means editing the live site: commit and `git push origin main`; do not run `tools/sync-vm.sh` there (it is for a laptop: pull then push, never force).
- The same code is also on GitHub (`markerxz/aiel2026-cityops`, remote `github`): `git push github main`. Keep `origin` as the branch's upstream on the VM.
- Restart after a code change that the dev server does not pick up: `bash tools/serve-vm.sh` (regenerates `scripts.json`, restarts the relay and the dev server, prints the HTTP status).
- Logs: `journalctl -u cityops-dev -n 50`, `journalctl -u cityops-follow -n 50`.
- The login password exists only as a hash; never print or commit it. Add a colleague: `bash tools/follow-user.sh <name>`.

## What to back up
`follow/data/versions.jsonl` and `comments.jsonl` (the script manager's whole history; append-only; untracked), `/etc/nginx/cityops.htpasswd`, and the repo itself. Phone sessions are in memory only.

## Event-day checklist (what went wrong before)
1. Open the site, press J, click through the pages of your lab at full screen on the real display (3D city and resolution: Settings › Graphics, 4K for a big screen).
2. Settings › Phone follow › Start sharing; join once with your own phone; leave the join card up. A session lasts 24 h and survives long hands-on parts (the presenter page repeats its page every 5 minutes).
3. If a phone says "code not found": the session ended or the code is old: start sharing again.
4. Settings › Presentation mode if you use a clicker (Page Down/Up, `B`/`.` blanks the screen, F5 full screen).
5. Keep Camera mode saves to the owner; do not "tidy" `cameraOverrides.json`.
6. Have the script manager's data backed up before the event.

## Updating a live deployment
`git pull` → (static) `bash tools/deploy-static.sh <web-root>` → `npx vite-node tools/export-follow-scripts.ts` if scripts changed → restart the relay only if `follow/server.mjs` changed. Hard-reload browsers (the service worker keeps old files).
