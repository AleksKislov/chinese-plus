const Video = require("../../../models/Video");
const { shortUserInfoFields } = require("../../consts");

async function getAllApprovedVids(req, res) {
  const vids = await Video.find({ isApproved: 1 })
    .sort({ date: -1 })
    .select("date title lvl category likes hits user _id comments_id length")
    .populate("user", shortUserInfoFields);

  return res.json(vids);
}

module.exports = { getAllApprovedVids };
