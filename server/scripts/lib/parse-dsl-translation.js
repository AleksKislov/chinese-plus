/**
 * Parser for the DSL-style markup (BKRS / Lingvo) stored in `dictionaries.russian`.
 *
 * Input markup:
 *   [m1]..[/m] .. [m4]..[/m]   one line, N = indentation level
 *   [b]I[/b], [b]II liǎo[/b]   homonym / reading group (roman numeral, optional pinyin)
 *   [b]А[/b]                   section inside a homonym (capital cyrillic letter)
 *   1) .. / а) .. / (1) ..     numbered sense / sub-sense
 *   [p]..[/p], [c]..[/c]       label (part of speech, style: гл., диал., см., ...)
 *   [c violet|crimson]..[/c]   label;  [c brown] english gloss;  [c green] pinyin
 *   [i]..[/i]                  comment / explanation
 *   [ref]..[/ref]              link to another dictionary word
 *   [*][ex]zh ru[/ex][/*]      example (also [e]..[/e]); [*] alone is just a wrapper
 *   \[ .. \]                   literal brackets (optional part of a translation)
 *   [m1]-----[/m]              separator between homonyms in some entries
 *   [m1][p]сущ.[/p][/m]        line with labels only: header for the numbered senses below it
 *
 * Output (see parseTranslation):
 *   {
 *     lang: 'ru' | 'en' | 'zh',
 *     senses: [Node],
 *     examples: [{ senseId, zh, pinyin?, labels?, translation, content? }],
 *     // senseId is the node's position: '2.1' = senses[1].senses[0], null = not under a sense
 *     warnings: [String],
 *   }
 *
 *   Node {
 *     kind?: 'homonym' | 'section',      // absent for ordinary senses
 *     marker?: 'I' | 'А' | '1' | 'а',
 *     pinyin?: String,
 *     labels?: [String],                 // leading labels: ['гл.'], ['см.'], ['диал.']
 *     text?: String,                     // plain text, markup removed
 *     content?: [Inline],                // only when text has markup (refs, comments, ...)
 *     exampleCount?: Number,
 *     senses?: [Node],
 *   }
 *
 *   Inline { type: 'text' | 'label' | 'comment' | 'ref' | 'pinyin' | 'en' | 'strong', value }
 */

const ESC_OPEN = '';
const ESC_CLOSE = '';

const TAG_RE = /\[(\/?)(m\d?|b|i|p|c|ref|ex|e|\*)(?:\s+([^\]]*))?\]/g;
const LEFTOVER_TAG_RE = /\[\/?(?:m\d|b|i|p|c|ref|ex|e|\*)(?:\s[^\]]*)?\]/;

const CYRILLIC_RE = /[а-яё]/i;
const CJK_RE = /[㐀-鿿豈-﫿]/;
const CJK_GLOBAL_RE = /[㐀-鿿豈-﫿]/g;
const LATIN_RE = /[a-z]/i;
const PINYIN_RE =
  /^[a-zA-ZāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêÜĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙ'’\-\s,;]+$/;
const ROMAN_RE = /^\s*(I{1,3}|IV|VI{0,3}|IX|X)(?![a-zA-Z])\s*(.*)$/s;
const SECTION_RE = /^\s*([А-ЯЁ])\s*$/;
const NUM_RE = /^\s*\(?(\d+)\)\s*/;
const SUB_RE = /^\s*([а-яё])\)\s*/;
const SEPARATOR_RE = /^\s*-{3,}\s*$/;

// `header` is a line with labels only ("[m1][p]сущ.[/p][/m]") that groups the senses below it
const RANK = { homonym: 1, section: 2, header: 2.5, num: 3, sub: 4, plain: 5 };

const unescape = (s) => s.replace(new RegExp(ESC_OPEN, 'g'), '[').replace(new RegExp(ESC_CLOSE, 'g'), ']');
const squash = (s) => s.replace(/\s+/g, ' ');
const isPinyin = (s) => {
  const t = s.trim();
  return t.length > 0 && t.length <= 60 && LATIN_RE.test(t) && PINYIN_RE.test(t);
};

