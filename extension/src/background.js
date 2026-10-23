// Background (service worker in Chrome, event page in Firefox).
// Owns the offline dictionary and the only network calls: user state and saving words
// to the personal vocabulary on chineseplus.club.

const SITE = 'https://www.chineseplus.club';
const COOKIE_URLS = [SITE, 'https://chineseplus.club'];
const USER_CACHE_MS = 5 * 60 * 1000;
const MAX_GROUPS = 4;

// ---------- dictionary ----------

let dictPromise = null;

/**
 * dict.tsv line: chinese \t trad \t pinyin \t russian ("|"-separated meanings) \t dictId
 * Map key is simplified or traditional word, value is the list of raw lines.
 */
function loadDict() {
  dictPromise ??= fetch(chrome.runtime.getURL('data/dict.tsv'))
    .then((res) => res.text())
    .then((text) => {
      const map = new Map();
      let maxLen = 1;
      let entries = 0;
      const add = (key, line) => {
        const list = map.get(key);
        if (list) list.push(line);
        else map.set(key, [line]);
        maxLen = Math.max(maxLen, [...key].length);
      };
      for (const line of text.split('\n')) {
        if (!line) continue;
        const tab1 = line.indexOf('\t');
        const tab2 = line.indexOf('\t', tab1 + 1);
        const chinese = line.slice(0, tab1);
        const trad = line.slice(tab1 + 1, tab2);
        add(chinese, line);
        if (trad) add(trad, line);
        entries++;
      }
      return { map, maxLen, entries };
    })
    .catch((err) => {
      dictPromise = null;
      throw err;
    });
  return dictPromise;
}

function parseLine(line) {
  const [chinese, trad, pinyin, russian, id] = line.split('\t');
  return { chinese, trad, pinyin, meanings: russian.split('|'), id };
}

/** Longest match first, then shorter words starting at the same character */
async function lookup(text) {
  const { map, maxLen } = await loadDict();
  const chars = [...text].slice(0, maxLen);
  const groups = [];
  for (let len = chars.length; len > 0 && groups.length < MAX_GROUPS; len--) {
    const word = chars.slice(0, len).join('');
    const lines = map.get(word);
    if (lines) groups.push({ word, len, entries: lines.map(parseLine) });
  }
  return { matchLen: groups[0]?.len || 0, groups };
}

// ---------- user and vocabulary ----------

async function getToken() {
  for (const url of COOKIE_URLS) {
    const cookie = await chrome.cookies.get({ url, name: 'token' }).catch(() => null);
    if (cookie?.value) return decodeURIComponent(cookie.value);
  }
  return '';
}

function api(path, token, method = 'GET') {
  return fetch(SITE + path, {
    method,
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
    body: method === 'POST' ? '{}' : undefined,
  });
}

let userCache = null; // { token, at, user, words: Set<string> }

async function getUser({ fresh = false } = {}) {
  const token = await getToken();
  if (!token) return null;
  if (!fresh && userCache?.token === token && Date.now() - userCache.at < USER_CACHE_MS) {
    return userCache;
  }
  const res = await api('/ext/me/', token);
  if (!res.ok) {
    userCache = null;
    return null;
  }
  const { user, words } = await res.json();
  userCache = { token, at: Date.now(), user, words: new Set(words) };
  return userCache;
}

async function getState() {
  const [{ enabled = false }, cache, dict] = await Promise.all([
    chrome.storage.local.get('enabled'),
    getUser().catch(() => null),
    loadDict().catch(() => null),
  ]);
  return {
    enabled,
    site: SITE,
    user: cache?.user || null,
    words: cache ? [...cache.words] : [],
    dictSize: dict?.entries || 0,
  };
}

async function setWordSaved({ id, chinese, saved }) {
  const cache = await getUser();
  if (!cache) return { ok: false, error: 'login' };
  const res = await api(`/ext/words/${id}/`, cache.token, saved ? 'POST' : 'DELETE');
  if (!res.ok) return { ok: false, error: 'server' };
  if (saved) cache.words.add(chinese);
  else cache.words.delete(chinese);
  return { ok: true };
}

chrome.cookies.onChanged.addListener(({ cookie }) => {
  if (cookie.name === 'token' && cookie.domain.endsWith('chineseplus.club')) userCache = null;
});

// ---------- on / off ----------

async function showBadge() {
  const { enabled = false } = await chrome.storage.local.get('enabled');
  await chrome.action.setBadgeBackgroundColor({ color: '#e84141' });
  await chrome.action.setBadgeText({ text: enabled ? 'ON' : '' });
}

async function toggle() {
  const { enabled = false } = await chrome.storage.local.get('enabled');
  await chrome.storage.local.set({ enabled: !enabled });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && 'enabled' in changes) showBadge();
});
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle') toggle();
});
chrome.runtime.onInstalled.addListener(showBadge);
chrome.runtime.onStartup.addListener(showBadge);

// ---------- messages from content script and popup ----------

const handlers = {
  lookup: (msg) => lookup(msg.text),
  getState: () => getState(),
  refreshUser: () => getUser({ fresh: true }).then(getState),
  setWordSaved: (msg) => setWordSaved(msg),
};

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  const handler = handlers[msg?.type];
  if (!handler) return false;
  handler(msg)
    .then(sendResponse)
    .catch((err) => sendResponse({ error: String(err?.message || err) }));
  return true;
});
