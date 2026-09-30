/**
 * Audio for the 2025 HSK 3.0 words that are not in the old list (no `audio` set
 * by scripts/import-hsk3-2025.js).
 *
 * Usage (from server/):
 *   node scripts/generate-hsk3-2025-audio.js             # list words without audio
 *   node scripts/generate-hsk3-2025-audio.js --generate  # Google TTS into
 *       ./audio/newhsk2025/band{lvl}/{id}.mp3 (existing files are skipped;
 *       needs GOOGLE_APPLICATION_CREDENTIALS)
 *   node scripts/generate-hsk3-2025-audio.js --mark      # after uploading the files to
 *       buyilehu/audio/newhsk2025/, set `audio` for every word whose local file exists
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
const { connectDB } = require('../src/mongo_db/db');
const Hskword2025 = require('../src/models/Hskword2025');

const GENERATE = process.argv.includes('--generate');
const MARK = process.argv.includes('--mark');
const OUT_DIR = './audio/newhsk2025';
const fileOf = (w) => `${OUT_DIR}/band${w.lvl}/${w.id}.mp3`;

async function main() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  const words = await Hskword2025.find({ audio: { $in: [null, ''] } }, 'lvl id cn')
    .sort({ lvl: 1, id: 1 })
    .lean();
  console.log(`${words.length} words without audio`);

  if (GENERATE) {
    const { writeMP3 } = require('../src/api/services/newhskwords/write-mp3');
    for (const w of words) {
      if (fs.existsSync(fileOf(w))) continue;
      fs.mkdirSync(path.dirname(fileOf(w)), { recursive: true });
      await writeMP3(w, OUT_DIR);
    }
  }

  if (MARK) {
    const ready = words.filter((w) => fs.existsSync(fileOf(w)));
    await Hskword2025.bulkWrite(
      ready.map((w) => ({
        updateOne: {
          filter: { _id: w._id },
          update: { $set: { audio: `newhsk2025/band${w.lvl}/${w.id}.mp3` } },
        },
      })),
    );
    console.log(`Marked ${ready.length} words; clear the hsk-new cache afterwards`);
  }

  if (!GENERATE && !MARK) {
    words.slice(0, 50).forEach((w) => console.log(w.lvl, w.id, w.cn));
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
