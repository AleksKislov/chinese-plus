const Video = require('../../../models/Video');

async function deleteVideo(req, res) {
  await Video.deleteOne({ _id: req.params.id });
  return res.json({ msg: 'done' });
}

module.exports = { deleteVideo };
