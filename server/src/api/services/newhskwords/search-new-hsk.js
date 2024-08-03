const Hskword = require('../../../models/Hskword');

async function searchNewHsk(req, res) {
  const lexicon = await Hskword.find({ cn: { $regex: req.body.chinese } });
  res.json(lexicon);
}

module.exports = { searchNewHsk };
