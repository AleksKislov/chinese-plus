const Video = require("../../../models/Video");

async function getNotApprovedVids(req, res) {
  const querySkip = req.query.skip;
  const skip = querySkip && /^\d+$/.test(querySkip) ? Number(querySkip) : 0;
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
