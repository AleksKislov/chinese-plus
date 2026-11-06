const VideoLesson = require('../../../models/VideoLesson');
const { parseRutubeUrl } = require('./rutube-id');

// admin only (route uses adminAuth): lessons have no edit page, the link is set on the lesson page
async function setVideoLessonRutube(req, res) {
  const { rutubeUrl } = req.body;
  if (typeof rutubeUrl !== 'string') return res.status(400).json({ msg: 'No rutubeUrl' });

  const rutubeSource = parseRutubeUrl(rutubeUrl);
  if (rutubeSource === null) return res.status(400).json({ msg: 'Неверная ссылка на Rutube' });

  const lesson = await VideoLesson.findByIdAndUpdate(
    req.params.id,
    { $set: { rutubeSource } },
    { new: true },
  );
  if (!lesson) return res.status(404).json({ msg: 'Video not found' });

  return res.json({ status: 'done', rutubeSource });
}

module.exports = { setVideoLessonRutube };
