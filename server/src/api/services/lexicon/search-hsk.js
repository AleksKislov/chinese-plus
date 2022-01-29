const Lexicon = require("../../../models/Lexicon");

async function searchHsk(req, res) {
  const lexicon = await Lexicon.find({ chinese: { $regex: req.body.chinese } });
  res.json(lexicon);
}

module.exports = { searchHsk };
