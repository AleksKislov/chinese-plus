const mongoose = require('mongoose');
const Video = require('../../../models/Video');

async function getByUserId(req, res) {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.json([]);
  }

  const vids = await Video.find({ user: req.params.userId })
    .sort({ date: -1 })
    .select('title lvl category likes hits _id comments_id');
  return res.json(vids);
}

module.exports = { getByUserId };
