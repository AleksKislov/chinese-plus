const Dictionary = require('../../../models/Dictionary');

const WILDCARD_CHAR = '*';
const MAX_PATTERN_LENGTH = 6;
const RESULTS_LIMIT = 300;
const HAN_CHAR = /\p{Script=Han}/u;

function escapeRegExp(char) {
  return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPatternRegex(chars) {
  const body = chars.map((char) => (char === WILDCARD_CHAR ? '.' : escapeRegExp(char))).join('');
  return new RegExp(`^${body}$`);
}

async function wildcardSearch(req, res) {
  const { pattern } = req.body;

  if (typeof pattern !== 'string' || !pattern.length) {
    throw new Error('pattern is required');
  }

  const chars = [...pattern];

  if (chars.length > MAX_PATTERN_LENGTH) {
    throw new Error(`pattern must be at most ${MAX_PATTERN_LENGTH} characters long`);
  }
  if (!chars.some((char) => char !== WILDCARD_CHAR)) {
    throw new Error('pattern must contain at least one chinese character');
  }
  if (!chars.every((char) => char === WILDCARD_CHAR || HAN_CHAR.test(char))) {
    throw new Error('pattern must only contain chinese characters or "?"');
  }

  const regex = buildPatternRegex(chars);
  const words = await Dictionary.find({
    $or: [{ chinese: { $regex: regex } }, { tradChinese: { $regex: regex } }],
  })
    .select('-date -edited -previous -updatedAt')
    .limit(RESULTS_LIMIT);

  res.json(words);
}

module.exports = { wildcardSearch, WILDCARD_CHAR, MAX_PATTERN_LENGTH };
