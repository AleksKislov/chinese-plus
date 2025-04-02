const { Parser } = require('@json2csv/plainjs');
const { markupTranslation } = require('./mark-up-translation');

const SPAN_OPEN = `<span style='color: green; font-size: 1.5em;'>`;

const getDictWordsCsv = (allWords, hasExamples, isHtml) => {
  const json2csv = new Parser({ fields: ['chinese', 'pinyin', 'russian'] });

  if (isHtml) {
    allWords.forEach((word) => {
      word.russian = `${SPAN_OPEN}${word.pinyin}</span><br>${markupTranslation(word.russian, hasExamples)}`;
    });
  }

  return json2csv.parse(allWords);
};

module.exports = { getDictWordsCsv };
