// @todo move to BD
// also here client/src/constants/consts.json
const symbolsToIgnore = [
  ' ',
  '．',
  '。',
  '，',
  '、',
  '：',
  '“',
  '”',
  '？',
  '?',
  '!',
  '！',
  '；',
  ';',
  ',',
  '.',
  '（ ',
  '）',
  '【',
  '】',
  '［',
  '］',
  '(',
  ')',
  '》',
  '《',
  '‧',
  '〈',
  '〉',
  "'",
  '_',
  '-',
  '—',
  '「',
  '」',
];

/**
 * for counting Chinese characters in Paragraph component
 * @param {string} str  - Chinese text
 * @returns {number}    - number of Chinese chars in str w/o spaces
 */
const countZnChars = (str) => {
  if (!str) return 0;

  symbolsToIgnore.forEach((char) => {
    str = str.replaceAll(char, '');
  });
  return str.length;
};

const countUniqChars = (str) => {
  if (!str) return 0;

  const symbolsToIgnoreSet = new Set(symbolsToIgnore);
  const chars = str.split('').filter((char) => !symbolsToIgnoreSet.has(char));
  return new Set(chars).size;
};

module.exports = { countZnChars, countUniqChars };
