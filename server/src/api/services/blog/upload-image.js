const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../_misc/s3-client');

const MAX_WIDTH = 1280; // no need for huge images
const BUCKET = process.env.YA_S3_BUCKET;
// path-style, matching the bucket already used for texts/audio (see qwik CONST_URLS)
const PUBLIC_URL = process.env.YA_S3_PUBLIC_URL || `https://storage.yandexcloud.net/${BUCKET}`;

async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ msg: 'No image file provided' });

  const resized = await sharp(req.file.buffer)
    .rotate() // respect EXIF orientation before stripping metadata
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const key = `blog/${req.user.id}/${uuidv4()}.webp`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: resized,
      ContentType: 'image/webp',
      ACL: 'public-read',
    }),
  );

  return res.json({ url: `${PUBLIC_URL}/${key}` });
}

module.exports = { uploadImage };
