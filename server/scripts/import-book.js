/**
 * Import chapters of an existing Book from a local JSON file: one BookContent per
 * chapter, its text split into BookPages the same way POST /api/books/page does
 * (CHARS_PER_PAGE, paragraph boundaries kept).
 *
 * The JSON can be made from a .txt with scripts/txt-to-book-json.js.
 *
 * File format, a book without volumes:
 *   {
 *     "bookId": "<id>",                               // or --book-id=<id>
 *     "chapters": [
 *       {
 *         "ind": 0,                                   // optional, 0 - prologue, 1 - chapter 1, ...
 *         "title": { "cn": "序章", "ru": "Пролог" },
 *         "paragraphs": ["第一段……", "第二段……"],
 *         "translation": ["Первый абзац…", "Второй абзац…"]   // optional, 1:1 with paragraphs
 *       }
 *     ]
 *   }
 *
 * or a book split into volumes (BookContent.part):
 *   {
 *     "parts": [
 *       {
 *         "ind": 1,                                   // optional, defaults to position + 1
 *         "title": { "cn": "第一卷", "ru": "Том 1" },   // optional if the volume is in the DB already
 *         "chapters": [ ...same as above... ]
 *       }
 *     ]
 *   }
 *
 * - Chapter `ind` runs through the whole book, it does not restart in each volume.
 *   A chapter without `ind` gets the previous chapter's + 1; the first one is added
 *   after the last chapter already in the book (0 for an empty book).
 * - A volume without a title gets the title its other chapters have in the DB.
 * - The Book itself (and its author) must exist already: create them in the admin UI
 *   or with POST /api/books/author, POST /api/books.
 * - A chapter whose `ind` already exists in the book is skipped; with --replace its
 *   title and volume are updated and its pages are deleted and recreated (comments
 *   attached to those pages are lost).
 *
 * Usage (from server/):
 *   node scripts/import-book.js --file=content/books/x.json                    # dry run
 *   node scripts/import-book.js --file=content/books/x.json --apply
 *   node scripts/import-book.js --file=content/books/x.json --apply --replace
 *   node scripts/import-book.js --file=content/books/x.json --book-id=<id>     # no bookId in the file
 *
 * After applying, clear the API cache: POST /api/project/cache/refresh?tag=books
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

const APPLY = process.argv.includes('--apply');
const REPLACE = process.argv.includes('--replace');
const getArg = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : undefined;
};
const BOOK_ID = getArg('book-id');
const FILE = getArg('file');

// one paragraph per line, no empty paragraphs: getPages() re-splits page text on '\n'
const cleanParagraphs = (arr) =>
  (arr || [])
    .flatMap((p) => String(p).split('\n'))
    .map((p) => p.trim())
    .filter(Boolean);

const hasTitle = (title) => Boolean(title?.cn || title?.ru);

// nextInd: `ind` for the first chapter without one (the book's last chapter + 1)
function readChapters(data, file, nextInd) {
  if (data.parts && data.chapters)
    throw new Error(`${file}: use either "parts" or "chapters", not both`);

  // [{ part, chapter, where }], part is undefined for books without volumes
  let entries;
  if (data.parts) {
    if (!Array.isArray(data.parts) || !data.parts.length) {
      throw new Error(`${file}: "parts" must be a non-empty array`);
    }
    const seenParts = new Set();
    entries = data.parts.flatMap((p, i) => {
      const where = `${file}: parts[${i}]`;
      const ind = p.ind ?? i + 1;
      if (!Number.isInteger(ind) || ind < 1)
        throw new Error(`${where}: "ind" must be an integer >= 1`);
      if (seenParts.has(ind)) throw new Error(`${where}: duplicate ind ${ind}`);
      seenParts.add(ind);
      if (!Array.isArray(p.chapters) || !p.chapters.length) {
        throw new Error(`${where}: "chapters" must be a non-empty array`);
      }

      // shared by the volume's chapters; an empty title is filled from the DB in run()
      const title = {};
      if (p.title?.cn) title.cn = p.title.cn;
      if (p.title?.ru) title.ru = p.title.ru;
      const part = { ind, title };
      return p.chapters.map((chapter, j) => ({ part, chapter, where: `${where}.chapters[${j}]` }));
    });
  } else {
    if (!Array.isArray(data.chapters) || !data.chapters.length) {
      throw new Error(`${file}: "chapters" (or "parts") must be a non-empty array`);
    }
    entries = data.chapters.map((chapter, i) => ({ chapter, where: `${file}: chapters[${i}]` }));
  }

  const seen = new Set();
  let prevInd = nextInd - 1;
  return entries.map(({ part, chapter: ch, where }) => {
    const ind = ch.ind ?? prevInd + 1;
    if (!Number.isInteger(ind) || ind < 0)
      throw new Error(`${where}: "ind" must be an integer >= 0`);
    if (seen.has(ind)) throw new Error(`${where}: duplicate ind ${ind}`);
    seen.add(ind);
    prevInd = ind;
    if (!hasTitle(ch.title)) throw new Error(`${where}: "title.cn" or "title.ru" is required`);

    const paragraphs = cleanParagraphs(ch.paragraphs);
    if (!paragraphs.length) throw new Error(`${where}: "paragraphs" is empty`);

    // translation is matched to paragraphs by position, so it is not re-split
    const translation = (ch.translation || []).map((t) => String(t).trim());
    if (translation.length && translation.length !== paragraphs.length) {
      throw new Error(
        `${where}: ${translation.length} translation paragraph(s) for ${paragraphs.length} paragraph(s)`,
      );
    }

    return {
      ind,
      part,
      title: { cn: ch.title.cn || null, ru: ch.title.ru || null },
      paragraphs,
      translation,
    };
  });
}

function buildPages(chapter, contentId, bookId) {
  const { getPages } = require('../src/api/services/books/create-pages');
  const pages = getPages(chapter.paragraphs, contentId, bookId);

  if (chapter.translation.length) {
    let offset = 0;
    pages.forEach((page) => {
      page.translation = chapter.translation.slice(offset, offset + page.origintext.length);
      offset += page.origintext.length;
    });
  }

  return pages;
}

// a volume without a title takes it from its chapters already in the DB
async function fillPartTitles(chapters, BookContent, bookId) {
  const parts = [...new Set(chapters.map((ch) => ch.part).filter(Boolean))];
  for (const part of parts) {
    const inDb = await BookContent.findOne({ book: bookId, 'part.ind': part.ind }).select('part');
    const dbTitle = inDb?.part?.title || {};

    if (!hasTitle(part.title)) {
      if (dbTitle.cn) part.title.cn = dbTitle.cn;
      if (dbTitle.ru) part.title.ru = dbTitle.ru;
      if (!hasTitle(part.title))
        console.warn(`  WARNING: volume ${part.ind} has no title, shown as "Том ${part.ind}"`);
    } else if (inDb && (part.title.cn !== dbTitle.cn || part.title.ru !== dbTitle.ru)) {
      console.warn(
        `  WARNING: volume ${part.ind} is "${dbTitle.cn} / ${dbTitle.ru}" in the DB, ` +
          `"${part.title.cn} / ${part.title.ru}" in the file`,
      );
    }
  }
}

async function run() {
  if (!FILE) {
    console.error(
      'Usage: node scripts/import-book.js --file=<path.json> [--book-id=<id>] [--apply] [--replace]',
    );
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(path.resolve(FILE), 'utf8'));
  if (BOOK_ID && data.bookId && BOOK_ID !== data.bookId) {
    console.error(`--book-id ${BOOK_ID} differs from "bookId" ${data.bookId} in ${FILE}`);
    process.exit(1);
  }
  const bookId = BOOK_ID || data.bookId;
  if (!mongoose.isValidObjectId(bookId)) {
    console.error(
      `Book id "${bookId}" is not a valid ObjectId (set "bookId" in the file or pass --book-id)`,
    );
    process.exit(1);
  }
  // validate before connecting; chapter numbers are final once the book's last chapter is known
  readChapters(data, FILE, 0);

  const { connectDB } = require('../src/mongo_db/db');
  const Book = require('../src/models/Book');
  const BookContent = require('../src/models/BookContent');
  const BookPage = require('../src/models/BookPage');

  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  const book = await Book.findById(bookId).select('title');
  if (!book) {
    console.error(`No book found with _id ${bookId}. Create it first.`);
    await mongoose.disconnect();
    return;
  }

  console.log(
    `${APPLY ? 'APPLYING' : 'DRY RUN'} - "${book.title?.cn || book.title?.ru}" (${bookId})`,
  );

  const lastChapter = await BookContent.findOne({ book: bookId }).sort({ ind: -1 }).select('ind');
  const chapters = readChapters(data, FILE, lastChapter ? lastChapter.ind + 1 : 0);
  await fillPartTitles(chapters, BookContent, bookId);

  for (const chapter of chapters) {
    const volume = chapter.part ? `vol. ${chapter.part.ind} ` : '';
    const label = `${volume}[${chapter.ind}] ${chapter.title.cn || ''}${chapter.title.ru ? ` / ${chapter.title.ru}` : ''}`;
    const existing = await BookContent.findOne({ book: bookId, ind: chapter.ind });

    if (existing && !REPLACE) {
      console.log(
        `  skip ${label}: chapter already exists (${existing._id}), use --replace to overwrite`,
      );
      continue;
    }

    const contentId = existing?._id || new mongoose.Types.ObjectId();
    const pages = buildPages(chapter, contentId, bookId);
    const chars = pages.reduce((sum, p) => sum + p.length, 0);
    console.log(
      `  ${existing ? 'replace' : 'add'} ${label}: ${chapter.paragraphs.length} paragraph(s), ` +
        `${chars} chars, ${pages.length} page(s)${chapter.translation.length ? ', with translation' : ''}`,
    );

    if (!APPLY) continue;

    if (existing) {
      existing.title = chapter.title;
      existing.part = chapter.part;
      await existing.save();
      await BookPage.deleteMany({ belongsTo: existing._id });
    } else {
      await BookContent.create({
        _id: contentId,
        book: bookId,
        ind: chapter.ind,
        title: chapter.title,
        part: chapter.part,
      });
    }
    await BookPage.insertMany(pages);
  }

  if (!APPLY) console.log('Dry run only - no writes made. Re-run with --apply to persist changes.');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
