const HskExam = require('../../../models/HskExam');
const {
  toPublicUrl,
  getQuestionAudioKey,
  getQuestionImageKey,
  getBankImageKey,
  getOptionImageKey,
} = require('./media-paths');

/**
 * @route GET api/hsk-exams/:slug
 *
 * The full exam paper. Media lives in Object Storage under keys derived from the
 * exam slug, so the URLs are built here rather than stored - that keeps the key
 * convention in one place and lets pictures/audio be uploaded long after the
 * exam was imported.
 *
 * Answer keys and explanations are included: grading is done in the browser,
 * same as the existing HSK vocabulary tests. These are practice papers, not
 * invigilated exams, so there is nothing to protect by withholding them.
 */
const getExamBySlug = async (req, res) => {
  const { slug } = req.params;

  const exam = await HskExam.findOne({ slug, isApproved: true }).lean();
  if (!exam) return res.status(404).json({ msg: 'Экзамен не найден' });

  exam.sections = exam.sections.map((section) => ({
    ...section,
    parts: section.parts.map((part) => {
      const ctx = {
        version: exam.version,
        level: exam.level,
        slug: exam.slug,
        sectionType: section.type,
        partInd: part.ind,
      };

      return {
        ...part,
        bank: part.bank.map((b) => ({
          ...b,
          imageUrl: b.hasImage ? toPublicUrl(getBankImageKey(ctx, b.label)) : null,
        })),
        questions: part.questions.map((q) => ({
          ...q,
          audioUrl: q.hasAudio ? toPublicUrl(getQuestionAudioKey(ctx, q.ind)) : null,
          imageUrl: q.hasImage ? toPublicUrl(getQuestionImageKey(ctx, q.ind)) : null,
          options: q.options.map((o) => ({
            ...o,
            imageUrl: o.hasImage ? toPublicUrl(getOptionImageKey(ctx, q.ind, o.label)) : null,
          })),
        })),
      };
    }),
  }));

  return res.json(exam);
};

module.exports = { getExamBySlug };
