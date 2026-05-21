#!/usr/bin/env bash
# Minify index-source.html → index.html for deploy.
# Usage: ./build.sh
#
# Cuts the deployed bundle ~43% gzipped (137 KB → 78 KB).
# Run before every commit that touches index-source.html.

set -euo pipefail

cd "$(dirname "$0")"

SRC=index-source.html
DST=index.html

if [[ ! -f "$SRC" ]]; then
  echo "error: $SRC not found" >&2
  exit 1
fi

# Auto-bump CACHE_VERSION in sw.js so returning PWA users get a forced
# clean refresh on their next visit (otherwise stale-while-revalidate
# can serve them old code for an extra visit). Format: sf-vYYYYMMDD{a-z},
# rolls to next letter on multi-deploy days.
SW=sw.js
TODAY=$(date +%Y%m%d)
CURRENT=$(grep -oE "sf-v[0-9]{8}[a-z]" "$SW" | head -1 || echo "sf-v${TODAY}a")
# Robust extraction via sed (no off-by-one risk from bash substring).
CURRENT_DAY=$(echo "$CURRENT" | sed -E 's/^sf-v([0-9]{8})[a-z]$/\1/')
CURRENT_SUFFIX=$(echo "$CURRENT" | sed -E 's/^sf-v[0-9]{8}([a-z])$/\1/')
if [[ "$CURRENT_DAY" == "$TODAY" ]]; then
  # Same day, advance the letter (a → b → c …). Awk handles the char math
  # portably (bash arithmetic on chars varies between macOS/Linux).
  NEXT_SUFFIX=$(awk -v c="$CURRENT_SUFFIX" 'BEGIN{ printf "%c", index("abcdefghijklmnopqrstuvwxyz", c) + 97 }')
  NEW_VERSION="sf-v${TODAY}${NEXT_SUFFIX}"
else
  # New day, reset to 'a'
  NEW_VERSION="sf-v${TODAY}a"
fi
echo "Bumping CACHE_VERSION: $CURRENT → $NEW_VERSION"
# Use sed -i with empty backup arg for macOS compat
sed -i.bak "s/sf-v[0-9]\{8\}[a-z]/$NEW_VERSION/" "$SW" && rm -f "$SW.bak"

echo "Minifying $SRC → $DST ..."
npx -y html-minifier-terser@7 \
  --collapse-whitespace \
  --remove-comments \
  --minify-css true \
  --minify-js true \
  --remove-redundant-attributes \
  --remove-script-type-attributes \
  --use-short-doctype \
  "$SRC" -o "$DST"

src_kb=$(wc -c < "$SRC" | awk '{printf "%.0f", $1/1024}')
dst_kb=$(wc -c < "$DST" | awk '{printf "%.0f", $1/1024}')
src_gz=$(gzip -c "$SRC" | wc -c | awk '{printf "%.0f", $1/1024}')
dst_gz=$(gzip -c "$DST" | wc -c | awk '{printf "%.0f", $1/1024}')

echo
echo "  source:    ${src_kb} KB raw / ${src_gz} KB gzipped"
echo "  minified:  ${dst_kb} KB raw / ${dst_gz} KB gzipped"
echo "  reduction: $(awk -v a=$src_gz -v b=$dst_gz 'BEGIN{printf "%.0f%%", (a-b)/a*100}') (gzipped)"
echo
echo "Done. Commit + push to deploy."
