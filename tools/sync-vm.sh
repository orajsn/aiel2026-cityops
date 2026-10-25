#!/usr/bin/env bash
# Send this PC's commits to the cloud VM jatuponghub, where the live app runs
# (https://jatuponghub.duckdns.org/aiexperiencelive2026/). First takes in what the owner saved there
# (traffic, camera angles: the VM commits those itself), then pushes; the VM updates its running copy on push.
#   bash tools/sync-vm.sh
set -euo pipefail
cd "$(dirname "$0")/.."
git pull --no-rebase --no-edit -q jatuponghub main
git push -q jatuponghub main
echo "VM in step: $(git log --oneline -1)"
