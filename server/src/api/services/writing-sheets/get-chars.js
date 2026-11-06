const { getHskIndex, withDictInfo } = require('./hsk-chars');
const { HAN_RE } = require('./pinyin');

const MAX_CHARS = 60;

// any characters typed by the user, readings taken from HSK 3.0 / HSK 2.0 words where possible
async function getChars(req, res) {
  const chars = [...new Set([...String(req.query.chars || '')].filter((ch) => HAN_RE.test(ch)))];
  const [hsk3, hsk2] = await Promise.all([getHskIndex('3'), getHskIndex('2')]);
  const known = new Map([...hsk2, ...hsk3].map((x) => [x.ch, x.py]));

  res.json(
    await withDictInfo(chars.slice(0, MAX_CHARS).map((ch) => ({ ch, py: known.get(ch) || '' }))),
  );
}

module.exports = { getChars };
