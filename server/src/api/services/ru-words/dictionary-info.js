const DictionaryTranslation = require('../../../models/DictionaryTranslation');
const DictionaryExample = require('../../../models/DictionaryExample');
const Hskword2025 = require('../../../models/Hskword2025');

/**
 * What the dictionary and the HSK 3.0 list add to a curated word: the meanings of its characters,
 * example sentences and audio.
 */

const MAX_MEANING_LEN = 60;
const MAX_EXAMPLES = 6;
const MAX_EXAMPLE_LEN = 30; // characters of the Chinese sentence: short ones read best
const CYRILLIC_WORD_RE = /[а-яё]{2,}/i;

const shorten = (text) => {
  const parts = text
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);
  let meaning = parts.slice(0, 2).join('; ');
  if (meaning.length > MAX_MEANING_LEN) meaning = parts[0];
  if (meaning.length > MAX_MEANING_LEN) meaning = meaning.slice(0, MAX_MEANING_LEN - 1) + '…';
  return meaning;
};

/** first real meaning in parsed senses: 山 -> "гора; горный", references ("см. 茉莉") skipped */
function firstMeaning(senses) {
  for (const node of senses || []) {
    const isRef = (node.labels || []).some((l) => l.startsWith('см'));
    // drop clarifications: "благодарить (кого-л., за что-л.)" -> "благодарить"
    const text = (node.text || '').replace(/\s*\([^()]*\)/g, '').trim();
    if (
      !isRef &&
      CYRILLIC_WORD_RE.test(text) &&
      !/^(см\.|только в сочетании|примечание)/i.test(text)
    ) {
      return shorten(text);
    }
    const nested = firstMeaning(node.senses);
    if (nested) return nested;
  }
  return '';
}

/** { "妈": "мама; мать" }: the Russian meaning of each of the words (characters) */
async function ruMeanings(chinese) {
  if (!chinese.length) return {};
  const docs = await DictionaryTranslation.find({ chinese: { $in: chinese }, lang: 'ru' })
    .select('-_id chinese senses')
    .lean();
  const meanings = {};
  for (const doc of docs) {
    if (!meanings[doc.chinese]) meanings[doc.chinese] = firstMeaning(doc.senses);
  }
  return meanings;
}

/** short example sentences with the word, from the dictionary */
async function examplesOf(cn) {
  const docs = await DictionaryExample.find({ chinese: cn, lang: 'ru', zh: { $nin: [null, ''] } })
    .select('-_id zh pinyin translation order')
    .sort({ order: 1 })
    .limit(60)
    .lean();
  const seen = new Set();
  return docs
    .filter((e) => e.translation && [...e.zh].length <= MAX_EXAMPLE_LEN && e.zh !== cn)
    .filter((e) => !seen.has(e.zh) && seen.add(e.zh))
    .slice(0, MAX_EXAMPLES)
    .map(({ zh, pinyin, translation }) => ({ zh, pinyin, translation }));
}

/** { "妈妈": { hsk: "1", audio: "newhsk/band1/5.mp3" } }: the lowest HSK 3.0 level of each word */
async function hskInfo(chinese) {
  if (!chinese.length) return {};
  const docs = await Hskword2025.find({ cn: { $in: chinese } })
    .select('-_id cn lvl audio')
    .lean();
  const info = {};
  for (const d of docs.sort((a, b) => (a.lvl || '').localeCompare(b.lvl || ''))) {
    if (!info[d.cn]) info[d.cn] = { hsk: d.lvl, audio: d.audio || null };
    else if (!info[d.cn].audio && d.audio) info[d.cn].audio = d.audio;
  }
  return info;
}

module.exports = { ruMeanings, examplesOf, hskInfo };
