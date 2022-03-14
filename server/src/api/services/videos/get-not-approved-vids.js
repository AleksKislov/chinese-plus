const Video = require("../../../models/Video");

async function getNotApprovedVids(req, res) {
  const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;
  const foundVideos = await Video.find({ isApproved: { $ne: 1 } }, undefined, {
    skip,
    limit: 10,
  })
    .sort({ date: -1 })
    .select("-cnSubs -ruSubs -pySubs -chineseArr");

  const videos = foundVideos.sort((a, b) => b.date - a.date);
  return res.json(videos);
}

module.exports = { getNotApprovedVids };
