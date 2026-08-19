/**
 * One-off migration: pull all Text documents whose title starts with a given
 * substring, sort them by date, and flatten them into BookPages of a single
 * BookContent section belonging to an already-existing Book.
 *
 * The target book has no chapters of its own - just one implicit
 * BookContent (needed because BookPage.belongsTo/the reading UI expect a
 * content id to group pages under) holding every page in sequence.
 *
 * Each Text's own page split is preserved as-is: long texts that already
 * have a `pages` array keep those page boundaries, short texts become a
 * single page. Nothing is re-flowed across texts, so origintext/translation
 * alignment from the original Text is never disturbed. The source Text
 * documents are left untouched (not deleted, not hidden).
 *
 * Usage:
 *   node scripts/migrate-texts-to-book.js --book-id=<id>                     # dry run
 *   node scripts/migrate-texts-to-book.js --book-id=<id> --apply
 *   node scripts/migrate-texts-to-book.js --book-id=<id> --apply --title="北河镇的红色痕迹"
 *   node scripts/migrate-texts-to-book.js --book-id=<id> --apply --force
 *     # --force: proceed even if the book already has BookContent docs
 *     #          (skip the guard against double-running the migration)
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
const { connectDB } = require('../src/mongo_db/db');
const Text = require('../src/models/Text');
const Book = require('../src/models/Book');
const BookContent = require('../src/models/BookContent');
const BookPage = require('../src/models/BookPage');
const { countZnChars } = require('../src/api/services/_misc');

const DEFAULT_TITLE_PREFIX = '北河镇的红色痕迹';

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const BOOK_ID = (() => {
  const arg = process.argv.find((a) => a.startsWith('--book-id='));
  return arg ? arg.split('=')[1] : null;
})();
const TITLE_PREFIX = (() => {
  const arg = process.argv.find((a) => a.startsWith('--title='));
  return arg ? arg.split('=').slice(1).join('=') : DEFAULT_TITLE_PREFIX;
})();

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Flattens a Text's own content into one or more page payloads, preserving
 * whatever page boundaries the Text already had.
 */
function getPagesFromText(text) {
  if (text.pages?.length) {
    return text.pages.map((page) => ({
      origintext: page.origintext,
      translation: page.translation,
      chinese_arr: page.chinese_arr,
    }));
  }

  return [
    {
      origintext: text.origintext,
      translation: text.translation,
      chinese_arr: text.chinese_arr,
    },
  ];
}

async function run() {
  if (!BOOK_ID) {
    console.error('Missing required --book-id=<objectId> argument');
    process.exit(1);
  }
  if (!mongoose.isValidObjectId(BOOK_ID)) {
    console.error(`--book-id "${BOOK_ID}" is not a valid ObjectId`);
    process.exit(1);
  }

  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  const book = await Book.findById(BOOK_ID);
  if (!book) {
    console.error(`No book found with _id ${BOOK_ID}. Create it first.`);
    await mongoose.disconnect();
    return;
  }

  if (!FORCE) {
    const existingContentCount = await BookContent.countDocuments({ book: BOOK_ID });
    if (existingContentCount > 0) {
      console.error(
        `Book ${BOOK_ID} already has ${existingContentCount} BookContent doc(s). ` +
          `Re-run with --force if you really want to add more content to it.`
      );
      await mongoose.disconnect();
      return;
    }
  }

  const texts = await Text.find({
    title: { $regex: '^' + escapeRegExp(TITLE_PREFIX) },
  }).sort({ date: 1, _id: 1 });

  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} - matched ${texts.length} text(s) with title starting with "${TITLE_PREFIX}":`
  );
  texts.forEach((t) => console.log(`  - [${t.date.toISOString()}] ${t.title} (${t._id})`));

  if (!texts.length) {
    await mongoose.disconnect();
    return;
  }

  const pagePayloads = texts.flatMap(getPagesFromText);
  console.log(`Will create 1 BookContent + ${pagePayloads.length} BookPage(s) for book ${BOOK_ID}.`);

  if (APPLY) {
    const content = await BookContent.create({
      book: BOOK_ID,
      ind: 0,
      title: { cn: TITLE_PREFIX, ru: null },
    });

    const pages = pagePayloads.map((payload, ind) => {
      const origTxtStr = (payload.chinese_arr || []).join('');
      return {
        book: BOOK_ID,
        belongsTo: content._id,
        ind,
        length: countZnChars(origTxtStr),
        origintext: payload.origintext,
        translation: payload.translation,
        chinese_arr: payload.chinese_arr,
      };
    });

    await BookPage.insertMany(pages);
    console.log(`Created BookContent ${content._id} with ${pages.length} pages.`);
  } else {
    console.log('Dry run only - no writes made. Re-run with --apply to persist changes.');
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
