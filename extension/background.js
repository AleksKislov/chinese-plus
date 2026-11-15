/**
 * Dictionary lookups for the content script, from the files in dict/ (written by
 * server/scripts/export-extension-dictionary.js): no network, works offline.
 *
 * Message { type: 'lookup', text }
 *   -> { matches: [{ len, word, trad?, hsk?, entries: [[pinyin, senses]] }] }
 *   every dictionary word that is a prefix of `text`, longest first; `word` is the simplified
 *   form (the site's dictionary URL), `trad` the traditional form when that one was matched,
 *   `hsk` the word's lowest HSK 3.0 level ('1'..'6', '789'),
 *   `refs` { "<word>": entries } of the words that a reference-only entry points to
 *   (一会: "см. 一会儿"), so the popup shows their meaning too.
 *
 * Message { type: 'remember', word }: the user looked the word up (content.js decides when);
 *   kept in storage.local `history` for popup.html, which sends the list to the site.
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

// ---------- reference-only entries ----------
// ~6% of the entries say only "see <other word>" (一会 -> 一会儿, 搀和 -> 掺和): the word they point
// to is looked up as well, one level deep.

// a little text around the link is still "only a reference": "см.", "то же, что", "уст."
const REF_TEXT_MAX = 20;
const MAX_REFS_PER_MATCH = 3;
const MAX_REF_LEN = 4; // the dictionary's longest word, see export-extension-dictionary.js

const leavesOf = (senses) => {
  const leaves = [];
  const walk = (node) => {
    if (node.c || node.t) leaves.push(node);
    node.s?.forEach(walk);
  };
  senses.forEach(walk);
  return leaves;
};

/** The words an entry points to, when every line of its meaning is just a reference; else []. */
function refsOfEntry(senses) {
  const leaves = leavesOf(senses);
  const refs = [];
  for (const leaf of leaves) {
    const links = leaf.c?.filter((inline) => Array.isArray(inline) && inline[0] === 'r') || [];
    const text = (leaf.c || [])
      .filter((inline) => typeof inline === 'string')
      .join('')
      .replace(/[\s.,;:()]/g, '');
    if (!links.length || text.length > REF_TEXT_MAX) return [];
    links.forEach(([, word]) => refs.push(word));
  }
  return refs;
}

const isRefOnly = (entries) => entries.every(([, senses]) => refsOfEntry(senses).length > 0);

/** { word: entries } of the words the match's reference-only entries point to. */
async function resolveRefs(match) {
  const words = [];
  for (const [, senses] of match.entries) {
    for (const word of refsOfEntry(senses)) {
      if (word !== match.word && word !== match.trad && !words.includes(word)) words.push(word);
    }
  }
  const refs = {};
  for (const word of words.slice(0, MAX_REFS_PER_MATCH)) {
    // a word longer than the dictionary's 4 characters isn't in it (一战 -> 第一次世界大战)
    const [found] = [...word].length > MAX_REF_LEN ? [] : await findWord(word);
    // a reference to another reference adds nothing: the link stays
    if (found && !isRefOnly(found.entries)) refs[word] = found.entries;
  }
  return Object.keys(refs).length ? refs : null;
}

async function lookup(text) {
  const { maxLen } = await getMeta();
  const chars = [...text].slice(0, maxLen);
  const matches = [];
  for (let len = chars.length; len > 0; len--) {
    const found = await findWord(chars.slice(0, len).join(''));
    for (const match of found) {
      const refs = await resolveRefs(match).catch(() => null);
      matches.push(refs ? { len, ...match, refs } : { len, ...match });
    }
  }
  return { matches };
}

// ---------- looked-up words ----------
// `history`: [[word, times looked up, last time (ms)], ...], the most recent first, at most
// HISTORY_MAX. Only on this device: popup.html opens the site with it when the user asks.
const HISTORY_MAX = 300;
const MAX_WORD_LEN = 8; // UTF-16 units: 4 characters, all outside the BMP
const HAN_ONLY_RE = /^\p{Script=Han}+$/u;
// one write after another: tabs looking words up at the same time don't overwrite each other
let historyQueue = Promise.resolve();

function remember(word) {
  historyQueue = historyQueue
    .then(async () => {
      const { history = [], saveHistory } = await api.storage.local.get(['history', 'saveHistory']);
      if (saveHistory === false) return;
      const old = history.find(([w]) => w === word);
      const rest = history.filter(([w]) => w !== word);
      const entry = [word, (old?.[1] || 0) + 1, Date.now()];
      await api.storage.local.set({ history: [entry, ...rest].slice(0, HISTORY_MAX) });
    })
    .catch(() => {});
}

api.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'remember') {
    const { word } = message;
    // nothing from private windows
    const valid = typeof word === 'string' && word.length <= MAX_WORD_LEN && HAN_ONLY_RE.test(word);
    if (valid && !sender.tab?.incognito) remember(word);
    return false;
  }
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
