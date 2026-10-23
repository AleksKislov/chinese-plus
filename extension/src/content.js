// Content script: finds the Chinese character under the mouse, asks the background for
// dictionary matches and shows them in a popup (Shadow DOM, so page styles don't leak in).

(() => {
  if (window.__chinesePlusExt) return;
  window.__chinesePlusExt = true;

  const HAN_RE = /\p{Script=Han}/u;
  const GATHER_CHARS = 8;
  const HIDE_DELAY_MS = 250;
  const STATE_TTL_MS = 30 * 1000;
  const HIGHLIGHT = 'chineseplus-ext-match';

  let enabled = false;
  let state = null; // { site, user, words: Set<string>, at }
  let host = null;
  let root = null;
  let popupEl = null;
  let visible = false;
  let lastHit = null;
  let lookupSeq = 0;
  let hideTimer = 0;
  let rafPending = false;
  let lastEvent = null;

  // rejects with "Extension context invalidated" after the extension is updated/reloaded
  const send = (msg) => chrome.runtime.sendMessage(msg).catch(() => null);

  // ---------- on / off ----------

  chrome.storage.local.get('enabled').then(({ enabled }) => setEnabled(!!enabled));
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && 'enabled' in changes) setEnabled(!!changes.enabled.newValue);
  });

  function setEnabled(value) {
    if (value === enabled) return;
    enabled = value;
    const method = enabled ? 'addEventListener' : 'removeEventListener';
    document[method]('mousemove', onMouseMove, { passive: true });
    document[method]('mousedown', onMouseDown, true);
    document[method]('keydown', onKeyDown, true);
    window[method]('scroll', hide, { capture: true, passive: true });
    if (!enabled) hide();
  }

  function onMouseMove(e) {
    lastEvent = e;
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      handleMove(lastEvent);
    });
  }

  function onMouseDown(e) {
    if (visible && e.target !== host) hide();
  }

  function onKeyDown(e) {
    if (visible && e.key === 'Escape') hide();
  }

  // ---------- finding text under the cursor ----------

  function caretAt(x, y) {
    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      return pos && { node: pos.offsetNode, offset: pos.offset };
    }
    const range = document.caretRangeFromPoint?.(x, y);
    return range && { node: range.startContainer, offset: range.startOffset };
  }

  function charRect(node, index) {
    const range = document.createRange();
    range.setStart(node, index);
    range.setEnd(node, index + String.fromCodePoint(node.data.codePointAt(index)).length);
    return range.getBoundingClientRect();
  }

  /** Index of the code point that contains code unit i (steps back from a low surrogate) */
  function codePointStart(text, i) {
    const code = text.charCodeAt(i);
    return code >= 0xdc00 && code <= 0xdfff && i > 0 ? i - 1 : i;
  }

  /** Han character exactly under the point, or null */
  function hanAt(x, y) {
    const caret = caretAt(x, y);
    if (!caret || caret.node?.nodeType !== Node.TEXT_NODE) return null;
    const { node } = caret;
    // the caret lands before or after the character, depending on which half is hovered
    for (const candidate of [caret.offset, caret.offset - 1]) {
      if (candidate < 0 || candidate >= node.data.length) continue;
      const i = codePointStart(node.data, candidate);
      if (!HAN_RE.test(String.fromCodePoint(node.data.codePointAt(i)))) continue;
      const rect = charRect(node, i);
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return { node, offset: i };
      }
    }
    return null;
  }

  /** Han run starting at node/offset, possibly spanning several text nodes */
  function gather(node, offset) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    walker.currentNode = node;
    const parts = [];
    let text = '';
    let count = 0;
    let current = node;
    let start = offset;
    while (current && count < GATHER_CHARS) {
      const data = current.data;
      let i = start;
      let stopped = false;
      while (i < data.length && count < GATHER_CHARS) {
        const ch = String.fromCodePoint(data.codePointAt(i));
        if (!HAN_RE.test(ch)) {
          stopped = true;
          break;
        }
        text += ch;
        i += ch.length;
        count++;
      }
      if (i > start) parts.push({ node: current, start, end: i });
      if (stopped) break;
      current = walker.nextNode();
      start = 0;
    }
    return { text, parts };
  }

  /** Range covering the first `len` characters of the gathered parts */
  function matchRange(parts, len) {
    const range = document.createRange();
    range.setStart(parts[0].node, parts[0].start);
    let left = len;
    for (const part of parts) {
      let i = part.start;
      while (i < part.end && left > 0) {
        i += String.fromCodePoint(part.node.data.codePointAt(i)).length;
        left--;
      }
      range.setEnd(part.node, i);
      if (left === 0) break;
    }
    return range;
  }

  async function handleMove(e) {
    if (!enabled || !e) return;
    if (e.target === host) {
      clearTimeout(hideTimer);
      return;
    }
    const hit = hanAt(e.clientX, e.clientY);
    if (!hit) {
      lastHit = null;
      scheduleHide();
      return;
    }
    clearTimeout(hideTimer);

    if (hit.node === lastHit?.node && hit.offset === lastHit.offset) return;
    lastHit = hit;
    const { text, parts } = gather(hit.node, hit.offset);

    const seq = ++lookupSeq;
    const [result] = await Promise.all([send({ type: 'lookup', text }), ensureState()]);
    if (seq !== lookupSeq || !enabled) return;
    if (!result?.groups?.length) {
      hide();
      return;
    }
    const range = matchRange(parts, result.matchLen);
    highlight(range);
    show(result.groups, range.getClientRects()[0] || range.getBoundingClientRect());
  }

  // ---------- user state ----------

  async function ensureState(force = false) {
    if (!force && state && Date.now() - state.at < STATE_TTL_MS) return;
    const fresh = await send({ type: force ? 'refreshUser' : 'getState' });
    if (fresh && !fresh.error) state = { ...fresh, words: new Set(fresh.words), at: Date.now() };
  }

  // ---------- highlight ----------

  let highlightStyleAdded = false;

  function highlight(range) {
    if (!window.CSS?.highlights || typeof Highlight === 'undefined') return;
    if (!highlightStyleAdded) {
      const style = document.createElement('style');
      style.textContent = `::highlight(${HIGHLIGHT}) { background-color: rgba(250, 204, 21, 0.45); }`;
      (document.head || document.documentElement).appendChild(style);
      highlightStyleAdded = true;
    }
    CSS.highlights.set(HIGHLIGHT, new Highlight(range));
  }

  function clearHighlight() {
    window.CSS?.highlights?.delete(HIGHLIGHT);
  }

  // ---------- popup ----------

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const child of [].concat(children)) if (child) node.append(child);
    return node;
  }

  function ensurePopup() {
    if (host?.isConnected) return;
    host = document.createElement('chineseplus-ext-popup');
    host.style.cssText =
      'all: initial; position: fixed; top: 0; left: 0; z-index: 2147483647; display: none;';
    root = host.attachShadow({ mode: 'closed' });
    root.append(el('style', { text: POPUP_CSS }));
    popupEl = el('div', { class: 'pop' });
    root.append(popupEl);
    host.addEventListener('mouseleave', scheduleHide);
    host.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    document.documentElement.append(host);
  }

  function saveButton(entry) {
    const isSaved = () => state?.words.has(entry.chinese);
    const btn = el('button', { class: 'save', type: 'button' });
    const render = (label) => {
      btn.textContent = label || (isSaved() ? '★ В моих словах' : '☆ В мои слова');
      btn.classList.toggle('saved', isSaved());
    };
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      btn.disabled = true;
      const saved = !isSaved();
      const res = await send({ type: 'setWordSaved', id: entry.id, chinese: entry.chinese, saved });
      btn.disabled = false;
      if (res?.ok) {
        if (saved) state.words.add(entry.chinese);
        else state.words.delete(entry.chinese);
        render();
      } else if (res?.error === 'login') {
        await ensureState(true);
        renderPopupFooter();
        render('Войдите на сайте');
      } else {
        render('Ошибка, попробуйте ещё раз');
      }
    });
    render();
    return btn;
  }

  function entryBlock(entry, showHead) {
    const site = state?.site || 'https://www.chineseplus.club';
    return el('div', { class: 'entry' }, [
      showHead &&
        el('div', { class: 'head' }, [
          el('span', { class: 'hz', text: entry.chinese }),
          entry.trad && el('span', { class: 'trad', text: entry.trad }),
        ]),
      el('div', { class: 'py', text: entry.pinyin }),
      el(
        'div',
        { class: 'ru' },
        entry.meanings.map((m) => el('div', { text: m })),
      ),
      el('div', { class: 'actions' }, [
        state?.user && saveButton(entry),
        el('a', {
          href: `${site}/dictionary/${encodeURIComponent(entry.chinese)}/`,
          target: '_blank',
          rel: 'noopener',
          text: 'Подробнее ↗',
        }),
      ]),
    ]);
  }

  function renderPopupFooter() {
    popupEl.querySelector('.foot')?.remove();
    if (state?.user) return;
    const site = state?.site || 'https://www.chineseplus.club';
    popupEl.append(
      el('div', { class: 'foot' }, [
        el('a', { href: `${site}/login/`, target: '_blank', rel: 'noopener', text: 'Войдите' }),
        ' на chineseplus.club, чтобы сохранять слова',
      ]),
    );
  }

  function show(groups, anchor) {
    ensurePopup();
    popupEl.replaceChildren(
      ...groups.map((group) =>
        el(
          'div',
          { class: 'group' },
          group.entries.map((entry, i) => entryBlock(entry, i === 0)),
        ),
      ),
    );
    renderPopupFooter();

    host.style.display = 'block';
    visible = true;
    const { width, height } = popupEl.getBoundingClientRect();
    const gap = 6;
    let top = anchor.bottom + gap;
    if (top + height > window.innerHeight && anchor.top - gap - height > 0) {
      top = anchor.top - gap - height;
    }
    const left = Math.max(4, Math.min(anchor.left, window.innerWidth - width - 8));
    host.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  }

  function scheduleHide() {
    if (!visible) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, HIDE_DELAY_MS);
  }

  function hide() {
    clearTimeout(hideTimer);
    lookupSeq++;
    visible = false;
    clearHighlight();
    if (host) host.style.display = 'none';
  }

  const POPUP_CSS = `
    .pop {
      --bg: #ffffff; --fg: #1f2937; --muted: #6b7280; --line: #e5e7eb;
      --accent: #e84141; --py: #0f766e; --saved: #16a34a;
      box-sizing: border-box; width: max-content; max-width: min(360px, calc(100vw - 16px));
      max-height: 60vh; overflow: auto; padding: 10px 12px;
      background: var(--bg); color: var(--fg); border: 1px solid var(--line); border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
      font: 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; text-align: left;
    }
    @media (prefers-color-scheme: dark) {
      .pop { --bg: #1f2937; --fg: #f3f4f6; --muted: #9ca3af; --line: #374151; --py: #5eead4; --saved: #4ade80; }
    }
    .group + .group { margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--line); }
    .entry + .entry { margin-top: 6px; }
    .head { display: flex; align-items: baseline; gap: 8px; }
    .hz { font-size: 24px; line-height: 1.2; font-family: "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif; }
    .trad { font-size: 16px; color: var(--muted); font-family: "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif; }
    .py { color: var(--py); font-weight: 600; }
    .ru { margin-top: 2px; }
    .actions { display: flex; align-items: center; gap: 12px; margin-top: 4px; font-size: 12px; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .save {
      all: unset; cursor: pointer; color: var(--accent); font-size: 12px;
    }
    .save:hover { text-decoration: underline; }
    .save.saved { color: var(--saved); }
    .save:disabled { opacity: 0.5; cursor: wait; }
    .foot { margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
  `;
})();
