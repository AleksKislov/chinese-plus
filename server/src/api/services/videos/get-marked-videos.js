const Video = require("../../../models/Video");
const User = require("../../../models/User");
const { shortUserInfoFields } = require("../../consts");

async function getMarkedVideos(req, res) {
  const user = await User.findById(req.user.id).select("seenVideos");
  const vids = await Video.find({ _id: { $in: user?.seenVideos || [] }, isApproved: 1 })
    .select("date title lvl category likes hits user _id comments_id")
    .populate("user", shortUserInfoFields);

  return res.json(vids);
}

module.exports = { getMarkedVideos };
