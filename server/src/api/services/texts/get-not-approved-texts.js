const Text = require("../../../models/Text");
const { shortUserInfoFields } = require("../../consts");

async function getNotApprovedTexts(req, res) {
  const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;
  const foundTexts = await Text.find({ isApproved: { $ne: 1 } }, undefined, {
    skip,
    limit: 10,
  })
    .sort({ date: -1 })
    .select("-origintext -translation -chinese_arr -pages -name")
    .populate("user", shortUserInfoFields);

  const texts = foundTexts.sort((a, b) => b.date - a.date);
  return res.json(texts);
}

module.exports = { getNotApprovedTexts };
