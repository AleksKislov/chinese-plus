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

VERSION=$(node -p "require('./manifest.json').version")
mkdir -p dist
ZIP="dist/chineseplus-$VERSION.zip"
rm -f "$ZIP"
zip -r -q -X "$ZIP" manifest.json background.js content.js content.css popup.html popup.js popup.css icons dict
echo "$ZIP: $(du -h "$ZIP" | cut -f1)"
