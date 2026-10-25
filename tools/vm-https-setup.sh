#!/usr/bin/env bash
# One-time setup on the cloud VM jatuponghub (25 Oct 2026): HTTPS for CityOps Live at
# https://jatuponghub.duckdns.org:8083, Caddy in front of the Vite dev server on 127.0.0.1:8082, and a systemd
# service that starts the dev server at boot. Run on the VM: bash tools/vm-https-setup.sh
# Touches only: /etc/caddy/Caddyfile (one site appended, backup kept) and /etc/systemd/system/cityops-dev.service.
# Undo: sudo cp /etc/caddy/Caddyfile.bak-2026-10-25 /etc/caddy/Caddyfile && sudo systemctl reload caddy
#       sudo systemctl disable --now cityops-dev && sudo rm /etc/systemd/system/cityops-dev.service
set -euo pipefail
APP="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$(readlink -f "$(command -v node)")"
CADDY=/etc/caddy/Caddyfile
BACKUP=/etc/caddy/Caddyfile.bak-2026-10-25

# 1. Caddy: one new site, the existing ones untouched
[ -f "$BACKUP" ] || sudo cp -p "$CADDY" "$BACKUP"
if ! grep -q 'jatuponghub.duckdns.org:8083' "$CADDY"; then
  sudo tee -a "$CADDY" > /dev/null <<'EOF'

# CityOps Live (lab app): HTTPS in front of its Vite dev server on 127.0.0.1:8082 (added 25 Oct 2026)
https://jatuponghub.duckdns.org:8083 {
	tls /etc/caddy/tls/jatuponghub.duckdns.org.fullchain.pem /etc/caddy/tls/jatuponghub.duckdns.org.key.pem
	reverse_proxy 127.0.0.1:8082
}
EOF
fi
if sudo caddy validate --config "$CADDY" --adapter caddyfile > /tmp/cityops-caddy-validate.log 2>&1; then
  sudo systemctl reload caddy
  echo "caddy: new site added and reloaded"
else
  sudo cp -p "$BACKUP" "$CADDY"
  echo "caddy: validation FAILED, backup restored, nothing reloaded"; tail -5 /tmp/cityops-caddy-validate.log; exit 1
fi

# 2. the dev server as a service: private (127.0.0.1), started through bash so SELinux lets it run node from $HOME
sudo tee /etc/systemd/system/cityops-dev.service > /dev/null <<EOF
[Unit]
Description=CityOps Live dev server (Vite on 127.0.0.1:8082, served by Caddy at https://jatuponghub.duckdns.org:8083)
After=network-online.target
Wants=network-online.target

[Service]
User=$(id -un)
WorkingDirectory=$APP
Environment=PATH=$(dirname "$NODE"):/usr/local/bin:/usr/bin:/bin
ExecStart=/usr/bin/bash -c 'exec "$NODE" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 8082 --strictPort'
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
pkill -f "node_modules/.bin/vite --host" 2>/dev/null || true
sleep 1
sudo systemctl daemon-reload
sudo systemctl enable --now cityops-dev.service
sleep 6
systemctl is-active cityops-dev.service
curl -s -o /dev/null -w "dev server on 127.0.0.1:8082 -> %{http_code}\n" --max-time 10 http://127.0.0.1:8082/
curl -s -o /dev/null -w "through Caddy, https://jatuponghub.duckdns.org:8083 -> %{http_code}\n" --max-time 10 --resolve jatuponghub.duckdns.org:8083:127.0.0.1 https://jatuponghub.duckdns.org:8083/
