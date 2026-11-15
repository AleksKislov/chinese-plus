#!/bin/sh
# Packs the extension into dist/chineseplus-<version>.zip, the same zip for the Chrome Web Store,
# Edge Add-ons, Opera / Yandex and Firefox Add-ons (AMO).
# Run server/scripts/export-extension-dictionary.js first: it fills dict/.
set -e
cd "$(dirname "$0")"

if [ ! -f dict/meta.json ]; then
  echo "dict/ is empty: run 'node scripts/export-extension-dictionary.js' in server/ first" >&2
  exit 1
fi

FILES="manifest.json background.js lib.js content.js content.css search.js results.css
  popup.html popup.js popup.css dictionary.html dictionary.js dictionary.css icons dict"
VERSION=$(node -p "require('./manifest.json').version")
mkdir -p dist
ZIP="dist/chineseplus-$VERSION.zip"
rm -f "$ZIP"
# shellcheck disable=SC2086
zip -r -q -X "$ZIP" $FILES
echo "$ZIP: $(du -h "$ZIP" | cut -f1)"
