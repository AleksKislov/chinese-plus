const Text = require("../../../models/Text");
const User = require("../../../models/User");
const { shortUserInfoFields } = require("../../consts");

async function getMarkedTexts(req, res) {
  const user = await User.findById(req.user.id).select("finished_texts");
  const texts = await Text.find({ _id: { $in: user?.finished_texts || [] }, isApproved: 1 })
    .select("date title level categoryInd likes hits user _id comments_id audioSrc")
    .populate("user", shortUserInfoFields);

  return res.json(texts);
}

module.exports = { getMarkedTexts };
