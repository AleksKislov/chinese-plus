/**
 * Dictionary lookups for the content script, from the files in dict/ (written by
 * server/scripts/export-extension-dictionary.js): no network, works offline.
 *
 * Message { type: 'lookup', text }
 *   -> { matches: [{ len, word, trad?, hsk?, entries: [[pinyin, senses]] }] }
 *   every dictionary word that is a prefix of `text`, longest first; `word` is the simplified
 *   form (the site's dictionary URL), `trad` the traditional form when that one was matched,
 *   `hsk` the word's lowest HSK 3.0 level ('1'..'6', '789').
 */
const api = globalThis.browser ?? globalThis.chrome;

const BUCKET_CACHE_SIZE = 64;
const bucketCache = new Map(); // n -> Promise<bucket>, most recently used last
let metaPromise = null;

const loadJson = async (file) => {
  const res = await fetch(api.runtime.getURL(`dict/${file}`));
  if (!res.ok) throw new Error(`dict/${file}: ${res.status}`);
  return res.json();
};

const getMeta = () => {
  metaPromise ??= loadJson('meta.json').catch((err) => {
    metaPromise = null;
    throw err;
  });
  return metaPromise;
};

async function getBucket(word) {
  const { buckets } = await getMeta();
  const n = word.codePointAt(0) % buckets;
  let bucket = bucketCache.get(n);
  if (bucket) {
    bucketCache.delete(n);
  } else {
    bucket = loadJson(`${n}.json`).catch((err) => {
      bucketCache.delete(n);
      throw err;
    });
  }
  bucketCache.set(n, bucket);
  if (bucketCache.size > BUCKET_CACHE_SIZE) bucketCache.delete(bucketCache.keys().next().value);
  return bucket;
}

// `h` (HSK 3.0 levels) is missing in dictionaries exported before it was added
const hskOf = (bucket, word) => bucket.h?.[word];

/** Entries of `key` as a simplified word, else through its traditional form. */
async function findWord(key) {
  const bucket = await getBucket(key);
  if (bucket.w[key]) return [{ word: key, hsk: hskOf(bucket, key), entries: bucket.w[key] }];
  const simplified = bucket.t[key];
  if (!simplified) return [];
  const found = await Promise.all(
    simplified.map(async (word) => {
      const wordBucket = await getBucket(word);
      const entries = wordBucket.w[word];
      return entries ? { word, trad: key, hsk: hskOf(wordBucket, word), entries } : null;
    }),
  );
  return found.filter(Boolean);
}

async function lookup(text) {
  const { maxLen } = await getMeta();
  const chars = [...text].slice(0, maxLen);
  const matches = [];
  for (let len = chars.length; len > 0; len--) {
    const found = await findWord(chars.slice(0, len).join(''));
    for (const match of found) matches.push({ len, ...match });
  }
  return { matches };
}

api.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'lookup' || typeof message.text !== 'string') return false;
  lookup(message.text)
    .then(sendResponse)
    .catch((err) => sendResponse({ matches: [], error: String(err) }));
  return true; // async response
});

// keyboard shortcut (desktop): the content scripts follow `enabled` in storage
api.commands?.onCommand.addListener(async (command) => {
  if (command !== 'toggle-enabled') return;
  const { enabled = true } = await api.storage.local.get('enabled');
  await api.storage.local.set({ enabled: !enabled });
});

// badges are not supported everywhere (e.g. some mobile browsers): only a hint, never fails
const updateBadge = async (enabled) => {
  try {
    await api.action.setBadgeText({ text: enabled ? '' : 'off' });
    await api.action.setBadgeBackgroundColor?.({ color: '#6b7280' });
  } catch {
    // ignore
  }
};
api.storage.local.get('enabled').then(
  ({ enabled = true }) => updateBadge(enabled),
  () => {},
);
api.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enabled) updateBadge(changes.enabled.newValue !== false);
});
