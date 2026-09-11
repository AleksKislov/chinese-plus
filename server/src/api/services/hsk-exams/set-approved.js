const HskExam = require('../../../models/HskExam');
const { invalidateTag } = require('../../../cache');

/**
 * @route PUT api/hsk-exams/:slug/approve
 * @access Private (admin)
 *
 * Toggles publication. Unlike the import script's --publish flag (all-or-one-
 * file, offline), this is the day-to-day switch an admin flips from the exam
 * page once its content and pictures look right.
 */
const setApproved = async (req, res) => {
  const { slug } = req.params;
  const isApproved = Boolean(req.body.isApproved);

  const exam = await HskExam.findOneAndUpdate(
    { slug },
    { $set: { isApproved, updatedAt: new Date() } }
  ).select('slug');
  if (!exam) return res.status(404).json({ msg: 'Экзамен не найден' });

  invalidateTag('hsk-exams');
  return res.json({ slug, isApproved });
};

module.exports = { setApproved };
