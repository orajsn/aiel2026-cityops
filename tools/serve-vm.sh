#!/usr/bin/env bash
# Start (or restart) the CityOps dev server in the background on a Linux machine, e.g. the cloud VM jatuponghub:
#   bash tools/serve-vm.sh [port]      (default 8082; the log goes to dev.log in the project folder)
# It keeps running after the SSH session closes. Stop it with: pkill -f "node_modules/.bin/vite --host"
set -u
PORT="${1:-8082}"
cd "$(dirname "$0")/.."
pkill -f "node_modules/.bin/vite --host" 2>/dev/null
sleep 1
setsid nohup npx vite --host 0.0.0.0 --port "$PORT" --strictPort > dev.log 2>&1 < /dev/null &
sleep 6
tail -n 4 dev.log
