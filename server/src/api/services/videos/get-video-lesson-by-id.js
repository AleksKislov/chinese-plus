const VideoLesson = require('../../../models/VideoLesson');
const { shortUserInfoFields } = require('../../consts');
const { shouldCountHit } = require('../../../hits');

async function getVideoLessonById(req, res) {
  const countHit = shouldCountHit('video-lesson', req.params.id, req.query.vid);
  const video = countHit
    ? await VideoLesson.findByIdAndUpdate(
        req.params.id,
        { $inc: { hits: 1 } },
        { new: true },
      ).populate('user', shortUserInfoFields)
    : await VideoLesson.findById(req.params.id).populate('user', shortUserInfoFields);
  if (!video) return res.status(404).json({ msg: 'Video not found' });
  return res.json(video);
}

module.exports = { getVideoLessonById };