/** Splits the raw string into tokens: { tag, close, arg } | { text }. */
function tokenize(raw) {
  const src = raw.replace(/\\\[/g, ESC_OPEN).replace(/\\\]/g, ESC_CLOSE);
  const tokens = [];
  let last = 0;
  for (const m of src.matchAll(TAG_RE)) {
    if (m.index > last) tokens.push({ text: src.slice(last, m.index) });
    tokens.push({ tag: m[2], close: m[1] === '/', arg: (m[3] || '').trim() });
    last = m.index + m[0].length;
  }
  if (last < src.length) tokens.push({ text: src.slice(last) });
  return tokens;
}

/** Groups tokens into lines: [mN]..[/m] blocks and text found between them. */
function splitLines(tokens) {
  const lines = [];
  let current = null;
  let outside = [];
  const flushOutside = () => {
    if (outside.some((t) => t.tag || t.text.trim())) lines.push({ level: 1, tokens: outside });
    outside = [];
  };
  for (const t of tokens) {
    if (t.tag && /^m\d?$/.test(t.tag)) {
      if (!t.close) {
        flushOutside();
        if (current) lines.push(current);
        current = { level: Number(t.tag.slice(1)) || 1, tokens: [] };
      } else if (current) {
        lines.push(current);
        current = null;
      }
      continue;
    }
    (current ? current.tokens : outside).push(t);
  }
  if (current) lines.push(current);
  flushOutside();
  return lines;
}

function segmentType(style) {
  if (style.ref) return 'ref';
  if (style.p) return 'label';
  if (style.c !== undefined) {
    if (style.c === '' || style.c === 'violet' || style.c === 'crimson') return 'label';
    if (style.c === 'brown') return 'en';
    if (style.c === 'green') return 'pinyin';
  }
  if (style.b) return 'strong';
  if (style.i) return 'comment';
  return 'text';
}

/**
 * Turns line tokens into inline segments, separating example regions.
 * Tags are matched tolerantly (the data has mis-nested [c][i]..[/c][/i]).
 */
function toSegments(tokens, warnings) {
  const parts = [{ example: false, segs: [] }];
  const style = {};
  let inExample = null;

  const push = (type, value) => {
    const segs = parts[parts.length - 1].segs;
    const prev = segs[segs.length - 1];
    if (prev && prev.type === type) prev.value += value;
    else segs.push({ type, value });
  };

  for (const t of tokens) {
    if (t.text !== undefined) {
      push(segmentType(style), t.text);
      continue;
    }
    if (t.tag === '*') continue;
    if (t.tag === 'ex' || t.tag === 'e') {
      if (!t.close && !inExample) {
        inExample = t.tag;
        parts.push({ example: true, segs: [] });
      } else if (t.close && inExample === t.tag) {
        inExample = null;
        parts.push({ example: false, segs: [] });
      }
      continue;
    }
    const key = t.tag;
    if (t.close) {
      if (style[key] === undefined) warnings.push(`unopened [/${key}]`);
      delete style[key];
    } else {
      style[key] = key === 'c' ? t.arg : true;
    }
  }

  return parts
    .map((p) => ({
      example: p.example,
      segs: p.segs
        .map((s) => ({ type: s.type, value: squash(unescape(s.value)) }))
        .filter((s) => s.value !== '' && (s.type === 'text' || s.value.trim() !== '')),
    }))
    .filter((p) => p.segs.some((s) => s.value.trim() !== ''));
}

function normalizeSegments(segs) {
  const out = segs.map((s) => {
    if ((s.type === 'strong' || s.type === 'pinyin') && isPinyin(s.value)) {
      return { type: 'pinyin', value: s.value };
    }
    if (s.type === 'pinyin') return { type: 'text', value: s.value };
    return s;
  });
  // merge neighbours of the same type again after retyping
  return out.reduce((acc, s) => {
    const prev = acc[acc.length - 1];
    if (prev && prev.type === s.type) prev.value += s.value;
    else acc.push({ ...s });
    return acc;
  }, []);
}

