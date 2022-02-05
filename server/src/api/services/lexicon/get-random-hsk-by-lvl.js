const Lexicon = require("../../../models/Lexicon");

async function getRandomHskByLvl(req, res) {
  const level = Number(req.query.hsk_level) || 1;

  const allLexicon = await Lexicon.aggregate([
    { $match: { level } },
    { $sample: { size: 150 } },
    { $project: { _id: 0, __v: 0 } },
  ]);

  res.json(allLexicon);
}

module.exports = { getRandomHskByLvl };
