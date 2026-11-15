const api = globalThis.browser ?? globalThis.chrome;

// on / off settings: checkbox id = storage key, and its value when nothing is stored yet
const SWITCHES = {
  enabled: true,
  showParts: true,
  toneColors: false,
  requireShift: false,
  saveHistory: true,
};

const themeInputs = [...document.querySelectorAll('input[name="theme"]')];

// 'auto' follows the system; the tooltips on pages use the same setting (content.js)
const applyTheme = (theme) => {
  const value = ['light', 'dark'].includes(theme) ? theme : 'auto';
  document.documentElement.dataset.theme = value;
  themeInputs.forEach((input) => (input.checked = input.value === value));
};

api.storage.local.get(['theme', ...Object.keys(SWITCHES)]).then((stored) => {
  for (const [key, byDefault] of Object.entries(SWITCHES)) {
    document.getElementById(key).checked = typeof stored[key] === 'boolean' ? stored[key] : byDefault;
  }
  applyTheme(stored.theme);
});

for (const key of Object.keys(SWITCHES)) {
  const input = document.getElementById(key);
  input.addEventListener('change', () => api.storage.local.set({ [key]: input.checked }));
}

themeInputs.forEach((input) =>
  input.addEventListener('change', () => {
    applyTheme(input.value);
    api.storage.local.set({ theme: input.value });
  }),
);

// ---------- looked-up words (recorded by background.js) ----------

const { SITE_URL } = globalThis.ChinesePlusLib; // lib.js
const PREVIEW_WORDS = 12;
const CLEAR_CONFIRM_MS = 3000;

const historyCount = document.getElementById('history-count');
const historyWords = document.getElementById('history-words');
const historyEmpty = document.getElementById('history-empty');
const historyActions = document.getElementById('history-actions');
const historySend = document.getElementById('history-send');
const historyClear = document.getElementById('history-clear');

/**
 * The site's page that offers to add the words to the user's words. The list goes in the URL
 * fragment (#): it never reaches a server or its logs, and 300 words don't fit a query string.
 * "word:times looked up", the most recent first.
 */
const importUrl = (history) =>
  `${SITE_URL}/dictionary/import?utm_source=browser_extension#w=${encodeURIComponent(
    history.map(([word, times]) => `${word}:${times}`).join(','),
  )}`;

function showHistory(history = []) {
  historyCount.textContent = String(history.length);
  historyEmpty.hidden = history.length > 0;
  historyActions.hidden = history.length === 0;
  const preview = history.slice(0, PREVIEW_WORDS).map(([word]) => word);
  historyWords.textContent = preview.join('、') + (history.length > PREVIEW_WORDS ? '…' : '');
  historyWords.hidden = history.length === 0;
  historySend.href = history.length ? importUrl(history) : '#';
}

api.storage.local.get('history').then(({ history }) => showHistory(history));
api.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.history) showHistory(changes.history.newValue);
});

// two presses: the list can't be restored
let clearTimer = 0;
historyClear.addEventListener('click', () => {
  if (!historyClear.classList.contains('confirm')) {
    historyClear.classList.add('confirm');
    historyClear.textContent = 'Точно?';
    clearTimer = setTimeout(() => {
      historyClear.classList.remove('confirm');
      historyClear.textContent = 'Очистить';
    }, CLEAR_CONFIRM_MS);
    return;
  }
  clearTimeout(clearTimer);
  historyClear.classList.remove('confirm');
  historyClear.textContent = 'Очистить';
  api.storage.local.set({ history: [] });
});

// ---------- offline dictionary search (search.js) ----------

const searchInput = document.getElementById('search');
let searchQuery = '';
globalThis.ChinesePlusSearch.mount({
  input: searchInput,
  results: document.getElementById('search-results'),
  onQuery: (query) => (searchQuery = query),
});
// on a phone the field would open the keyboard over the menu: focus it on desktop only
if (matchMedia('(hover: hover) and (pointer: fine)').matches) searchInput.focus();

// the same search on a page of its own: a tab can stay open next to the text being read
document.getElementById('open-tab').addEventListener('click', (e) => {
  e.preventDefault();
  const hash = searchQuery ? `#q=${encodeURIComponent(searchQuery)}` : '';
  api.tabs.create({ url: api.runtime.getURL(`dictionary.html${hash}`) }).then(() => window.close(), () => {});
});

// keyboard shortcuts exist only in desktop browsers: show the one actually assigned, if any
async function showShortcut() {
  const commands = await api.commands?.getAll?.();
  const shortcut = commands?.find((c) => c.name === 'toggle-enabled')?.shortcut;
  if (!shortcut) return;
  const hint = document.getElementById('shortcut-hint');
  hint.textContent = `Включить / выключить: ${shortcut}`;
  hint.hidden = false;
}
showShortcut().catch(() => {});
