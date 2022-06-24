const Text = require("../../../models/Text");

async function getTextsNum(req, res) {
  const allTexts = await Text.find().select("isApproved audioSrc");
  const withAudio = allTexts.filter((x) => x.audioSrc).length;
  const approvedTexts = allTexts.filter((x) => x.isApproved);
  const total = allTexts.length;
  const approved = approvedTexts.length;
  const notApproved = total - approved;
  return res.json({ total, approved, notApproved, withAudio });
}

module.exports = { getTextsNum };
