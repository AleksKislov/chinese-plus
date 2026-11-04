const DictionaryTranslation = require('../../../../models/DictionaryTranslation');
const { pickTranslations } = require('./langs');

// sense text shown in tooltips and list rows (HSK tables, search results, user words)
const SHORT_TRANSLATION_CHARS = 150;
// a sense that would be cut shorter than this is left out instead (unless it is the first one)
const MIN_CUT_CHARS = 20;
const ELLIPSIS = '…';

/**
 * The translation the site shows ({ wordId, lang, senses }: russian, else a fallback language,
 * see langs.js) by dictionary word id (as a string), for the words that have one.
 */
async function findTranslations(wordIds) {
  if (!wordIds.length) return new Map();
  const docs = await DictionaryTranslation.find(
    { wordId: { $in: wordIds } },
    { _id: 0, wordId: 1, lang: 1, senses: 1 },
  ).lean();
  return pickTranslations(docs);
}

/** Parsed senses of the shown translation by dictionary word id (as a string). */
async function findSenses(wordIds) {
  const translations = await findTranslations(wordIds);
  return new Map([...translations].map(([key, t]) => [key, t.senses]));
}

// "получать, добывать; обретать" -> "получать, добывать…": at most n chars, at a word boundary
const cutText = (text, n) => {
  const cut = text.slice(0, n);
  const space = cut.lastIndexOf(' ');
  return (space > 0 ? cut.slice(0, space) : cut).replace(/[\s,;:(—–-]+$/, '') + ELLIPSIS;
};

// a node whose text is cut to n chars, its `content` cut the same way
const cutNode = (node, n) => {
  const text = cutText(node.text, n);
  if (!node.content) return { ...node, text };

  let left = text.length - ELLIPSIS.length;
  const content = [];
  for (const part of node.content) {
    if (left <= 0) break;
    content.push({ ...part, value: part.value.slice(0, left) });
    left -= part.value.length;
  }
  const last = content[content.length - 1];
  if (last) last.value = last.value.trimEnd();
  content.push({ type: 'text', value: ELLIPSIS });
  return { ...node, text, content };
};

/**
 * Copy of the senses tree for tooltips and list rows: the first homonym only (when there are
 * several) and the first ~maxChars of sense text in reading order, the last sense that does not
 * fit cut with "…"; without example counts (lists show no examples).
 */
function trimSenses(senses, maxChars = SHORT_TRANSLATION_CHARS) {
  const homonyms = senses.filter((n) => n.kind === 'homonym');
  const list = homonyms.length > 1 ? senses.slice(0, senses.indexOf(homonyms[1])) : senses;

  let budget = maxChars;
  let keptText = false;
  const walk = (nodes) => {
    const out = [];
    for (const node of nodes) {
      if (budget <= 0) break;
      const { senses: children, exampleCount, ...rest } = node;
      const length = (node.text || '').length;

      if (length > budget) {
        if (budget >= MIN_CUT_CHARS || !keptText) out.push(cutNode(rest, budget));
        budget = 0;
        break;
      }

      budget -= length;
      keptText = keptText || length > 0;
      const kept = children ? walk(children) : [];
      out.push(kept.length ? { ...rest, senses: kept } : rest);
    }
    return out;
  };
  return walk(list);
}

/**
 * Adds `senses` (trimmed parsed translation) to plain word objects whose dictionary entry
 * has one.
 * @param {object[]} words - plain objects (lean), modified in place
 * @param {{ idField?: string }} fields - the field with the dictionary entry id
 */
async function attachSenses(words, { idField = '_id' } = {}) {
  const sensesById = await findSenses(words.map((w) => w[idField]).filter(Boolean));
  for (const word of words) {
    const senses = word[idField] && sensesById.get(String(word[idField]));
    if (senses) word.senses = trimSenses(senses);
  }
  return words;
}

module.exports = { attachSenses, findSenses, findTranslations, trimSenses };
