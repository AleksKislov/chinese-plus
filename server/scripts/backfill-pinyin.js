/**
 * One-off migration: fill in missing/placeholder `pinyin` and backfill `cleanPinyin`
 * on the dictionary collection.
 *
 * - pinyin generation uses `mdbg` (local CC-CEDICT index, already used by
 *   routes/api/dictionary.js `/getTextPinyin`), falling back to nodejieba
 *   segmentation and then per-character lookup for words not in CEDICT whole.
 * - Only entries whose pinyin is empty or a placeholder ("_", "--", etc.) are
 *   regenerated; existing pinyin is left untouched (just trimmed).
 * - cleanPinyin is derived from the final pinyin by stripping diacritics, no
 *   spaces, matching the concatenated-syllable convention already used for pinyin.
 * - cleanPinyin is only set for entries whose `chinese` is at most
 *   MAX_CLEAN_PINYIN_CHARS characters long; longer entries have any existing
 *   cleanPinyin removed instead.
 *
 * Usage:
 *   node scripts/backfill-pinyin.js                       # dry run, no writes
 *   node scripts/backfill-pinyin.js --apply               # writes changes
 *   node scripts/backfill-pinyin.js --apply --limit=500
 *   node scripts/backfill-pinyin.js --apply --all-clean-pinyin
 *     # also recomputes cleanPinyin for every document (not just ones
 *     # missing it), e.g. after changing the stripDiacritics logic.
 *     # pinyin itself is still only regenerated for placeholder entries.
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
const ALL_CLEAN_PINYIN = process.argv.includes('--all-clean-pinyin');
const LIMIT = (() => {
  const arg = process.argv.find((a) => a.startsWith('--limit='));
  return arg ? Number(arg.split('=')[1]) : 0;
})();
const BATCH_SIZE = 200;
const LOG_EVERY = 500;
const MAX_CLEAN_PINYIN_CHARS = 8;

const PLACEHOLDER_RE = /^[-_]+$/;
const DIACRITICS_RE = /[\u0300-\u036f]/g;

function isPlaceholder(pinyin) {
  const trimmed = (pinyin || '').trim();
  return trimmed === '' || PLACEHOLDER_RE.test(trimmed);
}

function charLength(str) {
  return [...str].length;
}

function stripDiacritics(str) {
  return str.normalize('NFD').replace(DIACRITICS_RE, '').replace(/\s+/g, '').toLowerCase();
}

async function tryGet(word) {
  try {
    const entry = await mdbg.get(word);
    if (!entry || !entry.definitions) return null;
    const def = Object.values(entry.definitions)[0];
    if (!def || !def.pinyin) return null;
    return def.pinyin.replace(/\s+/g, '');
  } catch (e) {
    return null;
  }
}

async function pinyinForHanzi(hanzi) {
  const whole = await tryGet(hanzi);
  if (whole) return whole;

  const segments = nodejieba.cut(hanzi).filter((s) => s.trim() !== '');
  const pieces = [];
  for (const segment of segments) {
    const segPinyin = await tryGet(segment);
    if (segPinyin) {
      pieces.push(segPinyin);
      continue;
    }
    for (const char of segment) {
      const charPinyin = await tryGet(char);
      if (!charPinyin) return null;
      pieces.push(charPinyin);
    }
  }
  return pieces.length ? pieces.join('') : null;
}

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  const query = ALL_CLEAN_PINYIN
    ? {}
    : {
        $or: [
          { pinyin: { $regex: /^\s*$/ } },
          { pinyin: { $regex: /^\s*[-_]+\s*$/ } },
          {
            cleanPinyin: { $exists: false },
            $expr: { $lte: [{ $strLenCP: '$chinese' }, MAX_CLEAN_PINYIN_CHARS] },
          },
        ],
      };

  const total = await Dictionary.countDocuments(query);
  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'}${
      ALL_CLEAN_PINYIN ? ' (rebuilding cleanPinyin for all documents)' : ''
    } - ${total} candidate documents${LIMIT ? `, limited to ${LIMIT}` : ''}`
  );

  const cursor = Dictionary.find(query).limit(LIMIT).cursor();

  let processed = 0;
  let updated = 0;
  let unresolved = 0;
  let ops = [];

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    processed += 1;
    const chinese = (doc.chinese || '').trim();
    const existingPinyin = doc.pinyin || '';

    let finalPinyin;
    if (isPlaceholder(existingPinyin)) {
      finalPinyin = await pinyinForHanzi(chinese);
      if (!finalPinyin) {
        unresolved += 1;
        console.log(`UNRESOLVED: ${chinese} (id=${doc._id})`);
        continue;
      }
    } else {
      finalPinyin = existingPinyin.trim();
    }

    const cleanPinyin =
      charLength(chinese) <= MAX_CLEAN_PINYIN_CHARS ? stripDiacritics(finalPinyin) : undefined;

    if (finalPinyin !== existingPinyin || cleanPinyin !== doc.cleanPinyin) {
      updated += 1;
      const update = { $set: { pinyin: finalPinyin } };
      if (cleanPinyin !== undefined) {
        update.$set.cleanPinyin = cleanPinyin;
      } else if (doc.cleanPinyin !== undefined) {
        update.$unset = { cleanPinyin: '' };
      }
      ops.push({ updateOne: { filter: { _id: doc._id }, update } });
    }

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
