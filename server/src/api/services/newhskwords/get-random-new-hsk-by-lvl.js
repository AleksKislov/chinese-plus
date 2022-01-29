const Hskword = require("../../../models/Hskword");

async function getRandomNewHskByLvl(req, res) {
  const lvl = req.query.hsk_level || "1";

  const allWords = await Hskword.find({ lvl }).sort({ id: 1 });
  res.json(allWords);
}

module.exports = { getRandomNewHskByLvl };
