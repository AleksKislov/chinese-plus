const Text = require('../../../models/Text');

async function getByUserId(req, res) {
  const texts = await Text.find({ user: req.params.userId })
    .sort({ date: -1 })
    .select('title level categoryInd likes hits _id comments_id');
  return res.json(texts);
}

module.exports = { getByUserId };
