/**
 * Recalculates BookPage.length for all pages of a book from their current
 * origintext, using the same formula as page creation (create-pages.js):
 * countZnChars(origintext.join('\n')).
 *
 * Useful after manually editing page content, since the edit route
 * (src/api/services/books/update.js) updates origintext/chinese_arr but
 * never recomputes length.
 *
 * Usage:
 *   node scripts/recalculate-book-pages-length.js --book-id=<id>            # dry run
 *   node scripts/recalculate-book-pages-length.js --book-id=<id> --apply
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
const Book = require('../src/models/Book');
const BookPage = require('../src/models/BookPage');
const { countZnChars } = require('../src/api/services/_misc');

const APPLY = process.argv.includes('--apply');
const BOOK_ID = (() => {
  const arg = process.argv.find((a) => a.startsWith('--book-id='));
  return arg ? arg.split('=')[1] : null;
})();

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
    console.error(`No book found with _id ${BOOK_ID}.`);
    await mongoose.disconnect();
    return;
  }

  const pages = await BookPage.find({ book: BOOK_ID }).sort({ belongsTo: 1, ind: 1 });

  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} - found ${pages.length} page(s) for book ${BOOK_ID}:`
  );

  let changedCount = 0;

  for (const page of pages) {
    const newLength = countZnChars((page.origintext || []).join('\n'));

    if (newLength !== page.length) {
      changedCount += 1;
      console.log(
        `  - page ${page._id} (content ${page.belongsTo}, ind ${page.ind}): ${page.length} -> ${newLength}`
      );

      if (APPLY) {
        page.length = newLength;
        await page.save();
      }
    }
  }

  console.log(
    `${changedCount} page(s) ${APPLY ? 'updated' : 'would be updated'} out of ${pages.length}.`
  );
  if (!APPLY) {
    console.log('Dry run only - no writes made. Re-run with --apply to persist changes.');
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
