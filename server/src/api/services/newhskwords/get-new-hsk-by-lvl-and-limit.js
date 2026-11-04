const { aggregateHskWords } = require('./get-hsk-model');

async function getNewHskByLvlAndLimit(req, res) {
  const WORDS_NUM = 200;
  const lvl = req.query.hsk_level;
  const limit = Number(req.query.limit) || 0;
  const start = 0 + limit * WORDS_NUM;
  const end = start + WORDS_NUM + 1;

  const allLexicon = await aggregateHskWords(req.query.version, [
    { $match: { lvl, id: { $gt: start, $lt: end } } },
    { $sort: { id: 1 } },
  ]);

  res.json(allLexicon);
}

module.exports = { getNewHskByLvlAndLimit };
