const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../_misc');
const Grammar = require('../../../models/Grammar');
const { invalidateTag } = require('../../../cache');

const BUCKET = process.env.YA_S3_BUCKET;
const FILE_RE = /^[0-9a-f]{16}\.mp3$/; // see exampleAudioPath in ./consts

// deletes an example's mp3 from the bucket and unsets `audio` on every example
// that uses it (the same sentence in several topics shares one file);
// scripts/generate-grammar-audio.js records it again on the next run
async function deleteAudio(req, res) {
  const { file } = req.params;
  if (!FILE_RE.test(file)) return res.status(400).json({ msg: 'Invalid audio file' });

  const audio = `grammar/${file}`;
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: `audio/${audio}` }));

  const { modifiedCount } = await Grammar.updateMany(
    { 'rules.examples.audio': audio },
    { $unset: { 'rules.$[].examples.$[ex].audio': '' } },
    { arrayFilters: [{ 'ex.audio': audio }] },
  );
  invalidateTag('grammar');

  return res.json({ status: 'done', topics: modifiedCount });
}

module.exports = { deleteAudio };
