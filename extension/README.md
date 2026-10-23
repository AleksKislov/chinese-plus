# ChinesePlus browser extension

Hover over Chinese text on any site to see pinyin and a short Russian translation, like
Perapera / Zhongwen. One codebase for Chrome and Firefox (the Chrome build also works in
Edge, Yandex Browser, Opera and Brave). Plain JS, no dependencies.

- **Offline dictionary**: `src/data/dict.tsv`, exported from our `dictionaries` collection
  (words of 1–3 characters by default, translations trimmed). Loaded into a `Map` in the
  background script; lookup is longest match from the hovered character.
- **Online only for the vocabulary**: if the user is logged in on chineseplus.club (the
  extension reads the site's `token` cookie), the popup shows "☆ В мои слова". Saved words
  appear on `/me/words`.

## Layout

```
src/manifest.json      shared manifest (build adds the per-browser background key)
src/background.js      dictionary, lookup, user state, save/remove word
src/content.js         text under cursor, highlight, popup (Shadow DOM)
src/popup/             toolbar popup: on/off, login status
src/data/dict.tsv      generated, not in git
scripts/build.mjs      dist/chrome, dist/firefox + zips
```

Site side: `qwik/src/routes/ext/` (FE server endpoints the extension calls, they forward to
the BE because it isn't public) and `server/scripts/export-extension-dict.js`.

## Build

```bash
# 1. export the dictionary (uses server/config/.env.prod, or .env.dev with NODE_ENV=development)
cd server && node scripts/export-extension-dict.js            # --max-len=2 --max-ru=150 to shrink

# 2. build both browsers
cd extension && npm run build                                  # or build:dev to skip zips
```

Bump `version` in `src/manifest.json` before each store upload.

## Try it locally

- Chrome: `chrome://extensions` → Developer mode → Load unpacked → `extension/dist/chrome`
- Firefox: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on →
  `extension/dist/firefox/manifest.json`

The extension talks to `https://www.chineseplus.club` (`SITE` in `background.js`), so saving
words needs the `/ext/*` endpoints deployed there. To test saving against a local site (BE on
:10000, `npm run dev` in `qwik/`), build with `node scripts/build.mjs --site=http://localhost:5173`
and log in on localhost. That build gets no zips, so it can't be uploaded by mistake.

## Publish

- Chrome Web Store: developer account ($5 once), upload `dist/chineseplus-chrome-*.zip`.
- Firefox Add-ons (AMO): free account, upload `dist/chineseplus-firefox-*.zip`. The add-on id
  is `extension@chineseplus.club`; `data_collection_permissions` declares the auth token.

Both stores ask for a privacy policy, because the extension reads the site's login cookie and
sends it to chineseplus.club when saving a word. Nothing else leaves the browser.
