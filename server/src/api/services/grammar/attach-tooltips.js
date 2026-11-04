const { getAllWords } = require('../../../../routes/api/services');
const { attachSenses } = require('../dictionary/translations/attach-senses');

// adds `segments` (dictionary word objects or plain strings) to every example
async function attachTooltips(topics) {
  const allWords = new Set();
  topics.forEach((t) =>
    t.rules.forEach((r) => r.examples.forEach((ex) => ex.words.forEach((w) => allWords.add(w)))),
  );

  const dictWords = await attachSenses(await getAllWords([...allWords]).lean());
  const byChinese = new Map();
  dictWords.forEach((w) => {
    if (!byChinese.has(w.chinese)) byChinese.set(w.chinese, w);
  });

  topics.forEach((t) =>
    t.rules.forEach((r) =>
      r.examples.forEach((ex) => {
        ex.segments = ex.words.length ? ex.words.map((w) => byChinese.get(w) || w) : [ex.cn];
        delete ex.words;
      }),
    ),
  );
  return topics;
}

module.exports = { attachTooltips };
