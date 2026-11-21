/**
 * Popup dictionary: hover (mouse) or tap (touch) a chinese character to see the longest
 * dictionary word that starts there, and the shorter ones, with pinyin and meanings.
 * Lookups go to background.js (offline dictionary in dict/). The popup lives in a closed
 * shadow root, so page styles don't reach it, and is built with DOM APIs only (no innerHTML).
 */
(() => {
  const api = globalThis.browser ?? globalThis.chrome;

  const MAX_LEN = 4; // longest dictionary word, see server/scripts/export-extension-dictionary.js
  const MOVE_THROTTLE_MS = 30;
  // on the way to the popup the pointer crosses other words; it switches to the word under it
  // only if it stops there for this long
  const SETTLE_MS = 200;
  const LOOKUP_CACHE_SIZE = 300;
  const HIGHLIGHT_NAME = 'chineseplus-word'; // styled in content.css
  const HAN_RE = /\p{Script=Han}/u;
  // text that is not read as part of a word: ruby annotations (pinyin over characters), code
  const SKIP_SELECTOR = 'rt, rp, script, style, noscript, textarea';
  // a tap on these keeps its usual meaning (follow the link, press the button, edit the text)
  const INTERACTIVE_SELECTOR =
    'a[href], button, input, textarea, select, option, label, summary, [contenteditable=""], [contenteditable="true"], [role="button"], [role="link"]';
  // Shift pressed while typing here is not a request for a lookup
  const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';
  const COPIED_MS = 1200;
  // touch: a finger lifted within this distance and time is a tap (else a scroll or a long press)
  const TAP_MOVE_PX = 10;
  const TAP_MAX_MS = 500;
  // the click that follows a tap handled on pointerup comes up to ~300 ms later (double-tap check)
  const TAP_CLICK_MS = 1000;
  // a popup opened by a tap closes when the page scrolls this far
  const SCROLL_CLOSE_PX = 24;
  // swiping the popup sideways closes it: a move this long starts the swipe; past this share of
  // its width, or fast enough, it closes, else it snaps back
  const SWIPE_START_PX = 12;
  const SWIPE_CLOSE_SHARE = 0.3;
  const SWIPE_FAST_PX_PER_MS = 0.6;
  const SWIPE_ANIMATION_MS = 150;
  // a word counts as looked up (history in popup.html) when the hover popup stayed on it this
  // long; a tap or Shift is deliberate and counts at once
  const REMEMBER_HOVER_MS = 1000;

  // settings, changed in popup.html
  let enabled = true;
  let theme = 'auto'; // 'auto' (as the system) | 'light' | 'dark'
  let showParts = true; // also show the shorter words inside the hovered one
  let toneColors = false; // pinyin syllables colored by tone
  let requireShift = false; // mouse: new words only while Shift is held
  let saveHistory = true; // keep looked-up words for "add to my words" in popup.html
  let textScale = 1; // Chinese text on pages this many times bigger (1: as the page has it)
  let lastPointerType = 'mouse';
  let lastMouse = null; // last mouse position, to look up when Shift is pressed without moving
  let currentRange = null; // the highlighted word
  let lastHit = null; // { node, offset } of the character the popup is shown for
  // last pointer position over that word: moving from there toward the popup keeps the popup
  let aim = null;
  let requestId = 0;
  let moveTimer = 0;
  let settleTimer = 0;
  let pendingPoint = null;
  const lookupCache = new Map();

  // ---------- text under the pointer ----------

  function caretFromPoint(x, y) {
    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      return pos && { node: pos.offsetNode, offset: pos.offset };
    }
    if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(x, y);
      return range && { node: range.startContainer, offset: range.startOffset };
    }
    return null;
  }

  const rectContains = (rect, x, y) =>
    x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

  /** The chinese character under the point: { node, offset } of its first UTF-16 unit. */
  function hanCharAt(x, y) {
    const caret = caretFromPoint(x, y);
    if (!caret || caret.node?.nodeType !== Node.TEXT_NODE) return null;
    const { node } = caret;
    if (node.parentElement?.closest(SKIP_SELECTOR)) return null;
    const text = node.data;
    // the caret is the boundary nearest to the point: the character is after or before it
    // (offset - 2 for a character outside the BMP, a surrogate pair)
    for (let offset of [caret.offset, caret.offset - 1, caret.offset - 2]) {
      if (offset < 0 || offset >= text.length) continue;
      const unit = text.charCodeAt(offset);
      if (unit >= 0xdc00 && unit <= 0xdfff && offset > 0) offset--;
      const ch = String.fromCodePoint(text.codePointAt(offset));
      if (!HAN_RE.test(ch)) continue;
      const range = document.createRange();
      range.setStart(node, offset);
      range.setEnd(node, offset + ch.length);
      if ([...range.getClientRects()].some((rect) => rectContains(rect, x, y))) {
        return { node, offset };
      }
    }
    return null;
  }

  /**
   * Up to MAX_LEN chinese characters from the hit on, across neighbouring text nodes
   * (words are often split by markup: <b>中</b>国). `ends[i]` is where character i ends.
   */
  function textFrom({ node, offset }) {
    const walker = document.createTreeWalker(node.getRootNode(), NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        n.parentElement?.closest(SKIP_SELECTOR) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    walker.currentNode = node;
    let text = '';
    const ends = [];
    let current = node;
    let pos = offset;
    let nodesLeft = 8;
    while (current && ends.length < MAX_LEN && nodesLeft-- > 0) {
      const data = current.data;
      // skip formatting whitespace between elements: "<span>中</span>\n<span>国</span>"
      if (current === node || data.trim()) {
        while (pos < data.length && ends.length < MAX_LEN) {
          const ch = String.fromCodePoint(data.codePointAt(pos));
          if (!HAN_RE.test(ch)) return { text, ends };
          text += ch;
          pos += ch.length;
          ends.push({ node: current, offset: pos });
        }
      }
      current = walker.nextNode();
      pos = 0;
    }
    return { text, ends };
  }

  // ---------- lookup ----------

  function lookup(text) {
    let result = lookupCache.get(text);
    if (!result) {
      result = Promise.resolve(api.runtime.sendMessage({ type: 'lookup', text }))
        .then((response) => (response?.matches ? response : { matches: [] }))
        // e.g. the extension was updated and this page still runs the old script
        .catch(() => ({ matches: [] }));
      lookupCache.set(text, result);
      if (lookupCache.size > LOOKUP_CACHE_SIZE) {
        lookupCache.delete(lookupCache.keys().next().value);
      }
    }
    return result;
  }

  // ---------- highlight of the matched word ----------

  function setHighlight(range) {
    try {
      if (!globalThis.CSS?.highlights || typeof Highlight === 'undefined') return;
      CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(range));
    } catch {
      // not supported here (older browsers): the popup still works without it
    }
  }

  function clearHighlight() {
    try {
      globalThis.CSS?.highlights?.delete(HIGHLIGHT_NAME);
    } catch {
      // see setHighlight
    }
  }

  // ---------- popup ----------

  let host = null;
  let shadow = null;
  let popup = null;
  let card = null;
  let tip = null; // hover hint of the buttons, outside the card: its scrolling doesn't cut it
  let tipTarget = null;
  let touchOpen = null; // { x, y } page scroll when the popup was opened by a tap; null: by mouse
  let swipe = null; // the finger dragging the popup sideways
  let flingTimer = 0;
  let rememberTimer = 0;
  const rememberedHere = new Set(); // counted once per page, however often it is hovered again

  function ensurePopup() {
    if (host?.isConnected) return;
    host = document.createElement('chineseplus-popup');
    host.style.cssText =
      'all: initial; position: absolute; top: 0; left: 0; width: 0; height: 0; z-index: 2147483647;';
    shadow = host.attachShadow({ mode: 'closed' });
    const style = document.createElement('style');
    style.textContent = POPUP_CSS;
    popup = document.createElement('div');
    popup.className = 'popup';
    popup.hidden = true;
    popup.dataset.theme = theme;
    card = document.createElement('div');
    card.className = 'card';
    tip = document.createElement('div');
    tip.className = 'tip';
    tip.hidden = true;
    tip.setAttribute('aria-hidden', 'true'); // the buttons have aria-label
    popup.append(card, tip);
    // mouse only: on touch screens a tap opens the link or presses the button at once
    card.addEventListener('pointerover', (e) => {
      const target = e.pointerType === 'mouse' && e.target.closest?.('[data-tip]');
      if (target) showTip(target);
      else hideTip();
    });
    card.addEventListener('pointerleave', hideTip);
    card.addEventListener('scroll', hideTip, { passive: true });
    card.addEventListener('pointerdown', onSwipeStart);
    card.addEventListener('pointermove', onSwipeMove);
    card.addEventListener('pointerup', onSwipeEnd);
    card.addEventListener('pointercancel', onSwipeEnd);
    shadow.append(style, popup);
    document.documentElement.append(host);
  }

  const lib = globalThis.ChinesePlusLib; // lib.js, loaded before this script
  const { el, dictionaryUrl, entryText, icon, hskLabel, canSpeak, speak } = lib;
  // the settings of this page's popup
  const pinyinEl = (tag, className, pinyin) => lib.pinyinEl(tag, className, pinyin, toneColors);
  const renderSense = (node) => lib.renderSense(node, toneColors);
  const copyText = (text) => lib.copyText(text, shadow);

  // instant hover hint (like the site's daisyUI tooltips); a native `title` shows late
  function setTip(node, text) {
    node.dataset.tip = text;
    node.setAttribute('aria-label', text);
    if (node === tipTarget) showTip(node); // e.g. "Скопировано" while the pointer is on it
  }

  /** The hint under `target`, centered on it but kept within the card's width. */
  function showTip(target) {
    tipTarget = target;
    tip.textContent = target.dataset.tip;
    tip.hidden = false;
    const popupRect = popup.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const width = tip.offsetWidth;
    const inset = 6;
    const center = targetRect.left + targetRect.width / 2 - popupRect.left;
    const left = Math.max(
      cardRect.left - popupRect.left + inset,
      Math.min(center - width / 2, cardRect.right - popupRect.left - width - inset),
    );
    tip.style.left = `${left}px`;
    tip.style.top = `${targetRect.bottom - popupRect.top + 7}px`;
    tip.style.setProperty('--arrow-x', `${center - left}px`);
  }

  function hideTip() {
    tipTarget = null;
    if (tip) tip.hidden = true;
  }

  // popup buttons on touch: act when the finger lifts, not on the click that comes ~300 ms later
  // (double-tap check). That click is then swallowed: it would press the button a second time,
  // or, after "✕" closed the popup, land on the page under it (e.g. follow a link).
  let suppressClickUntil = 0;

  function onPress(node, handler) {
    let down = null;
    node.addEventListener('pointerdown', (e) => {
      down = e.pointerType !== 'mouse' && e.isPrimary ? { x: e.clientX, y: e.clientY, time: performance.now() } : null;
    });
    node.addEventListener('pointercancel', () => (down = null));
    node.addEventListener('pointerup', (e) => {
      const start = down;
      down = null;
      if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_MOVE_PX) return;
      if (performance.now() - start.time > TAP_MAX_MS) return;
      suppressClickUntil = performance.now() + TAP_CLICK_MS;
      handler(e);
    });
    node.addEventListener('click', (e) => {
      if (performance.now() >= suppressClickUntil) handler(e); // mouse, keyboard
    });
  }

  function iconButton(name, tip, onClick) {
    const button = el('button', 'icon');
    button.type = 'button';
    button.append(icon(name));
    setTip(button, tip);
    onPress(button, onClick);
    return button;
  }

  /** Copies on click, then shows a check mark for a moment. */
  function copyButton(name, tip, getText) {
    const button = iconButton(name, tip, async () => {
      const copied = await copyText(getText());
      button.replaceChildren(icon(copied ? 'check' : name));
      setTip(button, copied ? 'Скопировано' : 'Не удалось скопировать');
      setTimeout(() => {
        button.replaceChildren(icon(name));
        setTip(button, tip);
      }, COPIED_MS);
    });
    return button;
  }

  function renderMatch(match) {
    const { word, trad, hsk, entries } = match;
    const block = el('div', 'match');
    const head = el('div', 'head');
    head.append(el('span', 'hanzi', word));
    if (trad) head.append(el('span', 'trad', trad));

    const single = entries.length === 1;
    if (single && entries[0][0]) head.append(pinyinEl('span', 'head-pinyin', entries[0][0]));
    if (hsk) {
      const badge = el('span', 'hsk', `HSK ${hskLabel(hsk)}`);
      badge.title = `Слово из списка HSK 3.0, уровень ${hskLabel(hsk)}`;
      head.append(badge);
    }

    // small "more on the site" link button and tools under the character and pinyin
    const actions = el('div', 'actions');
    const link = el('a', 'icon text', 'Подробнее ↗');
    link.href = dictionaryUrl(word);
    link.target = '_blank';
    link.rel = 'noopener';
    setTip(link, 'Примеры, порядок черт и другое на сайте');
    link.setAttribute('aria-label', `Подробнее: ${link.dataset.tip}`);
    // the site adds it (after asking, and after a login if needed): no account in the extension
    const add = el('a', 'icon');
    add.href = `${dictionaryUrl(word)}&add=1`;
    add.target = '_blank';
    add.rel = 'noopener';
    add.append(icon('plus'));
    setTip(add, 'Добавить в мои слова на сайте');
    actions.append(link, add);
    if (canSpeak()) actions.append(iconButton('speaker', 'Произнести', () => speak(word)));
    actions.append(
      copyButton('copy', 'Копировать слово', () => word),
      copyButton('entry', 'Копировать слово с переводом', () => entryText(match)),
    );
    block.append(head, actions);

    for (const [pinyin, senses] of entries) {
      const entry = el('div', 'entry');
      if (!single && pinyin) entry.append(pinyinEl('div', 'head-pinyin', pinyin));
      const body = el('div', 'senses');
      senses.forEach((sense) => body.append(renderSense(sense)));
      entry.append(body);
      block.append(entry);
    }
    const refs = lib.renderRefs(match.refs, toneColors); // "см. 一会儿": 一会儿's meaning
    if (refs) block.append(refs);
    return block;
  }

  function render(matches) {
    ensurePopup();
    hideTip();
    card.replaceChildren();
    const close = el('button', 'close', '✕');
    close.type = 'button';
    close.title = 'Закрыть';
    onPress(close, hide);
    card.append(close, ...matches.map(renderMatch));
    card.scrollTop = 0;
  }

  /** Places the popup under the word (above it when there is no room), inside the visible area. */
  function position(wordRect) {
    const vv = window.visualViewport;
    const scale = vv?.scale || 1;
    const viewLeft = vv ? vv.pageLeft : window.scrollX;
    const viewTop = vv ? vv.pageTop : window.scrollY;
    const viewWidth = vv ? vv.width : document.documentElement.clientWidth;
    const viewHeight = vv ? vv.height : document.documentElement.clientHeight;
    const margin = 8;

    resetSwipe();
    // keep the same size on screen when the page is pinch-zoomed (mobile)
    card.style.zoom = String(1 / scale);
    card.style.width = `${Math.min(300, (viewWidth - 2 * margin) * scale)}px`;
    card.style.maxHeight = `${Math.max(160, viewHeight * 0.55 * scale)}px`;

    popup.hidden = false;
    popup.style.left = '0px';
    popup.style.top = '0px';
    const { width, height } = popup.getBoundingClientRect();

    const wordLeft = wordRect.left + window.scrollX;
    const wordTop = wordRect.top + window.scrollY;
    const wordBottom = wordRect.bottom + window.scrollY;
    const gap = 1; // close to the word: a short way to the "Подробнее" button

    const left = Math.max(
      viewLeft + margin,
      Math.min(wordLeft, viewLeft + viewWidth - width - margin),
    );
    const roomBelow = viewTop + viewHeight - wordBottom;
    const roomAbove = wordTop - viewTop;
    const top =
      roomBelow < height + gap + margin && roomAbove > roomBelow
        ? Math.max(viewTop + margin, wordTop - height - gap)
        : wordBottom + gap;

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }

  async function show(hit) {
    const { text, ends } = textFrom(hit);
    if (!text) return;
    const id = ++requestId;
    const { matches } = await lookup(text);
    if (id !== requestId || !enabled) return;
    if (!matches?.length) {
      hide();
      return;
    }
    const end = ends[matches[0].len - 1];
    const range = document.createRange();
    range.setStart(hit.node, hit.offset);
    range.setEnd(end.node, end.offset);

    currentRange = range;
    setHighlight(range);
    // the shorter words inside the matched one (中国人 -> 中国, 中) only when the setting is on
    render(showParts ? matches : matches.filter((m) => m.len === matches[0].len));
    position(range.getBoundingClientRect());
    rememberWord(matches[0].word, touchOpen || requireShift ? 0 : REMEMBER_HOVER_MS);
  }

  /** Counts the word as looked up, unless the popup moves on before `delay`. */
  function rememberWord(word, delay) {
    clearTimeout(rememberTimer);
    if (!saveHistory || api.extension?.inIncognitoContext || rememberedHere.has(word)) return;
    rememberTimer = setTimeout(() => {
      rememberedHere.add(word);
      Promise.resolve(api.runtime.sendMessage({ type: 'remember', word })).catch(() => {});
    }, delay);
  }

  function hide() {
    clearTimeout(settleTimer);
    clearTimeout(rememberTimer);
    requestId++; // drops a lookup still in flight
    lastHit = null;
    aim = null;
    currentRange = null;
    touchOpen = null;
    swipe = null;
    clearHighlight();
    hideTip();
    if (popup && !popup.hidden) popup.hidden = true;
  }

  const isPopupEvent = (e) => Boolean(host) && e.composedPath().includes(host);

  // ---------- touch: swipe the popup sideways to close it ----------
  // Sideways only: up and down scroll a long definition (touch-action: pan-y in POPUP_CSS).

  function moveCard(dx) {
    const zoom = parseFloat(card.style.zoom) || 1; // the card is zoomed on a pinch-zoomed page
    card.style.transform = `translateX(${dx / zoom}px)`;
    card.style.opacity = String(Math.max(0.2, 1 - Math.abs(dx) / 300));
  }

  function resetSwipe() {
    clearTimeout(flingTimer);
    swipe = null;
    card.style.transition = '';
    card.style.transform = '';
    card.style.opacity = '';
  }

  function onSwipeStart(e) {
    swipe =
      e.pointerType !== 'mouse' && e.isPrimary
        ? { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, time: performance.now(), active: false }
        : null;
  }

  function onSwipeMove(e) {
    if (!swipe || e.pointerId !== swipe.id) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    if (!swipe.active) {
      // clearly sideways, not a slightly slanted scroll of the definition
      if (Math.abs(dx) < SWIPE_START_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      swipe.active = true;
      hideTip();
      card.style.transition = 'none';
    }
    swipe.dx = dx;
    moveCard(dx);
  }

  function onSwipeEnd(e) {
    const s = swipe;
    swipe = null;
    if (!s?.active) return;
    const width = card.getBoundingClientRect().width;
    const speed = Math.abs(s.dx) / Math.max(1, performance.now() - s.time);
    const far = Math.abs(s.dx) > width * SWIPE_CLOSE_SHARE;
    const fast = speed > SWIPE_FAST_PX_PER_MS && Math.abs(s.dx) > 30;
    card.style.transition = `transform ${SWIPE_ANIMATION_MS}ms ease-out, opacity ${SWIPE_ANIMATION_MS}ms`;
    if (e.type === 'pointerup' && (far || fast)) {
      moveCard(Math.sign(s.dx) * (window.innerWidth + width)); // off the screen, then closed
      flingTimer = setTimeout(hide, SWIPE_ANIMATION_MS);
    } else {
      moveCard(0); // back in place
      card.style.opacity = '';
    }
  }

  // ---------- touch: a popup opened by a tap closes when the page scrolls on ----------

  const pageScroll = () => {
    const vv = window.visualViewport;
    return { x: vv ? vv.pageLeft : window.scrollX, y: vv ? vv.pageTop : window.scrollY };
  };

  function onScroll(e) {
    if (!touchOpen || !popup || popup.hidden) return;
    const target = e.target;
    if (target === document || target === window.visualViewport) {
      const now = pageScroll();
      if (Math.hypot(now.x - touchOpen.x, now.y - touchOpen.y) > SCROLL_CLOSE_PX) hide();
      return;
    }
    // a scrolling block of the page (e.g. a reader's text column): only the one with the word,
    // not a carousel elsewhere that scrolls by itself
    if (target instanceof Node && currentRange && target.contains(currentRange.startContainer)) hide();
  }

  // ---------- events ----------

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  function inTriangle(p, a, b, c) {
    const d1 = cross(p, a, b);
    const d2 = cross(p, b, c);
    const d3 = cross(p, c, a);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  }

  /**
   * The pointer goes from the word toward the popup (e.g. to press "Подробнее"): it is inside the
   * triangle between its last position over the word and the popup's near edge.
   */
  function headingToPopup(x, y) {
    if (!aim || !popup || popup.hidden) return false;
    const rect = popup.getBoundingClientRect();
    const below = rect.top >= aim.y;
    const edgeY = below ? rect.top : rect.bottom;
    // mostly vertical moves only: reading along the line (slightly drifting down) switches words
    const dy = below ? y - aim.y : aim.y - y;
    if (dy <= 0 || dy * 2 < Math.abs(x - aim.x)) return false;
    // a little wider than the popup, so a slightly curved path still counts
    const left = { x: rect.left - 8, y: edgeY };
    const right = { x: rect.right + 8, y: edgeY };
    return inTriangle({ x, y }, aim, left, right);
  }

  const overCurrentWord = (x, y) =>
    Boolean(currentRange) &&
    [...currentRange.getClientRects()].some((rect) => rectContains(rect, x, y));

  function handlePoint() {
    moveTimer = 0;
    if (!pendingPoint) return;
    const { x, y, shift } = pendingPoint;
    pendingPoint = null;
    clearTimeout(settleTimer);

    if (headingToPopup(x, y)) {
      // keep the popup; if the pointer stops before reaching it, take the word under it
      settleTimer = setTimeout(() => {
        aim = null;
        pendingPoint = { x, y, shift };
        handlePoint();
      }, SETTLE_MS);
      return;
    }

    if (requireShift && !shift) {
      // "only with Shift": no new words, the popup stays while the pointer is on its word
      if (overCurrentWord(x, y)) aim = { x, y };
      else hide();
      return;
    }

    const hit = hanCharAt(x, y);
    if (!hit) {
      hide(); // off the chinese text: no delay
      return;
    }
    aim = { x, y };
    if (lastHit && hit.node === lastHit.node && hit.offset === lastHit.offset) return;
    lastHit = hit;
    touchOpen = null;
    show(hit);
  }

  function onPointerMove(e) {
    if (!enabled || e.pointerType !== 'mouse' || e.buttons) return; // buttons: selecting text
    if (isPopupEvent(e)) {
      // reached the popup: leaving it later goes by the word under the pointer again
      aim = null;
      pendingPoint = null;
      lastMouse = null; // Shift over the popup looks nothing up
      clearTimeout(settleTimer);
      return;
    }
    lastMouse = { x: e.clientX, y: e.clientY };
    pendingPoint = { ...lastMouse, shift: e.shiftKey };
    if (!moveTimer) moveTimer = setTimeout(handlePoint, MOVE_THROTTLE_MS);
  }

  // ---------- touch: a tap on a character opens the popup, a tap anywhere else closes it ----------
  // Handled on pointerup, not on click: mobile browsers hold the click back (~300 ms) on pages with
  // double-tap zoom. The lookup starts already on pointerdown, so the background script (often
  // asleep on Android) and the dictionary file load while the finger is still on the screen.

  let touchStart = null; // { x, y, time, interactive, hit } of the finger on the screen
  let tapHandledAt = -Infinity; // performance.now() of the last tap handled on pointerup

  const isInteractive = (target) =>
    target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));

  function handleTap(interactive, hit, x, y) {
    if (interactive || !hit) {
      hide(); // a link, a button, a field keep their usual meaning; elsewhere: close
      return;
    }
    if (popup && !popup.hidden && overCurrentWord(x, y)) {
      hide(); // the highlighted word tapped again
      return;
    }
    lastHit = hit;
    touchOpen = pageScroll();
    show(hit);
  }

  function onPointerDown(e) {
    lastPointerType = e.pointerType;
    touchStart = null;
    // a second finger (pinch zoom), or a tap inside the popup: its buttons handle it
    if (e.pointerType === 'mouse' || !e.isPrimary || !enabled || isPopupEvent(e)) return;
    const interactive = isInteractive(e.target);
    const hit = interactive ? null : hanCharAt(e.clientX, e.clientY);
    touchStart = { x: e.clientX, y: e.clientY, time: performance.now(), interactive, hit };
    if (hit) {
      const { text } = textFrom(hit);
      if (text) lookup(text); // cached: show() on pointerup gets the same promise
    }
  }

  function onPointerUp(e) {
    const start = touchStart;
    touchStart = null;
    if (!start || !e.isPrimary || !enabled) return;
    const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_MOVE_PX;
    if (moved || performance.now() - start.time > TAP_MAX_MS) return; // scroll, text selection
    tapHandledAt = performance.now();
    handleTap(start.interactive, start.hit, start.x, start.y);
  }

  // fallback: a click without a pointerup before it (pointer events stopped by the page)
  function onClick(e) {
    if (!enabled || lastPointerType === 'mouse' || isPopupEvent(e)) return;
    if (performance.now() - tapHandledAt < TAP_CLICK_MS) return; // this tap is handled already
    const interactive = isInteractive(e.target);
    const hit = interactive ? null : hanCharAt(e.clientX, e.clientY);
    handleTap(interactive, hit, e.clientX, e.clientY);
  }

  document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
  document.addEventListener('pointerup', onPointerUp, { capture: true, passive: true });
  // the browser took the gesture over (scroll, zoom): no tap
  document.addEventListener('pointercancel', () => (touchStart = null), {
    capture: true,
    passive: true,
  });
  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('click', onClick, { capture: true, passive: true });
  // the late click after a popup button pressed on touch (see onPress): first in line, once
  window.addEventListener(
    'click',
    (e) => {
      if (performance.now() >= suppressClickUntil) return;
      suppressClickUntil = 0;
      e.preventDefault();
      e.stopImmediatePropagation();
    },
    { capture: true },
  );
  // "only with Shift": pressing it looks up the word under the resting mouse pointer
  function onKeyDown(e) {
    if (e.key === 'Escape') {
      hide();
      return;
    }
    if (e.key !== 'Shift' || e.repeat || !requireShift || !enabled || !lastMouse) return;
    const active = document.activeElement;
    if (active?.isContentEditable || active?.closest?.(EDITABLE_SELECTOR)) return;
    clearTimeout(moveTimer);
    aim = null; // a lookup right here, even on the way to the popup
    pendingPoint = { ...lastMouse, shift: true };
    handlePoint();
  }

  document.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', () => lastPointerType === 'mouse' && hide(), { passive: true });
  // scroll events don't bubble: capture sees the page's own scrolling blocks too
  document.addEventListener('scroll', onScroll, { capture: true, passive: true });
  window.visualViewport?.addEventListener('scroll', onScroll, { passive: true }); // pinch-zoom pan

  // ---------- bigger Chinese text (setting `textScale`) ----------
  // Small characters are hard to read and to tap on a phone. The font size of every element with
  // Chinese text of its own is multiplied (an inline `!important` style, undone exactly), not the
  // page zoom: lines wrap to the screen, no sideways scrolling, the rest of the page as it was.

  const TEXT_SCALES = [1, 1.25, 1.5, 1.75, 2];
  const SCALE_MAX_PX = 32; // headings this big are left as they are
  const SCALE_DEBOUNCE_MS = 300;
  const scaled = new Map(); // element -> its own inline font-size / line-height before
  let scaleObserver = null;
  let scaleTimer = 0;
  const pendingRoots = new Set();

  const hasScaledAncestor = (el) => {
    for (let node = el.parentElement; node; node = node.parentElement) {
      if (scaled.has(node)) return true;
    }
    return false;
  };

  /** Elements under `root` with Chinese text directly in them, not scaled yet. */
  function scaleTargets(root) {
    const targets = new Set();
    const consider = (text) => {
      const el = text.parentElement;
      if (!el || scaled.has(el) || !HAN_RE.test(text.data)) return;
      if (el.closest(`${SKIP_SELECTOR}, ${EDITABLE_SELECTOR}`)) return;
      targets.add(el);
    };
    if (root.nodeType === Node.TEXT_NODE) {
      consider(root);
      return targets;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) consider(node);
    return targets;
  }

  /**
   * All sizes are read first, then written: a child sized relative to its parent (em, inherit)
   * gets its own explicit size from the original, not from the already enlarged parent. Content
   * added later inside an enlarged element already inherits its size: skipped.
   */
  function applyScale(targets, later) {
    const plans = [];
    for (const el of targets) {
      if (later && hasScaledAncestor(el)) continue;
      const style = getComputedStyle(el);
      const size = parseFloat(style.fontSize);
      if (!size || size >= SCALE_MAX_PX) continue;
      const lineHeight = style.lineHeight.endsWith('px') ? parseFloat(style.lineHeight) : null;
      plans.push([el, size, lineHeight]);
    }
    for (const [el, size, lineHeight] of plans) {
      scaled.set(el, {
        fontSize: [el.style.getPropertyValue('font-size'), el.style.getPropertyPriority('font-size')],
        lineHeight: [el.style.getPropertyValue('line-height'), el.style.getPropertyPriority('line-height')],
      });
      el.style.setProperty('font-size', `${(size * textScale).toFixed(1)}px`, 'important');
      // a fixed line height would make the bigger lines overlap
      if (lineHeight) el.style.setProperty('line-height', `${(lineHeight * textScale).toFixed(1)}px`, 'important');
    }
  }

  function unscaleAll() {
    for (const [el, { fontSize, lineHeight }] of scaled) {
      el.style.setProperty('font-size', ...fontSize);
      el.style.setProperty('line-height', ...lineHeight);
    }
    scaled.clear();
  }

  function flushScale() {
    scaleTimer = 0;
    const roots = [...pendingRoots].filter((root) => root.isConnected);
    pendingRoots.clear();
    for (const el of scaled.keys()) if (!el.isConnected) scaled.delete(el); // removed content
    const targets = new Set();
    roots.forEach((root) => scaleTargets(root).forEach((el) => targets.add(el)));
    applyScale(targets, true);
  }

  /** Applies the current setting: everything again from the original sizes. */
  function updateTextScale() {
    unscaleAll();
    scaleObserver?.disconnect();
    scaleObserver = null;
    clearTimeout(scaleTimer);
    pendingRoots.clear();
    if (!enabled || textScale === 1 || !document.body) return;
    applyScale(scaleTargets(document.body), false);
    // text added later: infinite scroll, chats, pages that render after load
    scaleObserver = new MutationObserver((mutations) => {
      for (const { addedNodes, target, type } of mutations) {
        if (type === 'characterData') pendingRoots.add(target);
        addedNodes.forEach((node) => pendingRoots.add(node));
      }
      if (pendingRoots.size && !scaleTimer) scaleTimer = setTimeout(flushScale, SCALE_DEBOUNCE_MS);
    });
    scaleObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  const setTextScale = (value) => {
    const next = TEXT_SCALES.includes(value) ? value : 1;
    if (next === textScale) return;
    textScale = next;
    updateTextScale();
  };

  // ---------- settings (popup.html, keyboard shortcut) ----------

  const setTheme = (value) => {
    theme = ['light', 'dark'].includes(value) ? value : 'auto';
    if (popup) popup.dataset.theme = theme;
  };

  const SETTINGS = [
    'enabled',
    'theme',
    'showParts',
    'toneColors',
    'requireShift',
    'saveHistory',
    'textScale',
  ];
  api.storage.local.get(SETTINGS).then(
    (stored) => {
      saveHistory = stored.saveHistory !== false;
      enabled = stored.enabled !== false;
      showParts = stored.showParts !== false;
      toneColors = stored.toneColors === true;
      requireShift = stored.requireShift === true;
      setTheme(stored.theme);
      setTextScale(stored.textScale);
    },
    () => {},
  );
  api.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.theme) setTheme(changes.theme.newValue);
    if (changes.showParts) showParts = changes.showParts.newValue !== false;
    if (changes.toneColors) toneColors = changes.toneColors.newValue === true;
    if (changes.requireShift) requireShift = changes.requireShift.newValue === true;
    if (changes.saveHistory) saveHistory = changes.saveHistory.newValue !== false;
    if (changes.enabled) {
      enabled = changes.enabled.newValue !== false;
      if (!enabled) hide();
      updateTextScale(); // the page's own sizes back while the extension is off
    }
    if (changes.textScale) setTextScale(changes.textScale.newValue);
  });

  // colors follow the site's daisyUI themes: emerald (light) and night (dark)
  const DARK_VARS = `
    --bg: #0f172a; --fg: #cbd5e1; --muted: #94a3b8; --info: #0ca5e9; --info-fg: #000000;
    --success: #2dd4bf; --line: #1e293b; --pinyin: #0ca5e9;
    --tone1: #f87171; --tone2: #fbbf24; --tone3: #4ade80; --tone4: #60a5fa; --tone5: #94a3b8;
  `;
  const POPUP_CSS = `
    .popup {
      position: absolute; top: 0; left: 0;
      --bg: #ffffff; --fg: #333c4d; --muted: #6b7280; --info: #3abff8; --info-fg: #002b3d;
      --success: #059669; --line: #e5e7eb;
      /* darker than --info: light blue text is hard to read on white */
      --pinyin: #0284c7;
      /* pinyin tone colors (setting), as in Zhongwen: red, orange, green, blue, gray */
      --tone1: #dc2626; --tone2: #d97706; --tone3: #16a34a; --tone4: #2563eb; --tone5: #6b7280;
    }
    .popup[hidden] { display: none; }
    .card {
      position: relative; box-sizing: border-box; width: 300px; max-height: 60vh; overflow: auto;
      overscroll-behavior: contain; -webkit-overflow-scrolling: touch; touch-action: pan-y pinch-zoom;
      background: var(--bg); color: var(--fg); border: 1px solid var(--info); border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18); padding: 10px 12px;
      font: 14px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, "PingFang SC",
        "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
      text-align: left; white-space: normal; letter-spacing: normal; word-break: normal;
      overflow-wrap: anywhere; cursor: auto;
    }
    @media (prefers-color-scheme: dark) {
      .popup[data-theme="auto"] { ${DARK_VARS} }
    }
    .popup[data-theme="dark"] { ${DARK_VARS} }
    .close {
      position: absolute; top: 4px; right: 4px; width: 28px; height: 28px; border: 0;
      border-radius: 50%; background: transparent; color: var(--muted); font: 14px/28px sans-serif;
      cursor: pointer; padding: 0;
    }
    .close:hover { background: var(--line); color: var(--fg); }
    .match + .match { border-top: 1px solid var(--line); margin-top: 10px; padding-top: 10px; }
    .head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 8px; margin: 0 28px 4px 0; }
    .hanzi { font-size: 24px; line-height: 1.2; color: var(--fg); }
    .trad { font-size: 16px; color: var(--muted); }
    .head-pinyin { font-size: 17px; color: var(--pinyin); }
    .tone1 { color: var(--tone1); } .tone2 { color: var(--tone2); } .tone3 { color: var(--tone3); }
    .tone4 { color: var(--tone4); } .tone5 { color: var(--tone5); }
    .hsk {
      align-self: center; padding: 0 6px; border: 1px solid var(--info); border-radius: 999px;
      color: var(--pinyin); font-size: 11px; line-height: 16px; white-space: nowrap; cursor: default;
    }
    .actions { display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
    .icon {
      position: relative; display: inline-flex; align-items: center; justify-content: center;
      width: 26px; height: 20px; padding: 0; border: 1px solid var(--info); border-radius: 6px;
      box-sizing: border-box; background: transparent; color: var(--pinyin); cursor: pointer;
      text-decoration: none;
    }
    /* outlined like the HSK badge (daisyUI btn-outline btn-info), filled on hover */
    .icon:hover { background: var(--info); color: var(--info-fg); }
    .icon.text {
      width: auto; padding: 0 7px; font-size: 12px; font-weight: 500; line-height: 18px;
      white-space: nowrap;
    }
    .icon svg {
      width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2;
      stroke-linecap: round; stroke-linejoin: round;
    }
    .entry + .entry { margin-top: 6px; }
    .senses { font-size: 13.5px; }
    .children { margin-left: 12px; }
    .label { color: var(--success); font-style: italic; font-size: 12px; }
    .comment { font-style: italic; }
    .pinyin, .strong { color: var(--success); font-weight: 700; }
    .en { color: var(--success); }
    .ref { color: var(--info); text-decoration: underline; }
    .refs { margin-top: 6px; }
    .ref-meaning {
      margin-top: 4px; padding-left: 8px; border-left: 2px solid var(--line); font-size: 13px;
    }
    .ref-head { margin-bottom: 1px; }
    .ref-word { font-size: 16px; }
    .ref-pinyin { color: var(--pinyin); }
    /* hint under a button (showTip): placed by the script, within the card's width */
    .tip {
      position: absolute; z-index: 1; box-sizing: border-box; width: max-content; max-width: 220px;
      padding: 4px 8px; border-radius: 6px; background: var(--info); color: var(--info-fg);
      font: 500 12px/1.35 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      text-align: left; white-space: normal; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      pointer-events: none;
    }
    .tip[hidden] { display: none; }
    .tip::before {
      content: ''; position: absolute; top: -10px; left: calc(var(--arrow-x, 12px) - 5px);
      border: 5px solid transparent; border-bottom-color: var(--info);
    }
  `;
})();
