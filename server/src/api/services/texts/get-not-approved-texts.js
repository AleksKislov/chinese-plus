const Text = require("../../../models/Text");

async function getNotApprovedTexts(req, res) {
  const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;
  const foundTexts = await Text.find(
    { name: { $ne: "admin" }, isApproved: { $ne: 1 } },
    undefined,
    {
      skip,
      limit: 10,
    }
  )
    .sort({ date: -1 })
    .select("-origintext -translation -chinese_arr -pages");

  const texts = foundTexts.sort((a, b) => b.date - a.date);
  return res.json(texts);
}

module.exports = { getNotApprovedTexts };