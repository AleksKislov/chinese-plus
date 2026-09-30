const { aggregateHskWords } = require('./get-hsk-model');

async function getRandomNewHskByLvl(req, res) {
  const lvl = req.query.hsk_level || '1';

  const allLexicon = await aggregateHskWords(req.query.version, [
    { $match: { lvl } },
    { $sample: { size: 150 } },
    { $project: { _id: 0, __v: 0 } },
  ]);

  res.json(allLexicon);
}

module.exports = { getRandomNewHskByLvl };
