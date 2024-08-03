const Hskword = require('../../../models/Hskword');

async function getRandomNewHskByLvl(req, res) {
  const lvl = req.query.hsk_level || '1';

  const allLexicon = await Hskword.aggregate([
    { $match: { lvl } },
    { $sample: { size: 150 } },
    { $project: { _id: 0, __v: 0 } },
  ]);

  res.json(allLexicon);
}

module.exports = { getRandomNewHskByLvl };
