#!/usr/bin/env bash
# Restart the CityOps dev server on the cloud VM jatuponghub. It runs as the systemd service cityops-dev
# (set up by tools/vm-setup.sh) on 127.0.0.1:8082, behind nginx at https://jatuponghub.duckdns.org/aiexperiencelive2026/,
# and starts by itself at boot. Logs: journalctl -u cityops-dev -n 50
#   bash tools/serve-vm.sh
set -eu
# the phone follow app's script file, from the pages' own scripts (follow/public/scripts.json), and its relay (service cityops-follow)
npx vite-node tools/export-follow-scripts.ts > /dev/null 2>&1 || echo "(could not refresh follow/public/scripts.json)"
if [ -f /etc/systemd/system/cityops-follow.service ]; then sudo systemctl restart cityops-follow.service; fi
if systemctl list-unit-files cityops-dev.service > /dev/null 2>&1 && [ -f /etc/systemd/system/cityops-dev.service ]; then
  sudo systemctl restart cityops-dev.service
  sleep 5
  systemctl is-active cityops-dev.service
  curl -s -o /dev/null -w "dev server -> %{http_code}\n" --max-time 10 http://127.0.0.1:8082/aiexperiencelive2026/
else
  echo "the cityops-dev service is not set up yet: see tools/vm-setup.sh"
  exit 1
fi
