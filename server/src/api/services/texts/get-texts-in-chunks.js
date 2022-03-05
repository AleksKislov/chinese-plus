const Text = require("../../../models/Text");

async function getTextsInChunks(req, res) {
  const { skip, categoryInd } = req.query;
  const searchQuery = categoryInd ? { isApproved: 1, categoryInd } : { isApproved: 1 };
  const skipNum = skip && /^\d+$/.test(skip) ? Number(skip) : 0;
  const texts = await Text.find(searchQuery, undefined, {
    skip: skipNum,
    limit: 10,
  })
    .sort({ date: -1 })
    .select("-origintext -translation -chinese_arr -pages");

  return res.json(texts);
}

module.exports = { getTextsInChunks };
