/**
 * Popup dictionary: hover (mouse) or tap (touch) a chinese character to see the longest
 * dictionary word that starts there, and the shorter ones, with pinyin and meanings.
 * Lookups go to background.js (offline dictionary in dict/). The popup lives in a closed
 * shadow root, so page styles don't reach it, and is built with DOM APIs only (no innerHTML).
 */
(() => {
  const api = globalThis.browser ?? globalThis.chrome;

  const SITE_URL = 'https://www.chineseplus.club';
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

  // settings, changed in popup.html
  let enabled = true;
  let theme = 'auto'; // 'auto' (as the system) | 'light' | 'dark'
  let showParts = true; // also show the shorter words inside the hovered one
  let toneColors = false; // pinyin syllables colored by tone
  let requireShift = false; // mouse: new words only while Shift is held
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
    shadow.append(style, popup);
    document.documentElement.append(host);
  }

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const dictionaryUrl = (word) =>
    `${SITE_URL}/dictionary/${encodeURIComponent(word)}?utm_source=browser_extension`;

  const INLINE_CLASSES = { l: 'label', m: 'comment', p: 'pinyin', e: 'en', b: 'strong' };

  function renderInline(parent, inline) {
    if (typeof inline === 'string') {
      parent.append(inline);
      return;
    }
    const [type, value] = inline;
    if (type === 'r') {
      const link = el('a', 'ref', value);
      link.href = dictionaryUrl(value);
      link.target = '_blank';
      link.rel = 'noopener';
      parent.append(link);
    } else {
      parent.append(el('span', INLINE_CLASSES[type] || '', value));
    }
  }

  /** Same layout as the site's tooltips (qwik/src/misc/helpers/translation/senses-to-html.ts). */
  function renderSense(node) {
    const wrap = el('div');
    const line = el('div', 'sense');
    if (node.m) {
      if (node.k) line.append(el('span', 'strong', node.m), ' ');
      else line.append(`${node.m}) `);
    }
    if (node.p) line.append(pinyinEl('span', 'pinyin', node.p), ' ');
    if (node.l) line.append(el('span', 'label', node.l.join(' ')), ' ');
    if (node.c) node.c.forEach((inline) => renderInline(line, inline));
    else if (node.t) line.append(node.t);
    wrap.append(line);
    if (node.s?.length) {
      const children = el('div', 'children');
      node.s.forEach((child) => children.append(renderSense(child)));
      wrap.append(children);
    }
    return wrap;
  }

  // ---------- pinyin tone colors ----------

  // one syllable: initial, vowels, final n / ng and erhua r unless the next syllable starts with
  // it (zhōngguó -> zhōng guó, dàngé -> dàn gé, yīdiǎnr -> yī diǎnr); dictionary pinyin is
  // written without spaces
  const SYLLABLE_RE =
    /(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?[aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+(?:ng(?![aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ])|n(?![aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]))?(?:r(?![aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]))?/giu;
  const TONE_MARKS = { '̄': 1, '́': 2, '̌': 3, '̀': 4 };

  const toneOf = (syllable) => {
    for (const ch of syllable.normalize('NFD')) if (TONE_MARKS[ch]) return TONE_MARKS[ch];
    return 5; // neutral tone: no mark
  };

  /** Pinyin as text, or as one span per syllable colored by its tone (the setting). */
  function pinyinEl(tag, className, pinyin) {
    const node = el(tag, className);
    if (!toneColors) {
      node.textContent = pinyin;
      return node;
    }
    let last = 0;
    for (const match of pinyin.matchAll(SYLLABLE_RE)) {
      if (match.index > last) node.append(pinyin.slice(last, match.index));
      node.append(el('span', `tone${toneOf(match[0])}`, match[0]));
      last = match.index + match[0].length;
    }
    if (last < pinyin.length) node.append(pinyin.slice(last));
    return node;
  }

  // ---------- audio: the browser's own speech synthesis (no download, works offline) ----------

  const speech = globalThis.speechSynthesis;
  let voice = null; // best chinese voice, null: none known (yet)
  let voicesLoaded = false;

  // mandarin first (zh-CN), then other chinese voices except cantonese ones (zh-HK);
  // a voice inside the system before an online one
  const voiceRank = (v) => {
    const lang = v.lang.replace('_', '-').toLowerCase();
    const langRank = /hk|yue/.test(lang) ? 3 : lang === 'zh-cn' || lang.startsWith('cmn') ? 0 : lang === 'zh-tw' ? 2 : 1;
    return langRank * 2 + (v.localService ? 0 : 1);
  };

  function pickVoice() {
    const voices = speech?.getVoices() || [];
    voicesLoaded = voices.length > 0;
    const chinese = voices.filter((v) => /^(zh|cmn|yue)/i.test(v.lang));
    voice = chinese.sort((a, b) => voiceRank(a) - voiceRank(b))[0] || null;
  }
  if (speech) {
    pickVoice();
    speech.addEventListener?.('voiceschanged', pickVoice);
  }

  // the voice list comes asynchronously: until then, offer the button and let the browser choose
  const canSpeak = () => Boolean(speech) && (Boolean(voice) || !voicesLoaded);

  function speak(text) {
    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice?.lang || 'zh-CN';
    if (voice) utterance.voice = voice;
    utterance.rate = 0.8;
    speech.speak(utterance);
  }

  // ---------- copy ----------

  const inlineText = (inline) => (typeof inline === 'string' ? inline : inline[1]);

  function senseLines(node, depth) {
    let line = '';
    if (node.m) line += node.k ? `${node.m} ` : `${node.m}) `;
    if (node.p) line += `${node.p} `;
    if (node.l) line += `${node.l.join(' ')} `;
    line += node.c ? node.c.map(inlineText).join('') : node.t || '';
    const lines = [`${'  '.repeat(depth)}${line.trim()}`];
    node.s?.forEach((child) => lines.push(...senseLines(child, depth + 1)));
    return lines;
  }

  /** The entry as plain text: word, pinyin, meanings (one per line). */
  function entryText({ word, trad, entries }) {
    const lines = [trad ? `${word} (${trad})` : word];
    for (const [pinyin, senses] of entries) {
      if (pinyin) lines.push(pinyin);
      senses.forEach((sense) => lines.push(...senseLines(sense, 0)));
    }
    return lines.join('\n');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // http pages, or the page's permissions policy forbids it: the old way
    }
    const area = el('textarea');
    area.value = text;
    area.style.cssText = 'position: fixed; top: 0; left: 0; opacity: 0;';
    shadow.append(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      // not allowed here
    }
    area.remove();
    return copied;
  }

  // ---------- popup content ----------

  const SVG_NS = 'http://www.w3.org/2000/svg';
  // lucide icons (ISC license), as path data
  const ICONS = {
    speaker: ['M11 5 6 9H2v6h4l5 4V5z', 'M15.5 8.5a5 5 0 0 1 0 7', 'M19 5a10 10 0 0 1 0 14'],
    copy: [
      'M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z',
      'M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2',
    ],
    entry: [
      'M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z',
      'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
      'M8 11h8',
      'M8 16h5',
    ],
    check: ['M20 6 9 17l-5-5'],
    plus: ['M12 5v14', 'M5 12h14'],
  };

  function icon(name) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    for (const d of ICONS[name]) {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      svg.append(path);
    }
    return svg;
  }

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

  function iconButton(name, tip, onClick) {
    const button = el('button', 'icon');
    button.type = 'button';
    button.append(icon(name));
    setTip(button, tip);
    button.addEventListener('click', onClick);
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

  const hskLabel = (level) => (level === '789' ? '7–9' : level);

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
    return block;
  }

  function render(matches) {
    ensurePopup();
    hideTip();
    card.replaceChildren();
    const close = el('button', 'close', '✕');
    close.type = 'button';
    close.title = 'Закрыть';
    close.addEventListener('click', hide);
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
  }

  function hide() {
    clearTimeout(settleTimer);
    requestId++; // drops a lookup still in flight
    lastHit = null;
    aim = null;
    currentRange = null;
    clearHighlight();
    hideTip();
    if (popup && !popup.hidden) popup.hidden = true;
  }

  const isPopupEvent = (e) => Boolean(host) && e.composedPath().includes(host);

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

  // touch: a tap on a character opens the popup, a tap anywhere else closes it
  function onClick(e) {
    if (!enabled || lastPointerType === 'mouse' || isPopupEvent(e)) return;
    if (e.target instanceof Element && e.target.closest(INTERACTIVE_SELECTOR)) {
      hide();
      return;
    }
    const hit = hanCharAt(e.clientX, e.clientY);
    if (!hit) {
      hide();
      return;
    }
    lastHit = hit;
    show(hit);
  }

  document.addEventListener('pointerdown', (e) => (lastPointerType = e.pointerType), {
    capture: true,
    passive: true,
  });
  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('click', onClick, { capture: true, passive: true });
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

  // ---------- settings (popup.html, keyboard shortcut) ----------

  const setTheme = (value) => {
    theme = ['light', 'dark'].includes(value) ? value : 'auto';
    if (popup) popup.dataset.theme = theme;
  };

  api.storage.local.get(['enabled', 'theme', 'showParts', 'toneColors', 'requireShift']).then(
    (stored) => {
      enabled = stored.enabled !== false;
      showParts = stored.showParts !== false;
      toneColors = stored.toneColors === true;
      requireShift = stored.requireShift === true;
      setTheme(stored.theme);
    },
    () => {},
  );
  api.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.theme) setTheme(changes.theme.newValue);
    if (changes.showParts) showParts = changes.showParts.newValue !== false;
    if (changes.toneColors) toneColors = changes.toneColors.newValue === true;
    if (changes.requireShift) requireShift = changes.requireShift.newValue === true;
    if (changes.enabled) {
      enabled = changes.enabled.newValue !== false;
      if (!enabled) hide();
    }
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
      overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
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
