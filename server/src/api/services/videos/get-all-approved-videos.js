const Video = require("../../../models/Video");

async function getAllApprovedVids(req, res) {
  const vids = await Video.find({ isApproved: 1 })
    .sort({ date: -1 })
    .select("date title lvl category likes hits user userName _id comments_id length");

  return res.json(vids);
}

module.exports = { getAllApprovedVids };
