const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../_misc/s3-client');
const HskExam = require('../../../models/HskExam');
const { invalidateTag } = require('../../../cache');
const {
  getQuestionImageKey,
  getBankImageKey,
  getPartBankImageKey,
  getOptionImageKey,
  getExampleImageKey,
  getExampleOptionImageKey,
} = require('./media-paths');

const BUCKET = process.env.YA_S3_BUCKET;

// Same lookup as upload-image.js - kept independent rather than shared so each
// file stays a single, obviously-correct read of the descriptor's semantics.
// hasImageField names which flag to unset - "bankHasImage" on the part itself
// for the combined bank picture, "hasImage" on the located entry otherwise.
function locateTarget(exam, { sectionType, partInd, target, questionInd, label, isExample }) {
  const section = exam.sections.find((s) => s.type === sectionType);
  const part = section?.parts.find((p) => p.ind === partInd);
  if (!part) return null;

  if (target === 'bank-combined') return { entry: part, hasImageField: 'bankHasImage' };

  if (target === 'bank') {
    const entry = part.bank.find((b) => b.label === label);
    return entry ? { entry, hasImageField: 'hasImage' } : null;
  }

  // See upload-image.js's locateTarget - examples live in their own array with
  // their own ind namespace, distinct from part.questions.
  const question = (isExample ? part.examples : part.questions).find((q) => q.ind === questionInd);
  if (!question) return null;
  if (target === 'question') return { entry: question, hasImageField: 'hasImage' };
  if (target === 'option') {
    const option = question.options.find((o) => o.label === label);
    return option ? { entry: option, hasImageField: 'hasImage' } : null;
  }
  return null;
}

/**
 * @route DELETE api/hsk-exams/:slug/image
 * @access Private (admin)
 *
 * Removes a picture uploaded via upload-image.js: deletes the object from
 * storage and unsets hasImage, so the question/option/bank entry falls back
 * to text-only until a new picture is uploaded. Same descriptor shape as the
 * upload endpoint (sectionType, partInd, target, questionInd, label).
 */
async function deleteHskExamImage(req, res) {
  const { slug } = req.params;
  const { sectionType, target, label } = req.body;
  // Sent as a real JSON boolean here (this route parses a JSON body, unlike
  // upload-image.js's multipart form where every field arrives as a string).
  const isExample = Boolean(req.body.isExample);
  const partInd = req.body.partInd !== undefined ? Number(req.body.partInd) : undefined;
  const questionInd = req.body.questionInd !== undefined ? Number(req.body.questionInd) : undefined;

  const exam = await HskExam.findOne({ slug });
  if (!exam) return res.status(404).json({ msg: 'Экзамен не найден' });

  const located = locateTarget(exam, { sectionType, partInd, target, questionInd, label, isExample });
  if (!located) return res.status(404).json({ msg: 'Не найден вопрос/вариант с такими параметрами' });

  const ctxBase = { version: exam.version, level: exam.level, slug: exam.slug, sectionType, partInd };
  const key =
    target === 'bank-combined'
      ? getPartBankImageKey(ctxBase)
      : target === 'bank'
        ? getBankImageKey(ctxBase, label)
        : target === 'option'
          ? (isExample ? getExampleOptionImageKey : getOptionImageKey)(ctxBase, questionInd, label)
          : (isExample ? getExampleImageKey : getQuestionImageKey)(ctxBase, questionInd);

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

  located.entry[located.hasImageField] = false;
  exam.updatedAt = new Date();
  exam.markModified('sections');
  await exam.save();

  invalidateTag('hsk-exams');
  return res.json({ status: 'done' });
}

module.exports = { deleteHskExamImage };
