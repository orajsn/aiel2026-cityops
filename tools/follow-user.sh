#!/usr/bin/env bash
# Add or change a colleague's login for CityOps Live (the same login covers the app, the script manager and its comments; the name
# is what versions and comments show). Run on the VM:   bash tools/follow-user.sh Mali
# It asks for the password (not shown, not stored anywhere but the hash in /etc/nginx/cityops.htpasswd) and reloads nginx.
# Another file or no reload (e.g. to try it out):   CITYOPS_HTPASSWD=/tmp/test.htpasswd NO_RELOAD=1 bash tools/follow-user.sh Mali
set -eu
name="${1:-}"
if ! [[ "$name" =~ ^[A-Za-z0-9._-]{2,24}$ ]]; then echo "usage: bash tools/follow-user.sh <name>   (2 to 24 letters, digits . _ -)"; exit 1; fi
read -r -s -p "Password for $name: " pw; echo
read -r -s -p "Again: " pw2; echo
[ "$pw" = "$pw2" ] && [ "${#pw}" -ge 8 ] || { echo "the two passwords must match and be at least 8 characters"; exit 1; }
hash="$(openssl passwd -apr1 "$pw")"
FILE="${CITYOPS_HTPASSWD:-/etc/nginx/cityops.htpasswd}"
# sudo only when the file is not ours to write (the real login file belongs to root)
SUDO=""; { [ -w "$FILE" ] || { [ ! -e "$FILE" ] && [ -w "$(dirname "$FILE")" ]; }; } || SUDO="sudo"
[ -e "$FILE" ] && $SUDO sed -i "/^${name}:/d" "$FILE"
printf '%s:%s\n' "$name" "$hash" | $SUDO tee -a "$FILE" > /dev/null
if [ -z "${NO_RELOAD:-}" ]; then sudo nginx -t > /dev/null 2>&1 && sudo systemctl reload nginx; fi
echo "ok: $name can sign in (login file: $FILE)"
