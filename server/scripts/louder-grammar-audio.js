/**
 * Make the grammar audio in the bucket (audio/grammar/*.mp3) louder with ffmpeg
 * and upload it back under the same key: URLs and the DB do not change, no TTS.
 *
 * Default filter is loudnorm (EBU R128) to -16 LUFS, the usual level for speech
 * on the web: quiet files get louder, all files end up at the same volume, no
 * clipping. --gain=N applies a plain +N dB instead (with a limiter).
 *
 * Processed files get `x-amz-meta-louder` in the bucket and are skipped on the
 * next run, so a re-run never boosts a file twice (--force ignores the mark).
 *
 * Needs ffmpeg: `npm i --no-save ffmpeg-static` in server/ (prebuilt binary, picked
 * up automatically), or FFMPEG_PATH=/path/to/ffmpeg, or ffmpeg in PATH.
 * Env: YA_S3_BUCKET and YA_S3_* credentials.
 *
 * Usage (from server/):
 *   node scripts/louder-grammar-audio.js                            # count files to process
 *   node scripts/louder-grammar-audio.js --out=./audio/louder --limit=5
 *       # local only: saves {hash}.orig.mp3 + {hash}.mp3 to listen, uploads nothing
 *   node scripts/louder-grammar-audio.js --out=./audio/louder --file=98890864542bf9f5.mp3
 *   node scripts/louder-grammar-audio.js --out=./audio/louder --limit=5 --gain=4
 *   node scripts/louder-grammar-audio.js --apply --out=./audio/louder-backup
 *       # upload; --out keeps the originals as a backup (recommended)
 *
 * Use the same filter options for the local check and for --apply.
 */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');
const { promisify } = require('util');

require('dotenv').config({
  path: path.join(
    __dirname,
    '..',
    'config',
    process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod',
  ),
});

const {
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const { s3 } = require('../src/api/services/_misc/s3-client');

const run = promisify(execFile);

// FFMPEG_PATH, else the ffmpeg-static package (npm i --no-save ffmpeg-static), else PATH
const FFMPEG = (() => {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  try {
    return require('ffmpeg-static');
  } catch {
    return 'ffmpeg';
  }
})();

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const getArg = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : undefined;
};
const LIMIT = Number(getArg('limit')) || 0;
const OUT_DIR = getArg('out');
const ONLY_FILE = getArg('file');
const GAIN = getArg('gain') ? Number(getArg('gain')) : undefined;
const LUFS = Number(getArg('lufs')) || -16;

const BUCKET = process.env.YA_S3_BUCKET;
const PREFIX = 'audio/grammar/';

// gain: +N dB, then a limiter so peaks do not clip
const FILTER =
  GAIN !== undefined
    ? `volume=${GAIN}dB,alimiter=limit=0.95`
    : `loudnorm=I=${LUFS}:TP=-1.5:LRA=11`;
// stored in the bucket, so it is visible later what was done to a file
const MARK = GAIN !== undefined ? `gain${GAIN}dB` : `loudnorm${LUFS}`;

async function listKeys() {
  const keys = [];
  let ContinuationToken;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: PREFIX, ContinuationToken }),
    );
    (res.Contents || []).forEach((obj) => obj.Key.endsWith('.mp3') && keys.push(obj.Key));
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return keys;
}

async function download(key) {
  const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  return { body: Buffer.from(await res.Body.transformToByteArray()), meta: res.Metadata || {} };
}

// keeps the source sample rate / bitrate (loudnorm would otherwise output 192 kHz)
async function makeLouder(mp3) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'louder-'));
  const src = path.join(dir, 'in.mp3');
  const dst = path.join(dir, 'out.mp3');
  try {
    fs.writeFileSync(src, mp3);
    // `ffmpeg -i file` with no output exits with an error but prints the stream info:
    // "Stream #0:0: Audio: mp3, 44100 Hz, mono, fltp, 128 kb/s"
    const info = await run(FFMPEG, ['-hide_banner', '-i', src]).catch((e) => e);
    const stream = /Audio: .*?(\d+) Hz.*?(\d+) kb\/s/.exec(info.stderr || '') || [];
    const sampleRate = stream[1] || '44100';
    const bitrate = Math.max(Number(stream[2]) || 128, 64);
    await run(FFMPEG, [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-i', src,
      '-af', FILTER,
      '-ar', sampleRate,
      '-c:a', 'libmp3lame',
      '-b:a', `${bitrate}k`,
      dst,
    ]);
    return fs.readFileSync(dst);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function main() {
  if (!BUCKET) throw new Error('YA_S3_BUCKET is not set');
  await run(FFMPEG, ['-version']).catch(() => {
    throw new Error('ffmpeg not found: npm i --no-save ffmpeg-static (or set FFMPEG_PATH)');
  });

  let keys = await listKeys();
  if (ONLY_FILE) keys = keys.filter((k) => k === `${PREFIX}${ONLY_FILE}`);
  const batch = LIMIT ? keys.slice(0, LIMIT) : keys;
  console.log(`${keys.length} files in ${PREFIX}, processing ${batch.length}, filter: ${FILTER}`);

  if (!APPLY && !OUT_DIR) {
    console.log('Dry run. Add --out=DIR to listen locally, --apply to upload.');
    return;
  }
  if (OUT_DIR) fs.mkdirSync(OUT_DIR, { recursive: true });

  let done = 0;
  let skipped = 0;
  for (const key of batch) {
    const name = path.basename(key, '.mp3');
    try {
      const { body, meta } = await download(key);
      if (meta.louder && !FORCE) {
        skipped++;
        console.log(`  = ${name} already processed (${meta.louder})`);
        continue;
      }
      const louder = await makeLouder(body);
      if (OUT_DIR) {
        fs.writeFileSync(path.join(OUT_DIR, `${name}.orig.mp3`), body);
        fs.writeFileSync(path.join(OUT_DIR, `${name}.mp3`), louder);
      }
      if (APPLY) {
        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: louder,
            ContentType: 'audio/mpeg',
            CacheControl: 'no-cache',
            ACL: 'public-read',
            Metadata: { louder: MARK },
          }),
        );
      }
      done++;
      console.log(`  + ${name} ${body.length} -> ${louder.length} bytes${APPLY ? ', uploaded' : ''}`);
    } catch (e) {
      console.log(`  ! ${name} — ${e.message}`);
    }
  }
  console.log(
    `${APPLY ? 'Uploaded' : 'Saved locally'} ${done}, skipped ${skipped} already processed.`,
  );
  if (!APPLY) console.log(`Listen in ${OUT_DIR}: {hash}.orig.mp3 vs {hash}.mp3. Re-run with --apply.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
