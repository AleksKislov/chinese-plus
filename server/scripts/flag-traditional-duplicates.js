/**
 * Follow-up to split-traditional-chinese.js.
 *
 * Finds entries whose `chinese` currently contains at least one character
 * that only exists in traditional writing (i.e. that character's simplified
 * counterpart differs, per CEDICT) - NOT `chinese === tradChinese`, since
 * that would also match every word made entirely of characters shared
 * between both scripts (a large share of common vocabulary), which have
 * nothing to fix. Containing a traditional-only character is unambiguous:
 * such a character is never used in modern simplified writing.
 *
 * For each match, looks up the simplified form of that word via `mdbg` and
 * checks whether some OTHER document already has that simplified form as
 * its `chinese`. If so, sets `duplicateOf` on the traditional-written entry
 * to the other document's _id.
 *
 * Nothing is merged, converted, or deleted - this only tags candidates for
 * manual review. Use `duplicateOf` to find them afterwards, e.g.:
 *   db.dictionary.find({ duplicateOf: { $exists: true } })
 *
 * Usage:
 *   node scripts/flag-traditional-duplicates.js            # dry run
 *   node scripts/flag-traditional-duplicates.js --apply
 *   node scripts/flag-traditional-duplicates.js --apply --limit=500
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
const cedictData = require('cedict');
const { connectDB } = require('../src/mongo_db/db');
const Dictionary = require('../src/models/Dictionary');

function buildTraditionalCharSet() {
  const set = new Set();
  for (const entry of cedictData) {
    const { traditional: t, simplified: s } = entry;
    if (!s || !t || t.length !== s.length) continue;
    for (let i = 0; i < t.length; i++) {
      if (t[i] !== s[i]) set.add(t[i]);
    }
  }
  return set;
}

function escapeForCharClass(ch) {
  return /[\]\\^-]/.test(ch) ? `\\${ch}` : ch;
}

function buildTraditionalRegex(set) {
  const body = [...set].map(escapeForCharClass).join('');
  return new RegExp(`[${body}]`);
}

const APPLY = process.argv.includes('--apply');
const LIMIT = (() => {
  const arg = process.argv.find((a) => a.startsWith('--limit='));
  return arg ? Number(arg.split('=')[1]) : 0;
})();
const BATCH_SIZE = 200;

async function tryGetSimplified(word) {
  try {
    const entry = await mdbg.get(word);
    if (!entry || Array.isArray(entry) || !entry.simplified) return null;
    return entry.simplified;
  } catch (e) {
    return null;
  }
}

async function simplifiedForHanzi(hanzi) {
  const whole = await tryGetSimplified(hanzi);
  if (whole) return whole;

  const segments = nodejieba.cut(hanzi).filter((s) => s.trim() !== '');
  const pieces = [];
  for (const segment of segments) {
    const segSimplified = await tryGetSimplified(segment);
    if (segSimplified) {
      pieces.push(segSimplified);
      continue;
    }
    for (const char of segment) {
      const charSimplified = await tryGetSimplified(char);
      if (!charSimplified) return null;
      pieces.push(charSimplified);
    }
  }
  return pieces.length ? pieces.join('') : null;
}

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  const traditionalCharSet = buildTraditionalCharSet();
  const traditionalRegex = buildTraditionalRegex(traditionalCharSet);
  console.log(`Loaded ${traditionalCharSet.size} traditional-only characters from cedict`);

  const query = {
    chinese: { $regex: traditionalRegex },
    duplicateOf: { $exists: false },
  };

  const total = await Dictionary.countDocuments(query);
  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} - ${total} candidate documents${
      LIMIT ? `, limited to ${LIMIT}` : ''
    }`
  );

  const cursor = Dictionary.find(query).limit(LIMIT).cursor();

  let processed = 0;
  let flagged = 0;
  let unresolved = 0;
  let ops = [];

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    processed += 1;
    const chinese = (doc.chinese || '').trim();

    const simplified = await simplifiedForHanzi(chinese);
    if (!simplified) {
      unresolved += 1;
      console.log(`UNRESOLVED: ${chinese} (id=${doc._id})`);
      continue;
    }
    if (simplified === chinese) continue; // no distinct simplified counterpart to collide with

    const match = await Dictionary.findOne({ chinese: simplified, _id: { $ne: doc._id } }).select(
      '_id chinese'
    );
    if (!match) continue;

    flagged += 1;
    console.log(
      `DUPLICATE: "${chinese}" (id=${doc._id}) -> simplified "${simplified}" already exists as id=${match._id}`
    );

    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { duplicateOf: match._id } },
      },
    });

    if (ops.length >= BATCH_SIZE) {
      if (APPLY) await Dictionary.bulkWrite(ops);
      ops = [];
    }
  }

  if (ops.length && APPLY) await Dictionary.bulkWrite(ops);

  console.log(`Done. processed=${processed} flagged=${flagged} unresolved=${unresolved}`);
  if (!APPLY) console.log('Dry run only - no writes made. Re-run with --apply to persist changes.');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
