const { Parser } = require('@json2csv/plainjs');
const { markupSenses, sensesToText, escapeHtml } = require('./mark-up-senses');
const { findSenses } = require('../dictionary/translations/attach-senses');
const DictionaryExample = require('../../../models/DictionaryExample');

const SPAN_OPEN = `<span style='color: green; font-size: 1.5em;'>`;

// examples of the given dictionary words, grouped by word id
const findExamples = async (wordIds) => {
  const docs = await DictionaryExample.find(
    { wordId: { $in: wordIds } },
    { _id: 0, chinese: 0, lang: 0 },
  )
    .sort({ order: 1 })
    .lean();
  const byWord = new Map();
  docs.forEach((ex) => {
    const key = String(ex.wordId);
    byWord.set(key, [...(byWord.get(key) || []), ex]);
  });
  return byWord;
};

/**
 * @param {{ chinese, pinyin, wordId?, translation? }[]} allWords - `wordId`: dictionary entry, whose
 *   parsed translation (and examples) is used; `translation`: plain text of the HSK 2.0 words
 *   (lexicons), which keep their own
 */
const getDictWordsCsv = async (allWords, hasExamples, isHtml) => {
  const json2csv = new Parser({ fields: ['chinese', 'pinyin', 'russian'] });

  const wordIds = allWords.map((w) => w.wordId).filter(Boolean);
  const [sensesById, examplesById] = await Promise.all([
    findSenses(wordIds),
    hasExamples && isHtml ? findExamples(wordIds) : new Map(),
  ]);

  // the column keeps its old name `russian`
  const rows = allWords.map(({ chinese, pinyin, wordId, translation = '' }) => {
    const senses = wordId && sensesById.get(String(wordId));
    if (!isHtml) return { chinese, pinyin, russian: senses ? sensesToText(senses) : translation };

    const html = senses
      ? markupSenses(senses, examplesById.get(String(wordId)))
      : escapeHtml(translation);
    return { chinese, pinyin, russian: `${SPAN_OPEN}${pinyin}</span><br>${html}` };
  });

  return json2csv.parse(rows);
};

module.exports = { getDictWordsCsv };
