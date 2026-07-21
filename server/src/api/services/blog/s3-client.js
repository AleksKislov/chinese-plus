const { S3Client } = require('@aws-sdk/client-s3');

// Yandex Object Storage is S3-compatible
const s3 = new S3Client({
  region: process.env.YA_S3_REGION || 'ru-central1',
  endpoint: process.env.YA_S3_ENDPOINT || 'https://storage.yandexcloud.net',
  credentials: {
    accessKeyId: process.env.YA_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.YA_S3_SECRET_ACCESS_KEY,
  },
});

module.exports = { s3 };
