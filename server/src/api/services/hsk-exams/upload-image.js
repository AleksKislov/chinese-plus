const sharp = require('sharp');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../_misc/s3-client');
const HskExam = require('../../../models/HskExam');
const { invalidateTag } = require('../../../cache');
const {
  IMAGE_MAX_WIDTH,
  IMAGE_QUALITY,
  toPublicUrl,
  getQuestionImageKey,
  getBankImageKey,
  getPartBankImageKey,
  getOptionImageKey,
  getExampleImageKey,
  getExampleOptionImageKey,
} = require('./media-paths');

const BUCKET = process.env.YA_S3_BUCKET;

/**
 * Locates the exact question/bank-entry/option a picture belongs to inside an
 * exam document, so the upload can (a) know the storage key - which is derived
 * from the same ind/label fields, never array position, matching how
 * scripts/import-hsk-exams.js computed it - and (b) flip its hasImage flag.
 * `hasImageField` names which flag that is - almost always "hasImage", except
 * the part-level combined bank picture, which flips PartSchema's own
 * "bankHasImage" instead of anything inside its `bank` array.
 * Returns null if the target doesn't exist, so the route can 400 instead of
 * silently uploading an orphaned file.
 */
function locateTarget(exam, { sectionType, partInd, target, questionInd, label, isExample }) {
  const section = exam.sections.find((s) => s.type === sectionType);
  const part = section?.parts.find((p) => p.ind === partInd);
  if (!part) return null;

  if (target === 'bank-combined') return { entry: part, hasImageField: 'bankHasImage', ctx: { section, part } };

  if (target === 'bank') {
    const entry = part.bank.find((b) => b.label === label);
    return entry ? { entry, hasImageField: 'hasImage', ctx: { section, part } } : null;
  }

  // A worked example (part.examples) is schema-identical to a real question
  // but numbered in its own namespace, so it must be searched separately -
  // example ind 0 and question ind 0 in the same part are different items.
  const question = (isExample ? part.examples : part.questions).find((q) => q.ind === questionInd);
  if (!question) return null;

  if (target === 'question')
    return { entry: question, hasImageField: 'hasImage', ctx: { section, part, question } };
  if (target === 'option') {
    const option = question.options.find((o) => o.label === label);
    return option
      ? { entry: option, hasImageField: 'hasImage', ctx: { section, part, question } }
      : null;
  }
  return null;
}

/**
 * @route POST api/hsk-exams/:slug/image
 * @access Private (admin)
 *
 * Uploads (or replaces) one picture on an exam - a question's own image, one
 * option's image (HSK 1 listening part 2's three-picture choices), or one
 * entry in a part's shared A-F bank. Resized and re-encoded to WebP exactly
 * like the blog image uploader, then written to the Object Storage key the
 * public API already expects (media-paths.js), so nothing else needs to change
 * for the picture to appear - not even re-approving the exam.
 */
async function uploadHskExamImage(req, res) {
  if (!req.file) return res.status(400).json({ msg: 'No image file provided' });

  const { slug } = req.params;
  const { sectionType, target, label } = req.body;
  // Arrives as the string "true", not "1": the FE action's zod schema coerces
  // the FormData value into a real boolean, then re-serializes every field
  // with String(value) when forwarding to this endpoint - String(true) is
  // "true". Checking '1' here was a leftover from an earlier draft of the
  // convention and never matched what the action actually sends.
  const isExample = req.body.isExample === 'true';
  const partInd = req.body.partInd !== undefined ? Number(req.body.partInd) : undefined;
  const questionInd = req.body.questionInd !== undefined ? Number(req.body.questionInd) : undefined;

  if (!['listening', 'reading', 'writing'].includes(sectionType))
    return res.status(400).json({ msg: 'sectionType must be listening/reading/writing' });
  if (!['question', 'bank', 'option', 'bank-combined'].includes(target))
    return res.status(400).json({ msg: 'target must be question/bank/option/bank-combined' });
  if (Number.isNaN(partInd)) return res.status(400).json({ msg: 'partInd is required' });
  if (!['bank', 'bank-combined'].includes(target) && Number.isNaN(questionInd))
    return res.status(400).json({ msg: 'questionInd is required for this target' });
  if (!['question', 'bank-combined'].includes(target) && !label)
    return res.status(400).json({ msg: 'label is required for this target' });

  const exam = await HskExam.findOne({ slug });
  if (!exam) return res.status(404).json({ msg: 'Экзамен не найден' });

  const located = locateTarget(exam, { sectionType, partInd, target, questionInd, label, isExample });
  if (!located)
    return res.status(404).json({ msg: 'Не найден вопрос/вариант с такими параметрами' });

  const ctxBase = { version: exam.version, level: exam.level, slug: exam.slug, sectionType, partInd };
  const key =
    target === 'bank-combined'
      ? getPartBankImageKey(ctxBase)
      : target === 'bank'
        ? getBankImageKey(ctxBase, label)
        : target === 'option'
          ? (isExample ? getExampleOptionImageKey : getOptionImageKey)(ctxBase, questionInd, label)
          : (isExample ? getExampleImageKey : getQuestionImageKey)(ctxBase, questionInd);

  const resized = await sharp(req.file.buffer)
    .rotate() // respect EXIF orientation before stripping metadata
    .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: IMAGE_QUALITY })
    .toBuffer();

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: resized,
      ContentType: 'image/webp',
      ACL: 'public-read',
    })
  );

  located.entry[located.hasImageField] = true;
  exam.updatedAt = new Date();
  exam.markModified('sections');
  await exam.save();

  invalidateTag('hsk-exams');

  return res.json({ url: toPublicUrl(key) });
}

module.exports = { uploadHskExamImage };
