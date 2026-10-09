const crypto = require('crypto');

// syllabus sections, in the order they appear in HSK 考试大纲
const GRAMMAR_CATEGORIES = [
  'morphemes', // 语素
  'word-classes', // 词类
  'phrases', // 短语
  'sentence-parts', // 句子成分
  'sentence-types', // 句子的类型
  'aspects', // 动作的态
  'expressions', // 特殊表达法
  'discourse', // 语段（句群）
];

const GRAMMAR_LEVELS = ['1', '2', '3', '4', '5', '6', '789'];

// `cn` of examples is segmented with spaces between words ("我 是 学生。");
// the sentence as it is spoken / read, without them ("我是学生。").
// Spaces between Latin letters or digits are kept ("iPhone 15").
const plainCn = (cn) => cn.trim().replace(/(?<![A-Za-z0-9])\s+|\s+(?![A-Za-z0-9])/g, '');

// audio is keyed by the sentence itself: editing `cn` gives a new file,
// identical sentences share one; re-segmenting (moving spaces) keeps the file
const exampleAudioPath = (cn) =>
  `grammar/${crypto.createHash('sha1').update(plainCn(cn)).digest('hex').slice(0, 16)}.mp3`;

module.exports = { GRAMMAR_CATEGORIES, GRAMMAR_LEVELS, plainCn, exampleAudioPath };
