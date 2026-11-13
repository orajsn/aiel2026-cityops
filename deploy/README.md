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

This is what the event ran: `cityops-dev` (Vite on 127.0.0.1:8082 with `CITYOPS_BASE=/aiexperiencelive2026/`, `CITYOPS_BEHIND_LOGIN=1`, `CITYOPS_AUTOCOMMIT=1`), the relay, and nginx. Camera mode and Traffic mode save into `src/content/*.json` through the dev server and each save is committed and pushed.

- One-time host setup (nginx site, login file, systemd unit): `printf '%s\n' '<password>' | bash tools/vm-setup.sh <username>`. It edits an existing nginx site and a code-server host, so read the script first.
- The unit file template is `deploy/cityops-dev.service`.
- Restart after a change: `bash tools/serve-vm.sh` (rebuilds `scripts.json`, restarts the relay and the dev server).
- The VM's git: `origin` is a bare repo with a post-receive hook that pulls into the working folder, so a push from a laptop updates the live site. From a laptop use `bash tools/sync-vm.sh` (pull, then push, never force).

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

On a clean `git clone` of this repository from GitHub (commit 5f9c190, so the instructions here are the ones that ran):

1. `bash tools/verify-setup.sh`: `npm ci`, type check, 391 tests, production build (106 MB), the built app served, the dev server, the relay (session created, page change accepted, script manager lists 107 pages). All passed.
2. `bash tools/deploy-static.sh <root>`, then nginx (1.20, rendered from `deploy/nginx-cityops.conf`) and the relay (`FOLLOW_BASE=/aiexperiencelive2026/follow/`). Results: app without login 401, with login 200, bundle 200, 3D model 200, redirect without a slash 301, phone page without login 200, create session without login 401 and with login 200, script manager without login 401 and with login 200 and `{"user":"tester"}`.
3. A headless Chromium opened `#scene=3.5e` through nginx with the login: the page rendered its panel; the only failed requests were the two dev-server endpoints (`__camera-overrides`, `__traffic`), which a static build does not have; the app then uses the saved angles and traffic bundled in the build.

Not tested here: a real GPU (the test machine could not draw WebGL), HTTPS certificates, and `tools/vm-setup.sh` on a new host.
