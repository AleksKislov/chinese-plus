const nodejieba = require('nodejieba');
const { getAllWords, shortenTranslation } = require('../../../../routes/api/services');

const HAN = /\p{Script=Han}/u;
const HAN_RUN = /(\p{Script=Han}+)/u;

// The LLM returns plain sentences; this splits them into words for tooltips with nodejieba
// (as for books). Only Chinese runs are segmented, the rest stays as is:
// 'Слово «苹果» значит' -> ['Слово «', '苹果', '» значит']
function segmentText(text) {
  return text
    .split(HAN_RUN)
    .filter(Boolean)
    .flatMap((part) => (HAN.test(part) ? nodejieba.cut(part) : [part]));
}

// replaces `words` of assistant blocks with `segments` (dictionary word objects or plain strings)
async function attachTooltips(messages) {
  const blocks = messages.flatMap((m) => m.blocks || []);
  const allWords = new Set();
  blocks.forEach((b) => b.words.forEach((w) => HAN.test(w) && allWords.add(w)));

  const byChinese = new Map();
  if (allWords.size) {
    const dictWords = await getAllWords([...allWords]).lean();
    dictWords.forEach((w) => {
      w.russian = shortenTranslation(w.russian);
      if (!byChinese.has(w.chinese)) byChinese.set(w.chinese, w);
    });
  }

  blocks.forEach((b) => {
    b.segments = b.words.length ? b.words.map((w) => byChinese.get(w) || w) : [b.text];
    delete b.words;
  });
  return messages;
}

module.exports = { segmentText, attachTooltips };
