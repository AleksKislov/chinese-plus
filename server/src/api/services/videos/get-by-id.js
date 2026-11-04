const mongoose = require('mongoose');
const Video = require('../../../models/Video');
const { shortUserInfoFields } = require('../../consts');
const { shouldCountHit } = require('../../../hits');

async function getById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ msg: 'Video not found' });
  }

  const countHit = shouldCountHit('video', req.params.id, req.query.vid);
  const video = countHit
    ? await Video.findByIdAndUpdate(req.params.id, { $inc: { hits: 1 } }, { new: true })
        .select('-userName')
        .populate('user', shortUserInfoFields)
    : await Video.findById(req.params.id)
        .select('-userName')
        .populate('user', shortUserInfoFields);
  if (!video) return res.status(404).json({ msg: 'Video not found' });
  return res.json(video);
}

module.exports = { getById };
