const Video = require("../../../models/Video");

async function getById(req, res) {
  // const video = await Video.findByIdAndUpdate(req.params.id, { $inc: { hits: 1 } }, { new: true });
  // if (!video) return res.status(404).json({ msg: "Video not found" });
  // return res.json(video);
}

module.exports = { getById };
