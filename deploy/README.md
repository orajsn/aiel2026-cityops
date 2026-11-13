# Deploying CityOps Live

Three ways to run it, and the checks that prove each one works. Everything below was run once, end to end, on a clean clone
(Oracle Linux 9 aarch64, Node 26, nginx 1.20): see "What was tested" at the end.

| | Setup | Saves camera and traffic? | Needs |
|---|---|---|---|
| **A** | `npm run dev` on one machine | yes (into the repo) | Node 20+ |
| **B** | static build + nginx + relay (recommended for a new host) | no (the saved angles in the repo are used) | Node 20+ to build, nginx, a web root |
| **C** | the workshop's setup: Vite dev server as the live site | yes, and each save is committed | B's pieces + a systemd service |

## A · Run on a laptop

```bash
npm ci
npm run dev            # http://localhost:5174
```

Phone follow and the script manager need the relay too (see "The relay" below); on one laptop you can skip them.

## B · A static build behind nginx (recommended)

You get: the app behind a login, the audience's phone page open (they need a session code), the script manager for signed-in colleagues.

**1. Build and copy** (on the machine that has Node):

```bash
bash tools/deploy-static.sh /var/www/cityops                 # address /aiexperiencelive2026/
# another address:  bash tools/deploy-static.sh /var/www/cityops /workshop/
```

The address (the "base") is baked into the build. If you choose another one, also change it in the nginx file and in `FOLLOW_BASE` of the relay's service.

**2. A login file** for the presenter and colleagues (one line per person):

```bash
printf 'mali:%s\n' "$(openssl passwd -6 'a-good-password')" | sudo tee /etc/nginx/cityops.htpasswd
sudo chown root:nginx /etc/nginx/cityops.htpasswd && sudo chmod 640 /etc/nginx/cityops.htpasswd
# more people: append more lines (or: bash tools/follow-user.sh <name>, which also does this)
```

The login name is what the script manager shows as the author of an edit or comment.

**3. nginx.** Render the template and include it inside your HTTPS `server { }` block:

```bash
sed "s#__WEB_ROOT__#/var/www/cityops#g; s#__HTPASSWD__#/etc/nginx/cityops.htpasswd#g" \
    deploy/nginx-cityops.conf | sudo tee /etc/nginx/snippets/cityops.conf
# in your server { ... }:   include /etc/nginx/snippets/cityops.conf;
sudo nginx -t && sudo systemctl reload nginx
```

On SELinux hosts (Oracle Linux, RHEL) allow nginx to reach the relay and read the files:
`sudo setsebool -P httpd_can_network_connect 1` and `sudo chcon -R -t httpd_sys_content_t /var/www/cityops`.

**4. The relay** (phone follow and the script manager), as a service:

```bash
sudo cp deploy/cityops-follow.service /etc/systemd/system/
sudo sed -i "s#__USER__#$USER#; s#__APP_DIR__#$PWD#; s#__NODE__#$(command -v node)#" /etc/systemd/system/cityops-follow.service
npx vite-node tools/export-follow-scripts.ts        # makes follow/public/scripts.json from the pages' scripts
sudo systemctl daemon-reload && sudo systemctl enable --now cityops-follow
```

The relay keeps phone sessions in memory (a restart ends them) and writes the script manager's data to `follow/data/` (`versions.jsonl`, `comments.jsonl`, append-only). **Back that folder up**; it is not in git.

**5. Check it** (replace host and login):

```bash
B=https://your-host/aiexperiencelive2026
curl -s -o /dev/null -w "%{http_code}\n" $B/                           # 401 (login needed)
curl -s -o /dev/null -w "%{http_code}\n" -u mali:pw $B/                # 200
curl -s -o /dev/null -w "%{http_code}\n" $B/follow/                    # 200 (the phone page is open)
curl -s -o /dev/null -w "%{http_code}\n" -X POST $B/follow/api/create  # 401 (only the presenter creates a session)
curl -s -o /dev/null -w "%{http_code}\n" -u mali:pw -X POST $B/follow/api/create   # 200
curl -s -u mali:pw $B/follow/api/m/me                                  # {"user":"mali"}
```

Then open `$B/`, press `J`, and click through. Settings › Phone follow › Start sharing shows the join card.

## C · The workshop setup (Vite dev server as the live site)

