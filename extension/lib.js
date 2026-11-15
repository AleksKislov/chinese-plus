/**
 * Shared by content.js (the popup on pages) and the extension's own pages (popup.html,
 * dictionary.html, search.js): rendering of dictionary entries, pinyin tone colors, speech, copy,
 * icons. A plain script, loaded before them (manifest content_scripts, <script> tags): exposes
 * globalThis.ChinesePlusLib. Built with DOM APIs only (no innerHTML).
 */
(() => {
  const SITE_URL = 'https://www.chineseplus.club';

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
  function renderSense(node, toneColors = false) {
    const wrap = el('div');
    const line = el('div', 'sense');
    if (node.m) {
      if (node.k) line.append(el('span', 'strong', node.m), ' ');
      else line.append(`${node.m}) `);
    }
    if (node.p) line.append(pinyinEl('span', 'pinyin', node.p, toneColors), ' ');
    if (node.l) line.append(el('span', 'label', node.l.join(' ')), ' ');
    if (node.c) node.c.forEach((inline) => renderInline(line, inline));
    else if (node.t) line.append(node.t);
    wrap.append(line);
    if (node.s?.length) {
      const children = el('div', 'children');
      node.s.forEach((child) => children.append(renderSense(child, toneColors)));
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
  function pinyinEl(tag, className, pinyin, toneColors = false) {
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

  /** The entry as plain text: word, pinyin, meanings (one per line), referenced words' meanings. */
  function entryText({ word, trad, entries, refs }) {
    const lines = [trad ? `${word} (${trad})` : word];
    for (const [pinyin, senses] of entries) {
      if (pinyin) lines.push(pinyin);
      senses.forEach((sense) => lines.push(...senseLines(sense, 0)));
    }
    for (const [refWord, refEntries] of Object.entries(refs || {})) {
      for (const [pinyin, senses] of refEntries) {
        lines.push(`→ ${refWord}${pinyin ? ` ${pinyin}` : ''}`);
        senses.forEach((sense) => lines.push(...senseLines(sense, 1)));
      }
    }
    return lines.join('\n');
  }

  /**
   * The meaning of the words a reference-only entry points to ("см. 一会儿"), from `match.refs`
   * (background.js): shown under the entry, the reference itself stays a link. Null: none.
   */
  function renderRefs(refs, toneColors = false) {
    const words = Object.keys(refs || {});
    if (!words.length) return null;
    const box = el('div', 'refs');
    for (const word of words) {
      for (const [pinyin, senses] of refs[word]) {
        const block = el('div', 'ref-meaning');
        const head = el('div', 'ref-head');
        head.append(el('span', 'ref-word', word));
        if (pinyin) head.append(' ', pinyinEl('span', 'ref-pinyin', pinyin, toneColors));
        block.append(head);
        senses.forEach((sense) => block.append(renderSense(sense, toneColors)));
        box.append(block);
      }
    }
    return box;
  }

  /** `container`: where the fallback's hidden textarea goes (the popup's shadow root). */
  async function copyText(text, container = document.body) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // http pages, or the page's permissions policy forbids it: the old way
    }
    const area = el('textarea');
    area.value = text;
    area.style.cssText = 'position: fixed; top: 0; left: 0; opacity: 0;';
    container.append(area);
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

  // ---------- icons ----------

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

  const hskLabel = (level) => (level === '789' ? '7–9' : level);

  globalThis.ChinesePlusLib = {
    SITE_URL,
    el,
    dictionaryUrl,
    renderSense,
    pinyinEl,
    canSpeak,
    speak,
    entryText,
    renderRefs,
    copyText,
    icon,
    hskLabel,
  };
})();
