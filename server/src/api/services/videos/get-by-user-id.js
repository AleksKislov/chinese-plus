const Video = require("../../../models/Video");

async function getByUserId(req, res) {
  const vids = await Video.find({ user: req.params.userId })
    .sort({ date: -1 })
    .select("title lvl category likes hits _id comments_id");
  return res.json(vids);
}

module.exports = { getByUserId };
