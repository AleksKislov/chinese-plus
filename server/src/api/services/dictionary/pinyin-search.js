const Dictionary = require('../../../models/Dictionary');

const MAX_PATTERN_LENGTH = 30;
const RESULTS_LIMIT = 300;
const LATIN_ONLY = /^[a-z]+$/i;

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function pinyinSearch(req, res) {
  const { pinyin } = req.body;

  if (typeof pinyin !== 'string' || !pinyin.length) {
    throw new Error('pinyin is required');
  }

  const pattern = pinyin.trim().toLowerCase();

  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new Error(`pinyin must be at most ${MAX_PATTERN_LENGTH} characters long`);
  }
  if (!LATIN_ONLY.test(pattern)) {
    throw new Error('pinyin must only contain latin letters');
  }

  const words = await Dictionary.find({
    cleanPinyin: { $regex: escapeRegExp(pattern) },
  })
    .select('-date -edited -previous -updatedAt')
    .limit(RESULTS_LIMIT);

  res.json(words);
}

module.exports = { pinyinSearch };
