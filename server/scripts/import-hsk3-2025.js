/**
 * One-off migration: import the HSK 3.0 vocabulary (syllabus 2025-11, in force
 * since 2026-07) into the `hskwords2025` collection. The old list (`hskwords`)
 * is NOT touched.
 *
 * Source: content/hsk-words/hsk3-2025.json (parsed from the official PDF).
 * - `py` comes from the syllabus (it gives the reading for this entry, while
 *   dictionary pinyin lists every reading).
 * - `dictId` points to the `dictionary` entry with the same chinese; when
 *   there are several, the one whose pinyin contains the syllabus reading wins.
 *   The translation is joined from there at request time.
 * - `audio` reuses the old list's mp3 (newhsk/band{lvl}/{id}.mp3) of the word
 *   with the same chinese. Words without one are left for
 *   scripts/generate-hsk3-2025-audio.js.
 * - `id` is 1..N within each level ('789' for bands 7-9), in syllabus order.
 *
 * Reports (content/hsk-words/):
 *   missing-dict.json   words with no dictionary entry -> add them to `dictionary`
 *                       and re-run the script
 *   missing-audio.json  words not in the old list -> generate audio
 *
 * Usage (from server/):
 *   node scripts/import-hsk3-2025.js            # dry run, no writes
 *   node scripts/import-hsk3-2025.js --apply    # upsert on {lvl, id}, safe to re-run
 *
 * After applying, clear the API cache: POST /api/project/cache/refresh?tag=hsk-new
 * (or restart the server).
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
const Dictionary = require('../src/models/Dictionary');
const Hskword = require('../src/models/Hskword');
const Hskword2025 = require('../src/models/Hskword2025');

const APPLY = process.argv.includes('--apply');
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'hsk-words');
const SRC = path.join(CONTENT_DIR, 'hsk3-2025.json');
const EXPECTED = { 1: 300, 2: 200, 3: 500, 4: 1000, 5: 1600, 6: 1800, 789: 5560 };
const OLD_LVL_ORDER = ['1', '2', '3', '4', '5', '6', '789'];

const bandOf = (lvlRaw) => {
  const base = lvlRaw.match(/^(7-9|\d)/)[1];
  return base === '7-9' ? '789' : base;
};

const normPy = (str) => (str || '').toLowerCase().replace(/[\s’'\-·]/g, '');
const stripTones = (str) => str.normalize('NFD').replace(/[̀-ͯ]/g, '');

function normalize(rows) {
  const counters = {};
  return rows.map((r) => {
    const lvl = bandOf(r.lvl);
    counters[lvl] = (counters[lvl] || 0) + 1;
    const hm = r.word.match(/^(.*?)(\d)$/);
    return {
      id: counters[lvl],
      lvl,
      num: r.n,
      cn: hm ? hm[1] : r.word,
      py: r.pinyin,
      pos: r.pos,
      lvlRaw: r.lvl,
      homograph: hm ? Number(hm[2]) : undefined,
    };
  });
}

// pick the dictionary entry whose pinyin matches the syllabus reading best
function pickDictEntry(entries, py) {
  if (!entries || !entries.length) return null;
  const target = normPy(py);
  const score = (entry) => {
    const readings = (entry.pinyin || '').split(/[,;/]/).map(normPy);
    if (readings.includes(target)) return 3;
    if (readings.some((r) => stripTones(r) === stripTones(target))) return 2;
    if (normPy(entry.pinyin).includes(target)) return 1;
    return 0;
  };
  return entries.reduce((best, cur) => (score(cur) > score(best) ? cur : best), entries[0]);
}

// same word in the old list: prefer the same level, then the lowest one
function pickOldEntry(entries, lvl) {
  if (!entries || !entries.length) return null;
  return (
    entries.find((e) => e.lvl === lvl) ||
    [...entries].sort((a, b) => OLD_LVL_ORDER.indexOf(a.lvl) - OLD_LVL_ORDER.indexOf(b.lvl))[0]
  );
}

const groupBy = (docs, key) =>
  docs.reduce((map, d) => map.set(d[key], [...(map.get(d[key]) || []), d]), new Map());

async function main() {
  const words = normalize(JSON.parse(fs.readFileSync(SRC, 'utf8')));

  const counts = {};
  words.forEach((w) => (counts[w.lvl] = (counts[w.lvl] || 0) + 1));
  for (const [lvl, n] of Object.entries(EXPECTED)) {
    if (counts[lvl] !== n) throw new Error(`Level ${lvl}: expected ${n}, got ${counts[lvl]}`);
  }
  console.log('Counts OK:', counts);

  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  const cns = [...new Set(words.map((w) => w.cn))];
  const dict = groupBy(
    await Dictionary.find({ chinese: { $in: cns } }, 'chinese pinyin').lean(),
    'chinese',
  );
  const old = groupBy(await Hskword.find({ cn: { $in: cns } }, 'cn lvl id').lean(), 'cn');

  const missingDict = [];
  const missingAudio = [];
  words.forEach((w) => {
    const entry = pickDictEntry(dict.get(w.cn), w.py);
    if (entry) w.dictId = entry._id;
    else missingDict.push({ lvl: w.lvl, id: w.id, cn: w.cn, py: w.py });

    const oldWord = pickOldEntry(old.get(w.cn), w.lvl);
    if (oldWord) w.audio = `newhsk/band${oldWord.lvl}/${oldWord.id}.mp3`;
    else missingAudio.push({ lvl: w.lvl, id: w.id, cn: w.cn, py: w.py });
  });

  console.log(
    `Dictionary: ${words.length - missingDict.length} linked, ${missingDict.length} missing`,
  );
  console.log(
    `Audio: ${words.length - missingAudio.length} reused, ${missingAudio.length} missing`,
  );
  fs.writeFileSync(
    path.join(CONTENT_DIR, 'missing-dict.json'),
    JSON.stringify(missingDict, null, 1),
  );
  fs.writeFileSync(
    path.join(CONTENT_DIR, 'missing-audio.json'),
    JSON.stringify(missingAudio, null, 1),
  );
  console.log(`Reports written to ${CONTENT_DIR}/missing-{dict,audio}.json`);

  if (!APPLY) {
    console.log('Dry run (no writes). Re-run with --apply.');
  } else {
    // words without old audio keep whatever `audio` they already have (generated later)
    const ops = words.map((w) => ({
      updateOne: { filter: { lvl: w.lvl, id: w.id }, update: { $set: w }, upsert: true },
    }));
    for (let i = 0; i < ops.length; i += 1000) {
      await Hskword2025.bulkWrite(ops.slice(i, i + 1000));
    }
    console.log(`Upserted ${ops.length} words into hskwords2025`);
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
