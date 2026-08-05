/**
 * One-off migration: populate `tradChinese` with each entry's traditional
 * writing, looked up via `mdbg` (CEDICT), for every resolvable dictionary
 * word - regardless of whether it matches `chinese` or not.
 *
 * `chinese` is never modified. Entries whose traditional form can't be
 * resolved at all (word not in CEDICT, even after segmenting/splitting into
 * characters) are skipped and logged as UNRESOLVED, not guessed.
 *
 * Word-level mdbg lookup is tried first, so CEDICT resolves ambiguous
 * simplified->traditional mappings using word context (e.g. 干 -> 幹/乾/干
 * depending on meaning) rather than a naive per-character guess. Falls back
 * to nodejieba segmentation, then per-character lookup, for words not in
 * CEDICT whole - same ladder as the pinyin backfill script.
 *
 * tradChinese is set for EVERY resolvable entry, even when it's identical
 * to `chinese`. That's intentional: later, entries whose `chinese` is
 * currently stored in traditional form can be found via
 * `{ $expr: { $eq: ['$chinese', '$tradChinese'] } }`, and it also lets you
 * search by traditional form regardless of what's stored in `chinese`.
 *
 * Usage:
 *   node scripts/split-traditional-chinese.js            # dry run
 *   node scripts/split-traditional-chinese.js --apply
 *   node scripts/split-traditional-chinese.js --apply --limit=500
 */
const path = require('path');

require('dotenv').config({
  path: path.join(
    __dirname,
    '..',
    'config',
    process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod'
  ),
});

const mongoose = require('mongoose');
const nodejieba = require('nodejieba');
const mdbg = require('mdbg');
const { connectDB } = require('../src/mongo_db/db');
const Dictionary = require('../src/models/Dictionary');

const APPLY = process.argv.includes('--apply');
const LIMIT = (() => {
  const arg = process.argv.find((a) => a.startsWith('--limit='));
  return arg ? Number(arg.split('=')[1]) : 0;
})();
const BATCH_SIZE = 200;
const LOG_EVERY = 500;

async function tryGetTraditional(word) {
  try {
    const entry = await mdbg.get(word);
    if (!entry || Array.isArray(entry) || !entry.traditional) return null;
    return entry.traditional;
  } catch (e) {
    return null;
  }
}

async function traditionalForHanzi(hanzi) {
  const whole = await tryGetTraditional(hanzi);
  if (whole) return whole;

  const segments = nodejieba.cut(hanzi).filter((s) => s.trim() !== '');
  const pieces = [];
  for (const segment of segments) {
    const segTraditional = await tryGetTraditional(segment);
    if (segTraditional) {
      pieces.push(segTraditional);
      continue;
    }
    for (const char of segment) {
      const charTraditional = await tryGetTraditional(char);
      if (!charTraditional) return null;
      pieces.push(charTraditional);
    }
  }
  return pieces.length ? pieces.join('') : null;
}

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  const query = { tradChinese: { $exists: false } };
  const total = await Dictionary.countDocuments(query);
  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} - ${total} candidate documents${
      LIMIT ? `, limited to ${LIMIT}` : ''
    }`
  );

  const cursor = Dictionary.find(query).limit(LIMIT).cursor();

  let processed = 0;
  let updated = 0;
  let unresolved = 0;
  let ops = [];

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    processed += 1;
    const chinese = (doc.chinese || '').trim();

    const tradChinese = await traditionalForHanzi(chinese);
    if (!tradChinese) {
      unresolved += 1;
      console.log(`UNRESOLVED: ${chinese} (id=${doc._id})`);
      continue;
    }

    updated += 1;
    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { tradChinese } },
      },
    });

    if (ops.length >= BATCH_SIZE) {
      if (APPLY) await Dictionary.bulkWrite(ops);
      ops = [];
    }

    if (processed % LOG_EVERY === 0) console.log(`processed ${processed}/${total}`);
  }

  if (ops.length && APPLY) await Dictionary.bulkWrite(ops);

  console.log(`Done. processed=${processed} updated=${updated} unresolved=${unresolved}`);
  if (!APPLY) console.log('Dry run only - no writes made. Re-run with --apply to persist changes.');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
