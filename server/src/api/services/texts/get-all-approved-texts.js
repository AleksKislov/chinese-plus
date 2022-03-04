const Text = require("../../../models/Text");

async function getAllApprovedTexts(req, res) {
  const texts = await Text.find({ isApproved: 1 })
    .sort({ date: -1 })
    .select("date title level categoryInd likes hits user name _id comments_id");

  return res.json(texts);
}

module.exports = { getAllApprovedTexts };
