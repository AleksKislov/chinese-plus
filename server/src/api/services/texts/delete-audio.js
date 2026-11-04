const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../_misc');
const Text = require('../../../models/Text');
const { invalidateTag } = require('../../../cache');

const BUCKET = process.env.YA_S3_BUCKET;

async function deleteAudio(req, res) {
  const { id } = req.params;

  const text = await Text.findById(id);
  if (!text) return res.status(404).json({ msg: 'Text not found' });

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: `texts/${id}.mp3` }));

  await Text.findByIdAndUpdate(id, { $set: { audioSrc: 0 } });
  invalidateTag('texts');

  return res.json({ status: 'done' });
}

module.exports = { deleteAudio };
