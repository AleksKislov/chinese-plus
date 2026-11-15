// dictionary.html: the offline search of the menu (search.js) on a page of its own. The query is
// kept in the address (#q=…), so back / forward, a reload and a bookmark keep it.
const api = globalThis.browser ?? globalThis.chrome;

const BASE_TITLE = document.title;

// the same theme as the menu and the popup on pages
const applyTheme = (theme) => {
  document.documentElement.dataset.theme = ['light', 'dark'].includes(theme) ? theme : 'auto';
};
api.storage.local.get('theme').then(({ theme }) => applyTheme(theme));
api.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.theme) applyTheme(changes.theme.newValue);
});

const queryFromHash = () => new URLSearchParams(location.hash.slice(1)).get('q') || '';

const search = globalThis.ChinesePlusSearch.mount({
  input: document.getElementById('search'),
  results: document.getElementById('search-results'),
  onQuery: (query) => {
    document.title = query ? `${query} — ${BASE_TITLE}` : BASE_TITLE;
    const hash = query ? `#q=${encodeURIComponent(query)}` : '';
    if (hash !== location.hash) history.replaceState(null, '', `${location.pathname}${hash}`);
  },
});

const initial = queryFromHash();
if (initial) search.search(initial);
window.addEventListener('hashchange', () => {
  const query = queryFromHash();
  if (query !== document.getElementById('search').value.trim()) search.search(query);
});
