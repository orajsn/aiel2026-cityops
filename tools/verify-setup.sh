#!/usr/bin/env bash
# Proves a fresh checkout works, end to end, on any machine with Node 20+ (no browser, no GPU, no Oracle account needed):
#   install -> type check -> all tests -> production build -> serve the build -> dev server -> phone-follow relay.
#   bash tools/verify-setup.sh                 # the whole check (about 3 to 5 minutes)
#   SKIP_INSTALL=1 bash tools/verify-setup.sh  # reuse node_modules
# Every step prints PASS or stops with FAIL. Nothing is installed outside this folder; ports 4173, 5199 and 8191 are used and freed.
set -uo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
PIDS=()
cleanup() { for p in "${PIDS[@]:-}"; do [ -n "$p" ] && kill "$p" 2>/dev/null || true; done; [ -n "${TMPD:-}" ] && rm -rf "$TMPD"; }
trap cleanup EXIT
TMPD="$(mktemp -d)"
step() { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }
pass() { printf '\033[1;32mPASS\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31mFAIL\033[0m %s\n' "$*"; exit 1; }
wait_http() { # url, seconds
  for _ in $(seq 1 "$2"); do curl -sf -o /dev/null --max-time 2 "$1" && return 0; sleep 1; done; return 1
}

step "1/8 Node and npm"
command -v node > /dev/null || fail "node is not installed (need Node 20 or newer: https://nodejs.org)"
MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$MAJOR" -ge 20 ] || fail "Node $(node -v) is too old: need 20 or newer"
command -v npm > /dev/null || fail "npm is not installed"
pass "node $(node -v), npm $(npm -v)"

step "2/8 Install dependencies (npm ci)"
if [ "${SKIP_INSTALL:-0}" = "1" ] && [ -d node_modules ]; then pass "skipped, node_modules is there"; else npm ci --no-audit --no-fund > "$TMPD/install.log" 2>&1 && pass "dependencies installed" || { tail -20 "$TMPD/install.log"; fail "npm ci"; }; fi

step "3/8 Type check"
npx tsc --noEmit > "$TMPD/tsc.log" 2>&1 && pass "no type errors" || { tail -20 "$TMPD/tsc.log"; fail "tsc"; }

step "4/8 Tests (vitest)"
npx vitest run > "$TMPD/test.log" 2>&1 && pass "$(grep -E 'Tests ' "$TMPD/test.log" | tail -1 | sed 's/^ *//')" || { tail -30 "$TMPD/test.log"; fail "vitest"; }

step "5/8 Production build (npm run build -> dist/)"
npm run build > "$TMPD/build.log" 2>&1 && pass "dist/ built ($(du -sh dist | cut -f1))" || { tail -30 "$TMPD/build.log"; fail "build"; }
[ -f dist/index.html ] || fail "dist/index.html is missing"

step "6/8 Serve the build and fetch the app, a 3D model and the bundle"
npx vite preview --host 127.0.0.1 --port 4173 --strictPort > "$TMPD/preview.log" 2>&1 &
PIDS+=($!)
wait_http http://127.0.0.1:4173/ 30 || { cat "$TMPD/preview.log"; fail "preview server did not start"; }
curl -sf http://127.0.0.1:4173/ | grep -q '<div id="root"' && pass "index.html served" || fail "index.html has no #root"
MODEL="$(find dist/models -name '*.glb' | head -1)"
[ -n "$MODEL" ] && curl -sf -o /dev/null "http://127.0.0.1:4173/${MODEL#dist/}" && pass "a 3D model is served (${MODEL#dist/})" || fail "no 3D model is served"
JS="$(ls dist/assets/*.js | head -1)"
curl -sf -o /dev/null "http://127.0.0.1:4173/${JS#dist/}" && pass "the app bundle is served" || fail "bundle"

step "7/8 Dev server (npm run dev) answers"
CITYOPS_BASE=/ npx vite --host 127.0.0.1 --port 5199 --strictPort > "$TMPD/dev.log" 2>&1 &
PIDS+=($!)
wait_http http://127.0.0.1:5199/ 40 || { tail -20 "$TMPD/dev.log"; fail "dev server did not start"; }
curl -sf http://127.0.0.1:5199/ | grep -q 'src/main.tsx' && pass "dev server serves the app" || fail "dev server page"
curl -sf http://127.0.0.1:5199/__camera-overrides | grep -q '{' && pass "camera-save endpoint answers" || fail "camera endpoint"

step "8/8 Phone-follow relay and script manager API"
cp follow/public/scripts.json "$TMPD/scripts.json.orig"   # the export stamps a time into it; put it back afterwards so the check leaves git clean
npx vite-node tools/export-follow-scripts.ts > "$TMPD/export.log" 2>&1 && pass "scripts.json rebuilt ($(tail -1 "$TMPD/export.log" | sed 's/^.*follow scripts: //'))" || { cat "$TMPD/export.log"; fail "export-follow-scripts"; }
FOLLOW_PORT=8191 FOLLOW_BASE=/follow/ FOLLOW_DATA="$TMPD/followdata" node follow/server.mjs > "$TMPD/relay.log" 2>&1 &
PIDS+=($!)
wait_http http://127.0.0.1:8191/follow/ 15 || { cat "$TMPD/relay.log"; fail "relay did not start"; }
SESSION="$(curl -sf -X POST http://127.0.0.1:8191/follow/api/create)" || fail "create session"
CODE="$(printf '%s' "$SESSION" | node -p 'JSON.parse(require("fs").readFileSync(0)).code')"
TOKEN="$(printf '%s' "$SESSION" | node -p 'JSON.parse(require("fs").readFileSync(0)).token')"
[ "${#CODE}" = 6 ] && pass "a 6-digit session code was issued" || fail "session code"
curl -sf -X POST -H "x-token: $TOKEN" -d '{"id":"3.6m.4"}' "http://127.0.0.1:8191/follow/api/s/$CODE/state" | grep -q '"ok":true' && pass "the presenter's page change is accepted" || fail "state post"
NP="$(curl -sf -H 'x-remote-user: verify' http://127.0.0.1:8191/follow/api/m/pages | node -p 'JSON.parse(require("fs").readFileSync(0)).pages.length')"
[ "$NP" -gt 50 ] && pass "the script manager lists $NP script pages" || fail "script manager pages"

cp "$TMPD/scripts.json.orig" follow/public/scripts.json
printf '\n\033[1;32mAll checks passed.\033[0m  Run it: npm run dev  ->  http://localhost:5174\n'
