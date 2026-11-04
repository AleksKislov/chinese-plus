/**
 * Audio for grammar examples: SiliconFlow TTS -> Yandex bucket
 * (audio/grammar/{hash}.mp3) -> `audio` field of the example.
 *
 * Processed: examples without `audio`, and examples whose file is no longer in
 * the bucket (deleted to re-record). If the file is already in the bucket (same
 * sentence elsewhere, earlier run), it is reused without TTS.
 *
 * --force re-records the selected examples even if their file exists and
 * overwrites it in the bucket (same URL, so the DB does not change). It needs
 * --level or --slug, so a whole re-recording is never started by accident.
 *
 * Env: SILICONFLOW_API_KEY (+ optional SILICONFLOW_API_URL / _TTS_MODEL /
 * _TTS_VOICE / _TTS_SPEED, see src/api/services/_misc/siliconflow-tts.js),
 * YA_S3_BUCKET and YA_S3_* credentials.
 *
 * Usage (from server/):
 *   node scripts/generate-grammar-audio.js                  # list what would be generated
 *   node scripts/generate-grammar-audio.js --apply          # generate, upload, save
 *   node scripts/generate-grammar-audio.js --apply --level=1 --limit=5
 *   node scripts/generate-grammar-audio.js --apply --out=./audio/grammar
 *       # also keep local copies of the generated mp3
 *   node scripts/generate-grammar-audio.js --apply --force --slug=hsk1-prefixes
 *       # re-record one topic (new voice / speed, clipped audio)
 *
 * Afterwards clear the cache: POST /api/project/cache/refresh?tag=grammar
 */
const path = require('path');
const fs = require('fs');

require('dotenv').config({
  path: path.join(
    __dirname,
    '..',
    'config',
    process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod',
  ),
});

const mongoose = require('mongoose');
const { ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
const { connectDB } = require('../src/mongo_db/db');
const Grammar = require('../src/models/Grammar');
const { s3 } = require('../src/api/services/_misc/s3-client');
const { synthesizeSpeech } = require('../src/api/services/_misc/siliconflow-tts');
const { exampleAudioPath, plainCn } = require('../src/api/services/grammar/consts');

const APPLY = process.argv.includes('--apply');
const getArg = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : undefined;
};
const ONLY_LEVEL = getArg('level');
const ONLY_SLUG = getArg('slug');
const FORCE = process.argv.includes('--force');
const LIMIT = Number(getArg('limit')) || 0;
const OUT_DIR = getArg('out');

const BUCKET = process.env.YA_S3_BUCKET;
// the site plays audio from {bucket}/audio/…
const bucketKey = (audioPath) => `audio/${audioPath}`;

// every key under audio/grammar/ — one listing instead of a request per example
async function listBucketKeys() {
  const keys = new Set();
  let ContinuationToken;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: bucketKey('grammar/'),
        ContinuationToken,
      }),
    );
    (res.Contents || []).forEach((obj) => keys.add(obj.Key));
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return keys;
}

async function main() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  if (!BUCKET) throw new Error('YA_S3_BUCKET is not set');
  if (FORCE && !ONLY_LEVEL && !ONLY_SLUG) throw new Error('--force needs --level or --slug');
  await connectDB(MONGO_DB);

  const inBucket = await listBucketKeys();
  const filter = {};
  if (ONLY_LEVEL) filter.level = ONLY_LEVEL;
  if (ONLY_SLUG) filter.slug = ONLY_SLUG;
  const topics = await Grammar.find(filter).sort({
    level: 1,
    ind: 1,
  });
  const todo = [];
  topics.forEach((topic) =>
    topic.rules.forEach((rule) =>
      rule.examples.forEach((example) => {
        // `audio` set but the file was deleted from the bucket -> generate again
        const missing = example.audio && !inBucket.has(bucketKey(example.audio));
        if (FORCE || !example.audio || missing) todo.push({ topic, example, missing });
      }),
    ),
  );
  const batch = LIMIT ? todo.slice(0, LIMIT) : todo;
  const missingCount = todo.filter((t) => t.missing).length;
  const summary = FORCE
    ? `${todo.length} examples to re-record`
    : `${todo.length - missingCount} examples without audio, ${missingCount} with the file missing in the bucket`;
  console.log(`${summary}${LIMIT ? `, processing ${batch.length}` : ''}`);

  if (!APPLY) {
    batch
      .slice(0, 30)
      .forEach(({ topic, example, missing }) =>
        console.log(`  ${topic.slug}: ${example.cn}${missing ? ' (file missing)' : ''}`),
      );
    console.log('Dry run. Re-run with --apply.');
    return mongoose.disconnect();
  }
  if (OUT_DIR) fs.mkdirSync(OUT_DIR, { recursive: true });

  const changed = new Set();
  const recorded = new Set(); // keys generated in this run: a repeated sentence reuses them
  let generated = 0;
  let reused = 0;
  // save each topic as soon as its examples are done, so an interrupted run
  // (Ctrl+C, crash) keeps the `audio` of everything uploaded so far
  const saveTopic = async (topic) => {
    if (!changed.has(topic)) return;
    topic.markModified('rules');
    await topic.save();
  };
  for (const [i, { topic, example }] of batch.entries()) {
    const audioPath = exampleAudioPath(example.cn);
    const key = bucketKey(audioPath);
    try {
      if (recorded.has(key) || (!FORCE && inBucket.has(key))) {
        reused++;
      } else {
        // TTS reads the sentence without the word-segmentation spaces
        const mp3 = await synthesizeSpeech(plainCn(example.cn));
        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: mp3,
            ContentType: 'audio/mpeg',
            // revalidate, so a re-recorded file is not served stale from browser cache
            CacheControl: 'no-cache',
            ACL: 'public-read',
          }),
        );
        recorded.add(key);
        if (OUT_DIR) fs.writeFileSync(path.join(OUT_DIR, path.basename(audioPath)), mp3);
        generated++;
        console.log(`  + ${example.cn} -> ${key}`);
      }
      example.audio = audioPath;
      changed.add(topic);
    } catch (e) {
      console.log(`  ! ${topic.slug}: ${example.cn} — ${e.message}`);
    }
    // batch is ordered by topic: the topic is complete when the next item is another one
    if (batch[i + 1]?.topic !== topic) await saveTopic(topic);
  }

  console.log(`Generated ${generated}, reused ${reused}, updated ${changed.size} topics.`);
  console.log('Clear the cache: POST /api/project/cache/refresh?tag=grammar');
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
