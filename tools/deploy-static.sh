#!/usr/bin/env bash
# Build CityOps Live for a web address and copy it where a web server serves it from.
#   bash tools/deploy-static.sh <web-root> [base]
#   bash tools/deploy-static.sh /var/www/cityops                  # -> /var/www/cityops/aiexperiencelive2026/  (address /aiexperiencelive2026/)
#   bash tools/deploy-static.sh /var/www/cityops /workshop/       # -> /var/www/cityops/workshop/              (address /workshop/)
# The address ("base") is baked into the build: build again if it changes. nginx and the phone-follow relay: deploy/README.md.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="${1:?usage: tools/deploy-static.sh <web-root> [base]}"
BASE="${2:-/aiexperiencelive2026/}"
case "$BASE" in /*/) ;; *) echo "base must start and end with a slash, e.g. /aiexperiencelive2026/"; exit 1 ;; esac
CITYOPS_BASE="$BASE" npm run build
TARGET="${ROOT%/}${BASE}"
mkdir -p "$TARGET"
# a clean copy: delete what is there first (the folder is only this app), then copy
find "$TARGET" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -a dist/. "$TARGET/"
echo "deployed to $TARGET ($(du -sh "$TARGET" | cut -f1)); serve ${ROOT%/} so that ${BASE} reaches it"
