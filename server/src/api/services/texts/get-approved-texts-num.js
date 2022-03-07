const Text = require("../../../models/Text");

async function getApprovedTextsNum(req, res) {
  const allTexts = await Text.find().select("isApproved");
  const approvedTexts = allTexts.filter((x) => x.isApproved);
  const total = allTexts.length;
  const approved = approvedTexts.length;
  const notApproved = total - approved;
  return res.json({ total, approved, notApproved });
}

module.exports = { getApprovedTextsNum };
