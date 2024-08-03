const VideoLesson = require('../../../models/VideoLesson');
const { shortUserInfoFields } = require('../../consts');

async function getVideoLessonById(req, res) {
  const video = await VideoLesson.findByIdAndUpdate(
    req.params.id,
    { $inc: { hits: 1 } },
    { new: true },
  ).populate('user', shortUserInfoFields);
  if (!video) return res.status(404).json({ msg: 'Video not found' });
  return res.json(video);
}

module.exports = { getVideoLessonById };
