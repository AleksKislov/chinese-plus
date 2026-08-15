const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../_misc');
const Text = require('../../../models/Text');
const { invalidateTag } = require('../../../cache');

const BUCKET = process.env.YA_S3_BUCKET;

async function uploadAudio(req, res) {
  if (!req.file) return res.status(400).json({ msg: 'No audio file provided' });

  const { textId } = req.body;
  const text = await Text.findById(textId);
  if (!text) return res.status(404).json({ msg: 'Text not found' });

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: `texts/${textId}.mp3`,
      Body: req.file.buffer,
      ContentType: 'audio/mpeg',
      ACL: 'public-read',
      StorageClass: 'COLD',
    }),
  );

  await Text.findByIdAndUpdate(textId, { $set: { audioSrc: 1 } });
  invalidateTag('texts');

  return res.json({ status: 'done' });
}

module.exports = { uploadAudio };
