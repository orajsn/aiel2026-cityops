#!/usr/bin/env bash
# Cloud VM jatuponghub (25 Oct 2026): CityOps Live at https://jatuponghub.duckdns.org/aiexperiencelive2026/ behind a
# login, through the existing nginx site (code-server keeps the rest of the address). Replaces the port-8083 setup.
#   printf '%s\n' '<password>' | bash tools/vm-setup.sh <username>
# The password is read from stdin and only its SHA-512 crypt hash is stored (/etc/nginx/cityops.htpasswd).
# Touches: /etc/nginx/conf.d/codeserver.conf (one location added, backup .bak-cityops), /etc/nginx/cityops.htpasswd,
# /etc/systemd/system/cityops-dev.service; and takes back the port-8083 Caddy site and its SELinux port label.
# Undo: sudo cp /etc/nginx/conf.d/codeserver.conf.bak-cityops /etc/nginx/conf.d/codeserver.conf && sudo systemctl reload nginx
#       sudo systemctl disable --now cityops-dev && sudo rm /etc/systemd/system/cityops-dev.service /etc/nginx/cityops.htpasswd
set -euo pipefail
USER_NAME="${1:?username}"
read -r PASSWORD
[ -n "$PASSWORD" ] || { echo "no password on stdin"; exit 1; }
APP="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$(readlink -f "$(command -v node)")"
BASE=/aiexperiencelive2026/
SITE=/etc/nginx/conf.d/codeserver.conf

# 1. no access by port: take back the Caddy site on 8083 (its backup is the file from before it) and the port label
if grep -q 'jatuponghub.duckdns.org:8083' /etc/caddy/Caddyfile 2>/dev/null && [ -f /etc/caddy/Caddyfile.bak-2026-10-25 ]; then
  sudo cp -p /etc/caddy/Caddyfile.bak-2026-10-25 /etc/caddy/Caddyfile
  sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile > /dev/null 2>&1 && sudo systemctl reload caddy && echo "caddy: port-8083 site removed"
fi
sudo semanage port -d -t http_port_t -p tcp 8083 2>/dev/null && echo "selinux: port 8083 label removed" || true

# 2. the login: username and a SHA-512 crypt hash, readable by nginx only
HASH="$(printf '%s' "$PASSWORD" | openssl passwd -6 -stdin)"
printf '%s:%s\n' "$USER_NAME" "$HASH" | sudo tee /etc/nginx/cityops.htpasswd > /dev/null
sudo chown root:nginx /etc/nginx/cityops.htpasswd
sudo chmod 640 /etc/nginx/cityops.htpasswd
unset PASSWORD HASH
echo "login: set for $USER_NAME"

# 3. nginx: one location in the HTTPS site, before code-server's catch-all
[ -f "$SITE.bak-cityops" ] || sudo cp -p "$SITE" "$SITE.bak-cityops"
if ! sudo grep -q 'aiexperiencelive2026' "$SITE"; then
  sudo python3 - "$SITE" <<'PY'
import sys
p = sys.argv[1]
s = open(p).read()
block = """    # CityOps Live (AI Experience Live 2026 labs): its dev server on 127.0.0.1:8082, behind a login
    location = /aiexperiencelive2026 {
        return 301 /aiexperiencelive2026/;
    }
    location ^~ /aiexperiencelive2026/ {
        auth_basic "CityOps Live";
        auth_basic_user_file /etc/nginx/cityops.htpasswd;
        proxy_pass http://127.0.0.1:8082;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600;
        client_max_body_size 2m;
    }

"""
# the HTTPS server's catch-all is the last "location / {"
i = s.rindex("    location / {")
open(p, "w").write(s[:i] + block + s[i:])
PY
fi
if sudo nginx -t > /tmp/cityops-nginx-test.log 2>&1; then
  sudo systemctl reload nginx
  echo "nginx: /aiexperiencelive2026/ added and reloaded"
else
  sudo cp -p "$SITE.bak-cityops" "$SITE"
  echo "nginx: test FAILED, site restored, nothing reloaded"; tail -5 /tmp/cityops-nginx-test.log; exit 1
fi

# 4. the dev server under the new address; saves allowed (only reachable through the login)
sudo tee /etc/systemd/system/cityops-dev.service > /dev/null <<EOF
[Unit]
Description=CityOps Live dev server (Vite on 127.0.0.1:8082, served by nginx at https://jatuponghub.duckdns.org$BASE)
After=network-online.target
Wants=network-online.target

[Service]
User=$(id -un)
WorkingDirectory=$APP
Environment=PATH=$(dirname "$NODE"):/usr/local/bin:/usr/bin:/bin
Environment=CITYOPS_BASE=$BASE
Environment=CITYOPS_BEHIND_LOGIN=1
Environment=CITYOPS_AUTOCOMMIT=1
ExecStart=/usr/bin/bash -c 'exec "$NODE" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 8082 --strictPort'
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable cityops-dev.service > /dev/null 2>&1
sudo systemctl restart cityops-dev.service
sleep 6
echo "service: $(systemctl is-active cityops-dev.service)"
curl -s -o /dev/null -w "dev server at $BASE -> %{http_code}\n" --max-time 10 "http://127.0.0.1:8082$BASE"
