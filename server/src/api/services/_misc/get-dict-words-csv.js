const { Parser } = require('@json2csv/plainjs');
const { markupSenses, sensesToText, escapeHtml } = require('./mark-up-senses');
const { findTranslations } = require('../dictionary/translations/attach-senses');
const DictionaryExample = require('../../../models/DictionaryExample');

const SPAN_OPEN = `<span style='color: green; font-size: 1.5em;'>`;

// examples of the shown translations (`translations`: word id -> { lang }), grouped by word id;
// filtered by language here: an $or of { wordId, lang } pairs is ~15x slower than $in
const findExamples = async (translations) => {
  if (!translations.size) return new Map();
  const docs = await DictionaryExample.find(
    { wordId: { $in: [...translations.keys()] } },
    { _id: 0, chinese: 0 },
  )
    .sort({ order: 1 })
    .lean();
  const byWord = new Map();
  docs.forEach(({ lang, ...ex }) => {
    const key = String(ex.wordId);
    if (translations.get(key).lang !== lang) return;
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
  const translations = await findTranslations(wordIds);
  const examplesById = hasExamples && isHtml ? await findExamples(translations) : new Map();
  const sensesById = new Map([...translations].map(([key, t]) => [key, t.senses]));

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
