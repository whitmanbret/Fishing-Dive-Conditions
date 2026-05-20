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