const cleanLabel = (s) =>
  s
    .trim()
    .replace(/^[[〈(]\s*/, '')
    .replace(/\s*[\]〉)]$/, '')
    .trim();

/** Builds { text, content? } from segments, trimming the edges. */
function buildText(segs) {
  const trimmed = segs.map((s) => ({ ...s }));
  while (trimmed.length && !trimmed[0].value.trim()) trimmed.shift();
  while (trimmed.length && !trimmed[trimmed.length - 1].value.trim()) trimmed.pop();
  if (!trimmed.length) return {};
  trimmed[0].value = trimmed[0].value.replace(/^\s+/, '');
  trimmed[trimmed.length - 1].value = trimmed[trimmed.length - 1].value.replace(/\s+$/, '');

  const text = squash(trimmed.map((s) => s.value).join('')).trim();
  if (!text) return {};
  const rich = trimmed.some((s) => s.type !== 'text');
  return rich ? { text, content: trimmed } : { text };
}

/** Parses one non-example line into a node with marker / pinyin / labels / text. */
function parseLine(segsIn) {
  const segs = normalizeSegments(segsIn);
  const node = {};
  let markerType = null;
  const labels = [];

  while (segs.length) {
    const s = segs[0];
    if (!s.value.trim()) {
      segs.shift();
      continue;
    }
    if (!markerType && (s.type === 'strong' || s.type === 'pinyin')) {
      const roman = s.value.match(ROMAN_RE);
      if (roman) {
        markerType = 'homonym';
        node.marker = roman[1];
        const rest = roman[2].trim();
        if (rest) segs[0] = { type: isPinyin(rest) ? 'pinyin' : 'strong', value: rest };
        else segs.shift();
        continue;
      }
      const section = s.value.match(SECTION_RE);
      if (section) {
        markerType = 'section';
        node.marker = section[1];
        segs.shift();
        continue;
      }
    }
    if (!markerType) {
      const num = s.value.match(NUM_RE) || (s.type === 'text' && s.value.match(SUB_RE));
      if (num) {
        markerType = /\d/.test(num[1]) ? 'num' : 'sub';
        node.marker = num[1];
        const rest = s.value.slice(num[0].length);
        if (rest.trim()) segs[0] = { type: s.type === 'pinyin' ? 'text' : s.type, value: rest };
        else segs.shift();
        continue;
      }
    }
    if (s.type === 'label') {
      const label = cleanLabel(s.value);
      if (label) labels.push(label);
      segs.shift();
      continue;
    }
    // "[b]III[/b] –[b]de[/b]"
    if (markerType === 'homonym' && !node.pinyin && s.type === 'text' && /^\s*[–-]\s*$/.test(s.value)) {
      segs.shift();
      continue;
    }
    if (s.type === 'pinyin' && !node.pinyin) {
      node.pinyin = s.value.trim().replace(/^-/, '');
      segs.shift();
      continue;
    }
    // "[c violet][方][/c]: 监狱" -> drop the separator left after labels
    if (s.type === 'text' && labels.length && /^\s*[:;,]/.test(s.value)) {
      s.value = s.value.replace(/^\s*[:;,]\s*/, '');
      if (!s.value) segs.shift();
      continue;
    }
    break;
  }

  if (labels.length) node.labels = labels;
  Object.assign(node, buildText(segs));
  if (markerType === 'homonym' || markerType === 'section') node.kind = markerType;
  if (!markerType && !node.text && node.labels) markerType = 'header';
  if (markerType === 'header') node.kind = 'section';
  return { node, rank: RANK[markerType || 'plain'] };
}

