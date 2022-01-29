const Lexicon = require("../../../models/Lexicon");

async function getHskByLvlAndLimit(req, res) {
  const WORDS_NUM = 200;
  const level = req.query.hsk_level || "1";
  const limit = Number(req.query.limit) || 0;

  const firstIdPerLvl = {
    1: 0,
    2: 150,
    3: 300,
    4: 600,
    5: 1200,
    6: 2500,
  };

  const start = firstIdPerLvl[level] + WORDS_NUM * limit;
  const end = start + WORDS_NUM + 1;

  const allLexicon = await Lexicon.find({
    level,
    word_id: { $gt: start, $lt: end },
  }).sort({ word_id: 1 });

  res.json(allLexicon);
}

module.exports = { getHskByLvlAndLimit };
