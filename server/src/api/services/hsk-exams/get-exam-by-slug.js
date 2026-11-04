const HskExam = require('../../../models/HskExam');
const {
  toPublicUrl,
  getSectionAudioKey,
  getQuestionAudioKey,
  getQuestionImageKey,
  getBankImageKey,
  getPartBankImageKey,
  getOptionImageKey,
  getExampleAudioKey,
  getExampleImageKey,
  getExampleOptionImageKey,
} = require('./media-paths');

/**
 * Attaches audioUrl/imageUrl to one question-shaped item (a real question or a
 * worked example - both are QuestionSchema, see HskExam.js) using whichever key
 * helpers match its namespace, so a question and an example with the same `ind`
 * never resolve to the same object.
 */
function withMediaUrls(q, ctx, { audioKey, imageKey, optionImageKey }) {
  return {
    ...q,
    audioUrl: q.hasAudio ? toPublicUrl(audioKey(ctx, q.ind)) : null,
    imageUrl: q.hasImage ? toPublicUrl(imageKey(ctx, q.ind)) : null,
    options: q.options.map((o) => ({
      ...o,
      imageUrl: o.hasImage ? toPublicUrl(optionImageKey(ctx, q.ind, o.label)) : null,
    })),
  };
}

/**
 * @route GET api/hsk-exams/:slug
 *
 * The full exam paper. Media lives in Object Storage under keys derived from the
 * exam slug, so the URLs are built here rather than stored - that keeps the key
 * convention in one place and lets pictures/audio be uploaded long after the
 * exam was imported.
 *
 * An unapproved exam 404s for everyone except an admin (req.isAdmin, set by
 * optional-admin-auth) - an admin needs to open a draft to review it and upload
 * its pictures before it's fit to publish.
 *
 * Answer keys and explanations are included: grading is done in the browser,
 * same as the existing HSK vocabulary tests. These are practice papers, not
 * invigilated exams, so there is nothing to protect by withholding them.
 */
const getExamBySlug = async (req, res) => {
  const { slug } = req.params;

  const query = req.isAdmin ? { slug } : { slug, isApproved: true };
  const exam = await HskExam.findOne(query).lean();
  if (!exam) return res.status(404).json({ msg: 'Экзамен не найден' });

  exam.sections = exam.sections.map((section) => ({
    ...section,
    audioUrl: section.hasAudio
      ? toPublicUrl(
          getSectionAudioKey({
            version: exam.version,
            level: exam.level,
            slug: exam.slug,
            sectionType: section.type,
          })
        )
      : null,
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
        bankImageUrl: part.bankHasImage ? toPublicUrl(getPartBankImageKey(ctx)) : null,
        bank: part.bank.map((b) => ({
          ...b,
          imageUrl: b.hasImage ? toPublicUrl(getBankImageKey(ctx, b.label)) : null,
        })),
        examples: part.examples.map((ex) =>
          withMediaUrls(ex, ctx, {
            audioKey: getExampleAudioKey,
            imageKey: getExampleImageKey,
            optionImageKey: getExampleOptionImageKey,
          })
        ),
        questions: part.questions.map((q) =>
          withMediaUrls(q, ctx, {
            audioKey: getQuestionAudioKey,
            imageKey: getQuestionImageKey,
            optionImageKey: getOptionImageKey,
          })
        ),
      };
    }),
  }));

  return res.json(exam);
};

module.exports = { getExamBySlug };