/** Splits an example into the chinese part and its translation. */
function parseExample(segsIn, warnings, lang) {
  const segs = normalizeSegments(segsIn);
  const example = {};

  // the translation starts at the first cyrillic (or latin for en) letter outside labels / pinyin
  const transRe = lang === 'en' ? /[a-z]/i : CYRILLIC_RE;
  let splitSeg = segs.length;
  let splitPos = 0;
  for (let i = 0; i < segs.length; i++) {
    if (segs[i].type === 'label' || segs[i].type === 'pinyin') continue;
    const pos = segs[i].value.search(transRe);
    if (pos !== -1) {
      splitSeg = i;
      splitPos = pos;
      break;
    }
  }

  const zhSegs = segs.slice(0, splitSeg);
  const trSegs = segs.slice(splitSeg + 1);
  if (splitSeg < segs.length) {
    const s = segs[splitSeg];
    if (splitPos > 0) zhSegs.push({ type: s.type, value: s.value.slice(0, splitPos) });
    trSegs.unshift({ type: s.type, value: s.value.slice(splitPos) });
  }

  // anything after the last CJK char of the chinese part (e.g. "(" or latin) belongs to the translation
  const labels = [];
  const pinyin = [];
  const zhText = [];
  for (const s of zhSegs) {
    if (s.type === 'label') labels.push(cleanLabel(s.value));
    else if (s.type === 'pinyin') pinyin.push(s.value.trim());
    else zhText.push(s);
  }
  const zhJoined = zhText.map((s) => s.value).join('');
  const lastCjk = (() => {
    let idx = -1;
    for (const m of zhJoined.matchAll(CJK_GLOBAL_RE)) idx = m.index;
    return idx;
  })();
  if (lastCjk === -1) {
    if (zhJoined.trim()) trSegs.unshift({ type: 'text', value: zhJoined });
  } else {
    // keep closing punctuation that follows the last CJK char (？！。…”) in the chinese part
    const tail = zhJoined.slice(lastCjk + 1);
    const keep = tail.match(/^[\s]*[？！。，、；：…”」』）?!.,;:"')]*/)[0].replace(/\s+$/, '');
    const cut = lastCjk + 1 + keep.length;
    example.zh = squash(zhJoined.slice(0, cut).replace(/\(\s*\)/g, '')).trim();
    const rest = zhJoined.slice(cut).replace(/\(\s*\)/g, '');
    if (rest.trim()) trSegs.unshift({ type: 'text', value: rest });
  }

  if (pinyin.length) example.pinyin = pinyin.join(' ');
  if (labels.filter(Boolean).length) example.labels = labels.filter(Boolean);

  // "在民在旗? [b]zàimínzàiqí[/b]? Вы китаец" -> drop punctuation left from the pinyin
  if (trSegs.length) trSegs[0] = { ...trSegs[0], value: trSegs[0].value.replace(/^[\s?？!！,，.。;；:：]+/, '') };
  const tr = buildText(trSegs);
  example.translation = tr.text || '';
  if (tr.content) example.content = tr.content;

  // reversed order: "колпачок ручки - 笔帽"
  const reversed = !example.zh && example.translation.match(/^(.*?)[\s\-–—:]*([㐀-鿿][^а-яё]*)$/i);
  if (reversed && reversed[1].trim()) {
    example.zh = reversed[2].trim();
    example.translation = reversed[1].trim();
    delete example.content;
  }

  if (!example.zh) warnings.push(`example without chinese: ${example.translation.slice(0, 60)}`);
  return example;
}

function detectLang(nodes) {
  let hasCjk = false;
  let hasLatin = false;
  const walk = (list) => {
    for (const n of list) {
      const s = `${n.text || ''} ${(n.labels || []).join(' ')}`;
      if (CYRILLIC_RE.test(s)) return true;
      if (CJK_RE.test(n.text || '')) hasCjk = true;
      if (LATIN_RE.test(n.text || '')) hasLatin = true;
      if (n.senses && walk(n.senses)) return true;
    }
    return false;
  };
  if (walk(nodes)) return 'ru';
  if (hasCjk) return 'zh';
  return hasLatin ? 'en' : 'ru';
}

function parseTranslation(raw) {
  const warnings = [];
  const roots = [];
  const stack = []; // { node, rank, level }
  const pendingExamples = []; // { owner, segs }

  const attach = (node, rank, level) => {
    const parent = stack.length ? stack[stack.length - 1].node : null;
    if (parent) (parent.senses = parent.senses || []).push(node);
    else roots.push(node);
    stack.push({ node, rank, level });
  };

  for (const line of splitLines(tokenize(raw || ''))) {
    const lineText = line.tokens.map((t) => t.text || '').join('');
    if (SEPARATOR_RE.test(lineText) && line.tokens.every((t) => t.text !== undefined)) {
      // "-----" separates homonyms: wrap what we have so far and start a new group
      if (!roots.some((n) => n.kind === 'homonym')) {
        const prev = roots.splice(0, roots.length);
        if (prev.length) roots.push({ kind: 'homonym', senses: prev });
      }
      stack.length = 0;
      attach({ kind: 'homonym' }, RANK.homonym, line.level);
      continue;
    }

    for (const part of toSegments(line.tokens, warnings)) {
      if (part.example) {
        const owner = stack.length ? stack[stack.length - 1].node : null;
        pendingExamples.push({ owner, segs: part.segs });
        continue;
      }

      const { node, rank } = parseLine(part.segs);
      if (!node.text && !node.marker && !node.labels && !node.pinyin) continue;

      // labels / pinyin right under an empty homonym or section describe it ("[b]I[/b]" + "[p]сущ.[/p]")
      const top = stack[stack.length - 1];
      if (
        !node.text &&
        !node.marker &&
        top &&
        top.rank <= RANK.section &&
        !top.node.text &&
        !top.node.senses
      ) {
        if (node.labels) top.node.labels = [...(top.node.labels || []), ...node.labels];
        if (node.pinyin && !top.node.pinyin) top.node.pinyin = node.pinyin;
        continue;
      }

      if (rank === RANK.plain) {
        while (stack.length) {
          const t = stack[stack.length - 1];
          if (t.rank <= RANK.header || t.level < line.level) break;
          stack.pop();
        }
      } else {
        while (stack.length) {
          const t = stack[stack.length - 1];
          const sameLevelSection = rank === RANK.header && t.rank === RANK.section && t.level >= line.level;
          if (t.rank < rank && !sameLevelSection) break;
          stack.pop();
        }
      }
      attach(node, rank, line.level);
    }
  }

  const assignIds = (list, prefix) => {
    list.forEach((n, i) => {
      n.id = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
      if (n.senses) assignIds(n.senses, n.id);
    });
  };
  assignIds(roots, '');

  const lang = detectLang(roots);

  const examples = pendingExamples.map(({ owner, segs }) => {
    if (owner) owner.exampleCount = (owner.exampleCount || 0) + 1;
    return { senseId: owner ? owner.id : null, ...parseExample(segs, warnings, lang) };
  });

  const checkLeftovers = (list) => {
    for (const n of list) {
      if (n.text && LEFTOVER_TAG_RE.test(n.text)) warnings.push(`leftover tag in: ${n.text.slice(0, 60)}`);
      if (n.senses) checkLeftovers(n.senses);
    }
  };
  checkLeftovers(roots);
  if (!roots.length && !examples.length) warnings.push('empty translation');

  return { lang, senses: orderKeys(roots), examples, warnings };
}

// node ids are only used for examples.senseId and are not stored: the path is the node's position
const KEY_ORDER = ['kind', 'marker', 'pinyin', 'labels', 'text', 'content', 'exampleCount', 'senses'];
function orderKeys(list) {
  return list.map((n) => {
    const out = {};
    for (const k of KEY_ORDER) if (n[k] !== undefined) out[k] = k === 'senses' ? orderKeys(n[k]) : n[k];
    return out;
  });
}

module.exports = { parseTranslation };
