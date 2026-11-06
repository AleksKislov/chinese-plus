/**
 * One-off migration: moves `russian` (the DSL markup) out of `dictionaries` into the
 * `deprecated_dictionary_russian` collection: { _id: dictionary entry id, chinese, russian }.
 *
 * The site reads translations from dictionarytranslations / dictionaryexamples, filled by
 * scripts/split-dictionary-translations.js - run that first: this script refuses to move
 * anything while there are fewer translations than dictionary entries.
 *
 * 1. copies every `russian` with $merge on _id (re-runnable, a copy is replaced, never lost)
 * 2. checks every entry that still has `russian` has its copy
 * 3. unsets `russian` in `dictionaries`, in batches
 * The disk space of `dictionaries` is only freed after a `compact` of the collection.
 *
 * Usage:
 *   node scripts/move-russian-to-deprecated.js            # dry run: counts only
 *   node scripts/move-russian-to-deprecated.js --apply
 *   node scripts/move-russian-to-deprecated.js --apply --force   # skip the translations check
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
const FORCE = process.argv.includes('--force');

const SOURCE = 'dictionaries';
const TARGET = 'deprecated_dictionary_russian';
const TRANSLATIONS = 'dictionarytranslations';
const BATCH_SIZE = 10000;
const HAS_RUSSIAN = { russian: { $exists: true } };

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  const { db } = mongoose.connection;
  const dictionaries = db.collection(SOURCE);
  const target = db.collection(TARGET);

  const [total, withRussian, translations, alreadyMoved] = await Promise.all([
    dictionaries.estimatedDocumentCount(),
    dictionaries.countDocuments(HAS_RUSSIAN),
    db.collection(TRANSLATIONS).estimatedDocumentCount(),
    target.estimatedDocumentCount(),
  ]);
  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} - ${total} dictionary entries, ${withRussian} with russian, ` +
      `${translations} parsed translations, ${alreadyMoved} already in ${TARGET}`,
  );

  if (translations < total && !FORCE) {
    throw new Error(
      `only ${translations} of ${total} entries have a parsed translation: run ` +
        'scripts/split-dictionary-translations.js --apply first (or pass --force)',
    );
  }
  if (!APPLY) {
    console.log(
      `Would copy ${withRussian} russian fields to ${TARGET} and unset them. Re-run with --apply.`,
    );
    return mongoose.disconnect();
  }

  console.log(`Copying to ${TARGET}...`);
  await dictionaries
    .aggregate([
      { $match: HAS_RUSSIAN },
      { $project: { chinese: 1, russian: 1 } },
      { $merge: { into: TARGET, on: '_id', whenMatched: 'replace', whenNotMatched: 'insert' } },
    ])
    .toArray();

  const notCopied = await dictionaries
    .aggregate([
      { $match: HAS_RUSSIAN },
      { $lookup: { from: TARGET, localField: '_id', foreignField: '_id', as: 'copy' } },
      { $match: { $expr: { $ne: [{ $arrayElemAt: ['$copy.russian', 0] }, '$russian'] } } },
      { $count: 'n' },
    ])
    .toArray();
  if (notCopied.length && notCopied[0].n) {
    throw new Error(`${notCopied[0].n} entries have no identical copy in ${TARGET}, nothing unset`);
  }
  console.log(`Copied and checked ${withRussian} entries`);

  // walks _id ranges, so a batch never rescans the entries already done
  let unset = 0;
  let lastId = null;
  for (;;) {
    const ids = (
      await dictionaries
        .find(
          { ...HAS_RUSSIAN, ...(lastId && { _id: { $gt: lastId } }) },
          { projection: { _id: 1 } },
        )
        .sort({ _id: 1 })
        .limit(BATCH_SIZE)
        .toArray()
    ).map((d) => d._id);
    if (!ids.length) break;
    lastId = ids[ids.length - 1];
    const { modifiedCount } = await dictionaries.updateMany(
      { _id: { $in: ids } },
      { $unset: { russian: '' } },
    );
    unset += modifiedCount;
    console.log(`unset ${unset}/${withRussian}`);
  }

  console.log(`Done. ${unset} russian fields moved to ${TARGET}.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
