/**
 * Offline dictionary search for the extension's own pages (popup.html, dictionary.html):
 * Chinese text typed or pasted is split into dictionary words (the longest word from each
 * position, as the popup on pages does) and looked up in dict/ through background.js. Pinyin and
 * Russian need an index the extension doesn't ship: those go to the site's dictionary.
 * Needs lib.js. Exposes globalThis.ChinesePlusSearch.mount().
 */
(() => {
  const api = globalThis.browser ?? globalThis.chrome;
  const lib = globalThis.ChinesePlusLib;
  const { el, dictionaryUrl, icon, hskLabel, entryText } = lib;

  const HAN_RE = /\p{Script=Han}/u;
  const MAX_WORD_LEN = 4; // longest dictionary word, see server/scripts/export-extension-dictionary.js
  const MAX_SEGMENTS = 40; // a pasted paragraph: the first words only
  const MAX_QUERY_LEN = 400;
  const DEBOUNCE_MS = 250;
  // a single word searched and left on screen this long counts as looked up (history)
  const REMEMBER_IDLE_MS = 1500;
  const COPIED_MS = 1200;

  const siteSearchUrl = (query) =>
    `${lib.SITE_URL}/dictionary/${encodeURIComponent(query)}?utm_source=browser_extension`;

  const lookup = (text) =>
    Promise.resolve(api.runtime.sendMessage({ type: 'lookup', text }))
      .then((response) => response?.matches || [])
      .catch(() => []);

  /**
   * The query's Chinese words, in order: [{ text, matches }]; `matches` as background.js returns
   * them (longest first), empty for a character not in the dictionary. Other characters are
   * skipped.
   */
  async function segment(query) {
    const chars = [...query];
    const segments = [];
    let i = 0;
    while (i < chars.length && segments.length < MAX_SEGMENTS) {
      if (!HAN_RE.test(chars[i])) {
        i++;
        continue;
      }
      let end = i;
      while (end < chars.length && end - i < MAX_WORD_LEN && HAN_RE.test(chars[end])) end++;
      const matches = await lookup(chars.slice(i, end).join(''));
      const len = matches[0]?.len || 1;
      segments.push({ text: chars.slice(i, i + len).join(''), matches });
      i += len;
    }
    return segments;
  }

  // ---------- results ----------

  function linkButton(className, text, href, title) {
    const link = el('a', className, text);
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener';
    if (title) {
      link.title = title;
      link.setAttribute('aria-label', title);
    }
    return link;
  }

  function iconButton(name, title, onClick) {
    const button = el('button', 'icon');
    button.type = 'button';
    button.title = title;
    button.setAttribute('aria-label', title);
    button.append(icon(name));
    button.addEventListener('click', onClick);
    return button;
  }

  function copyButton(name, title, getText) {
    const button = iconButton(name, title, async () => {
      const copied = await lib.copyText(getText());
      button.replaceChildren(icon(copied ? 'check' : name));
      button.title = copied ? 'Скопировано' : 'Не удалось скопировать';
      setTimeout(() => {
        button.replaceChildren(icon(name));
        button.title = title;
      }, COPIED_MS);
    });
    return button;
  }

  /** One dictionary word: the same layout as the popup on pages (content.js renderMatch). */
  function renderMatch(match, toneColors) {
    const { word, trad, hsk, entries } = match;
    const block = el('div', 'match');
    const head = el('div', 'head');
    head.append(el('span', 'hanzi', word));
    if (trad) head.append(el('span', 'trad', trad));
    const single = entries.length === 1;
    if (single && entries[0][0]) {
      head.append(lib.pinyinEl('span', 'head-pinyin', entries[0][0], toneColors));
    }
    if (hsk) {
      const badge = el('span', 'hsk', `HSK ${hskLabel(hsk)}`);
      badge.title = `Слово из списка HSK 3.0, уровень ${hskLabel(hsk)}`;
      head.append(badge);
    }

    const actions = el('div', 'actions');
    actions.append(
      linkButton('icon text', 'Подробнее ↗', dictionaryUrl(word), 'Примеры, порядок черт и другое на сайте'),
    );
    const add = linkButton('icon', '', `${dictionaryUrl(word)}&add=1`, 'Добавить в мои слова на сайте');
    add.append(icon('plus'));
    actions.append(add);
    if (lib.canSpeak()) actions.append(iconButton('speaker', 'Произнести', () => lib.speak(word)));
    actions.append(
      copyButton('copy', 'Копировать слово', () => word),
      copyButton('entry', 'Копировать слово с переводом', () => entryText(match)),
    );
    block.append(head, actions);

    for (const [pinyin, senses] of entries) {
      const entry = el('div', 'entry');
      if (!single && pinyin) entry.append(lib.pinyinEl('div', 'head-pinyin', pinyin, toneColors));
      const body = el('div', 'senses');
      senses.forEach((sense) => body.append(lib.renderSense(sense, toneColors)));
      entry.append(body);
      block.append(entry);
    }
    const refs = lib.renderRefs(match.refs, toneColors); // "см. 一会儿": 一会儿's meaning
    if (refs) block.append(refs);
    return block;
  }

  function note(text, href, linkText) {
    const p = el('p', 'search-note', text);
    if (href) p.append(' ', linkButton('', linkText, href));
    return p;
  }

  /**
   * Search box: `input` (text field), `results` (container). Settings (tone colors, words inside
   * the word) come from storage.local like the popup on pages. Returns { search(query) } for a
   * query set from outside (dictionary.html#q=…); `onQuery(query)` is told every new query.
   */
  function mount({ input, results, onQuery }) {
    let toneColors = false;
    let showParts = true;
    let timer = 0;
    let rememberTimer = 0;
    let run = 0; // drops results of a query typed over

    async function search(raw) {
      clearTimeout(rememberTimer);
      const query = raw.trim().slice(0, MAX_QUERY_LEN);
      const id = ++run;
      onQuery?.(query);
      if (!query) {
        results.replaceChildren();
        return;
      }
      if (!HAN_RE.test(query)) {
        results.replaceChildren(
          note(
            'Здесь ищутся китайские слова. Пиньинь и русские слова ищите на сайте:',
            siteSearchUrl(query),
            `«${query}» в словаре ↗`,
          ),
        );
        return;
      }
      const segments = await segment(query);
      if (id !== run) return;

      const nodes = [];
      if (segments.length > 1) {
        // a phrase: its words first, each one jumps to its entry below
        const strip = el('div', 'words');
        segments.forEach(({ text, matches }, n) => {
          const chip = el('button', matches.length ? 'word-chip' : 'word-chip missing', text);
          chip.type = 'button';
          chip.addEventListener('click', () =>
            results.querySelector(`[data-segment="${n}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          );
          strip.append(chip);
        });
        nodes.push(strip);
      }
      segments.forEach(({ text, matches }, n) => {
        const box = el('div', 'result');
        box.dataset.segment = String(n);
        if (!matches.length) {
          box.append(note(`${text} — нет в словаре расширения.`, siteSearchUrl(text), 'Искать на сайте ↗'));
        } else {
          // one word searched: also the shorter words inside it (a setting, as in the popup);
          // a phrase: the word found at each position
          const shown = segments.length === 1 && showParts ? matches : matches.filter((m) => m.len === matches[0].len);
          shown.forEach((match) => box.append(renderMatch(match, toneColors)));
        }
        nodes.push(box);
      });
      nodes.push(note('', siteSearchUrl(query), 'Искать на сайте: примеры, порядок черт ↗'));
      results.replaceChildren(...nodes);

      // a word looked up on purpose: into the list of looked-up words, unless typed over soon
      const [first] = segments;
      if (segments.length === 1 && first.matches.length) {
        rememberTimer = setTimeout(() => {
          Promise.resolve(api.runtime.sendMessage({ type: 'remember', word: first.matches[0].word })).catch(() => {});
        }, REMEMBER_IDLE_MS);
      }
    }

    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => search(input.value), DEBOUNCE_MS);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing) return; // Enter that picks a character in an IME
      clearTimeout(timer);
      search(input.value);
    });

    api.storage.local.get(['toneColors', 'showParts']).then((stored) => {
      toneColors = stored.toneColors === true;
      showParts = stored.showParts !== false;
      if (input.value.trim()) search(input.value);
    });

    return {
      search(query) {
        input.value = query;
        search(query);
      },
    };
  }

  globalThis.ChinesePlusSearch = { mount };
})();
