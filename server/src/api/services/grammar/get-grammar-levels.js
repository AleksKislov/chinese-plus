const Grammar = require('../../../models/Grammar');
const { GRAMMAR_LEVELS } = require('./consts');

// [{ level: '1', count: 49 }, ...]
async function getGrammarLevels(req, res) {
  const counts = await Grammar.aggregate([{ $group: { _id: '$level', count: { $sum: 1 } } }]);
  const levels = counts
    .map(({ _id, count }) => ({ level: _id, count }))
    .sort((a, b) => GRAMMAR_LEVELS.indexOf(a.level) - GRAMMAR_LEVELS.indexOf(b.level));
  res.json(levels);
}

module.exports = { getGrammarLevels };
