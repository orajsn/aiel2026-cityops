#!/usr/bin/env bash
# Restart the CityOps dev server on the cloud VM jatuponghub. It runs as the systemd service cityops-dev
# (set up by tools/vm-https-setup.sh) on 127.0.0.1:8082, behind Caddy at https://jatuponghub.duckdns.org:8083,
# and starts by itself at boot. Logs: journalctl -u cityops-dev -n 50
#   bash tools/serve-vm.sh
set -eu
if systemctl list-unit-files cityops-dev.service > /dev/null 2>&1 && [ -f /etc/systemd/system/cityops-dev.service ]; then
  sudo systemctl restart cityops-dev.service
  sleep 5
  systemctl is-active cityops-dev.service
  curl -s -o /dev/null -w "dev server -> %{http_code}\n" --max-time 10 http://127.0.0.1:8082/
else
  echo "the cityops-dev service is not set up yet: run bash tools/vm-https-setup.sh first"
  exit 1
fi
