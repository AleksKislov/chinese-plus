const Video = require("../../../models/Video");

async function getVideosNum(req, res) {
  const allVideos = await Video.find().select("isApproved");
  const approvedVideos = allVideos.filter((x) => x.isApproved);
  const total = allVideos.length;
  const approved = approvedVideos.length;
  const notApproved = total - approved;
  return res.json({ total, approved, notApproved });
}

module.exports = { getVideosNum };
