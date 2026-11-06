/**
 * One-off migration: removes `previous` (the old edit history: pinyin + DSL markup of the
 * entry before each edit) from `dictionaries`. Edits are recorded in `dictionaryrevisions` now
 * (src/api/services/dictionary/word-entry.js) and the old entries are not used any more.
 *
 * Usage:
 *   node scripts/drop-dictionary-previous.js            # dry run: counts only
 *   node scripts/drop-dictionary-previous.js --apply
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
const HAS_PREVIOUS = { previous: { $exists: true } };

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  const dictionaries = mongoose.connection.db.collection('dictionaries');

  const count = await dictionaries.countDocuments(HAS_PREVIOUS);
  console.log(`${count} dictionary entries have \`previous\``);

  if (!APPLY) {
    console.log('Dry run, nothing changed. Run with --apply to remove the field.');
    return mongoose.disconnect();
  }

  const { modifiedCount } = await dictionaries.updateMany(HAS_PREVIOUS, {
    $unset: { previous: '' },
  });
  console.log(`Done. \`previous\` removed from ${modifiedCount} entries.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