This is what the event ran: the Vite dev server serves the app (so Camera mode and Traffic mode **save** into `src/content/*.json`, and each save is committed and pushed to the repo's git remote), the relay serves phones and the script manager, and nginx adds the login.

1. Steps 2 and 4 of option B are the same (login file, relay service). Do not run `tools/deploy-static.sh`.
2. **The dev server as a service**:
   ```bash
   sudo cp deploy/cityops-dev.service /etc/systemd/system/
   sudo sed -i "s#__USER__#$USER#; s#__APP_DIR__#$PWD#; s#__NODE__#$(command -v node)#" /etc/systemd/system/cityops-dev.service
   sudo systemctl daemon-reload && sudo systemctl enable --now cityops-dev
   ```
   Environment it sets: `CITYOPS_BASE=/aiexperiencelive2026/`, `CITYOPS_BEHIND_LOGIN=1` (the saves are accepted because nginx already checked the login), `CITYOPS_AUTOCOMMIT=1` (each save is committed and pushed to `origin`; the repo needs a git identity and a writable `origin`, or remove that line).
3. **nginx**: render `deploy/nginx-cityops-dev.conf` (`__DEV_PORT__` 8082, `__HTPASSWD__`) and include it like in option B. It proxies the app to the dev server, with the websocket headers hot reload needs.
4. Check: `curl -u mali:pw -X POST -H 'content-type: application/json' -d '{}' https://your-host/aiexperiencelive2026/__camera-overrides` answers `ok` (without the login: 401).

Restart after a change the dev server does not pick up: `sudo systemctl restart cityops-dev` (on the workshop VM: `bash tools/serve-vm.sh`, which also rebuilds `scripts.json` and restarts the relay).

**`tools/vm-setup.sh` is specific to the workshop VM** (Oracle Linux 9, an existing nginx site shared with code-server, a Caddy site it removes, an SELinux port label). It was written for that machine and was **not** run on any other host. For a new host use the templates above.

The workshop VM's git, for the record: `origin` is a bare repo with a post-receive hook that pulls into the working folder, so a push updates the live site. From a laptop use `bash tools/sync-vm.sh` (pull, then push, never force).

## Updating a running deployment

```bash
git pull
bash tools/deploy-static.sh /var/www/cityops          # B: rebuild and copy
npx vite-node tools/export-follow-scripts.ts           # if scripts or pages changed
sudo systemctl restart cityops-follow                  # only if follow/server.mjs changed (ends phone sessions)
```

Browsers keep the map in a service-worker cache; after a deploy a hard reload shows the new build.

## Environment variables

| Variable | Used by | Meaning |
|---|---|---|
| `CITYOPS_BASE` | build, dev server | the address prefix, e.g. `/aiexperiencelive2026/` (default `./` for builds, `/` for dev) |
| `CITYOPS_BEHIND_LOGIN=1` | dev server | every request already passed a login, so saves are accepted |
| `CITYOPS_AUTOCOMMIT=1` | dev server | commit and push each camera/traffic save |
| `FOLLOW_PORT` | relay | default 8090 |
| `FOLLOW_BASE` | relay | the URL prefix it serves under, default `/` (use `/aiexperiencelive2026/follow/` behind nginx) |
| `FOLLOW_DATA` | relay | folder for the script manager's data, default `follow/data` |
| `FOLLOW_IDLE_MS` | relay | end a phone session after this long without a page change, default 90 minutes |

## What was tested

Everything below ran on clean `git clone`s of this repository from GitHub (so the instructions here are the ones that ran), on Oracle Linux 9 aarch64 with Node 26 and nginx 1.20, with a headless Chromium. The test servers used other ports and were removed afterwards.

| # | What | Result |
|---|---|---|
| 1 | `bash tools/verify-setup.sh`: `npm ci`, type check, 391 tests, production build (106 MB), the built app served, the dev server, the relay (a session code issued, a page change accepted, the script manager lists 107 pages) | all passed |
| 2 | README quick start: `npm run dev` on 5174; the camera-save and traffic-save endpoints write the files | passed |
| 3 | Option B: `tools/deploy-static.sh <root>` (default address) and again with another address (`/workshop/`, with the nginx file's address and the relay's `FOLLOW_BASE` changed as described), nginx rendered from `deploy/nginx-cityops.conf` | login 401 / 200, bundle and 3D model 200, redirect 301, phone page open, creating a session needs the login, the script manager sees the signed-in name |
| 4 | The same behind **HTTPS** (a self-signed certificate) | app, phone page and relay work; the service worker becomes active and caches the map |
| 5 | `bash .claude/skills/cityops-live/scripts/smoke.cjs <url> <user> <password>` against that HTTPS deployment | 14 checks passed: all 87 pages open with no failed request and no page error; the presenter starts sharing and gets a code; a phone joins with it, shows the page and **follows the presenter to the next page**; the script manager lists 107 pages, a script version saves, the text is restored, both versions are in the history; Stop sharing ends the session |
| 6 | Option C: the dev server with `CITYOPS_BASE`, `CITYOPS_BEHIND_LOGIN=1`, `CITYOPS_AUTOCOMMIT=1` behind nginx rendered from `deploy/nginx-cityops-dev.conf`, with a local bare repo as `origin` | camera save through nginx: 401 without the login, 200 with it; the save was committed and pushed to `origin` ("Camera angles saved by the owner on the VM") |
| 7 | `deploy/cityops-follow.service` and `deploy/cityops-dev.service` (placeholders filled in, other ports): `systemd-analyze verify`, started with systemd | both active and answering; the relay was killed with `kill -9` and systemd restarted it |
| 8 | `tools/follow-user.sh` against a temporary login file (`CITYOPS_HTPASSWD`, `NO_RELOAD=1`) | adds a user, replaces the password of an existing one; the stored hash verifies |

**Not tested:** `tools/vm-setup.sh` on a new host (see option C), a real certificate authority (the HTTPS test used a self-signed certificate), a phone on a real mobile network, and the 3D city on a real GPU (the test machine has none; the panels, the pages and the logic were checked).
