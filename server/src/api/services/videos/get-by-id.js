const Video = require('../../../models/Video');
const { shortUserInfoFields } = require('../../consts');

async function getById(req, res) {
  const video = await Video.findByIdAndUpdate(req.params.id, { $inc: { hits: 1 } }, { new: true })
    .select('-userName')
    .populate('user', shortUserInfoFields);
  if (!video) return res.status(404).json({ msg: 'Video not found' });
  return res.json(video);
}

module.exports = { getById };
