const Text = require("../../../models/Text");

async function getApprovedTextsNum(req, res) {
  const allTexts = await Text.find().select("isApproved");
  const approvedTexts = allTexts.filter((x) => x.isApproved);
  const notApproved = allTexts.length - approvedTexts.length;
  return res.json({ total, approved, notApproved });
}

module.exports = { getApprovedTextsNum };
