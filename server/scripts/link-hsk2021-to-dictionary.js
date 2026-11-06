/**
 * One-off migration for the old HSK 3.0 (2021) list (`hskwords`), so it reads translations from
 * dictionarytranslations / dictionaryexamples like the 2025 list:
 *
 * 1. sets `dictId` - the dictionary entry of the word, by `chinese`, else by `tradChinese`
 *    (鑾 -> 銮); with several entries, the one whose pinyin matches `py`
 * 2. moves its own translation copy `ru` (DSL markup, as `dictionaries.russian` had it at import)
 *    into `deprecated_hskwords_ru`: { _id: hskwords id, cn, ru } - copied with $merge, checked,
 *    then unset. Words without a dictionary entry keep `ru` and are reported.
 *
 * Usage:
 *   node scripts/link-hsk2021-to-dictionary.js            # dry run
 *   node scripts/link-hsk2021-to-dictionary.js --apply
 */
const path = require('path');

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

const APPLY = process.argv.includes('--apply');

const WORDS = 'hskwords';
const DICTIONARIES = 'dictionaries';
const DEPRECATED = 'deprecated_hskwords_ru';
const DIACRITICS_RE = /[̀-ͯ]/g;

const plainPinyin = (py) =>
  (py || '').normalize('NFD').replace(DIACRITICS_RE, '').replace(/\s+/g, '').toLowerCase();

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  const { db } = mongoose.connection;
  const words = db.collection(WORDS);

  const all = await words.find({}, { projection: { cn: 1, py: 1, dictId: 1 } }).toArray();
  const cns = [...new Set(all.map((w) => w.cn))];
  const entries = await db
    .collection(DICTIONARIES)
    .find(
      { $or: [{ chinese: { $in: cns } }, { tradChinese: { $in: cns } }] },
      { projection: { chinese: 1, tradChinese: 1, pinyin: 1 } },
    )
    .toArray();

  const pick = (word, field) => {
    const options = entries.filter((e) => e[field] === word.cn);
    return (
      options.find((e) =>
        (e.pinyin || '').split(/[,;]/).some((py) => plainPinyin(py) === plainPinyin(word.py)),
      ) || options[0]
    );
  };

  const links = [];
  const unlinked = [];
  for (const word of all) {
    const entry = pick(word, 'chinese') || pick(word, 'tradChinese');
    if (!entry) unlinked.push(word.cn);
    else if (String(entry._id) !== String(word.dictId))
      links.push({ _id: word._id, dictId: entry._id });
  }

  const withRu = await words.countDocuments({ ru: { $exists: true } });
  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} - ${all.length} words: ${links.length} to link, ` +
      `${unlinked.length} without a dictionary entry${unlinked.length ? ` (${unlinked.join(' ')})` : ''}, ` +
      `${withRu} with ru`,
  );
  if (!APPLY) {
    console.log('Dry run only - no writes made. Re-run with --apply.');
    return mongoose.disconnect();
  }

  if (links.length) {
    await words.bulkWrite(
      links.map(({ _id, dictId }) => ({
        updateOne: { filter: { _id }, update: { $set: { dictId } } },
      })),
    );
  }
  console.log(`Linked ${links.length} words`);

  const movable = { ru: { $exists: true }, dictId: { $exists: true } };
  await words
    .aggregate([
      { $match: movable },
      { $project: { cn: 1, ru: 1 } },
      { $merge: { into: DEPRECATED, on: '_id', whenMatched: 'replace', whenNotMatched: 'insert' } },
    ])
    .toArray();
  const notCopied = await words
    .aggregate([
      { $match: movable },
      { $lookup: { from: DEPRECATED, localField: '_id', foreignField: '_id', as: 'copy' } },
      { $match: { $expr: { $ne: [{ $arrayElemAt: ['$copy.ru', 0] }, '$ru'] } } },
      { $count: 'n' },
    ])
    .toArray();
  if (notCopied.length && notCopied[0].n) {
    throw new Error(
      `${notCopied[0].n} words have no identical copy in ${DEPRECATED}, nothing unset`,
    );
  }

  const { modifiedCount } = await words.updateMany(movable, { $unset: { ru: '' } });
  console.log(`Done. ${modifiedCount} ru fields moved to ${DEPRECATED}.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
