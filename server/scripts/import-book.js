/**
 * Import chapters of an existing Book from a local JSON file: one BookContent per
 * chapter, its text split into BookPages the same way POST /api/books/page does
 * (CHARS_PER_PAGE, paragraph boundaries kept).
 *
 * File format (e.g. content/books/<name>.json), a book without volumes:
 *   {
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
 *         "title": { "cn": "第一卷", "ru": "Том 1" },
 *         "chapters": [ ...same as above... ]
 *       }
 *     ]
 *   }
 *
 * - Chapter `ind` runs through the whole book, it does not restart in each volume.
 *   A chapter without `ind` gets the previous chapter's + 1 (the first one gets 0), so
 *   only set it when importing more chapters into a book that already has some
 *   (e.g. volume 2 later: "ind" of its first chapter = last chapter of volume 1 + 1).
 * - The Book itself (and its author) must exist already: create them in the admin UI
 *   or with POST /api/books/author, POST /api/books.
 * - A chapter whose `ind` already exists in the book is skipped; with --replace its
 *   title and volume are updated and its pages are deleted and recreated (comments
 *   attached to those pages are lost).
 *
 * Usage (from server/):
 *   node scripts/import-book.js --book-id=<id> --file=content/books/x.json            # dry run
 *   node scripts/import-book.js --book-id=<id> --file=content/books/x.json --apply
 *   node scripts/import-book.js --book-id=<id> --file=content/books/x.json --apply --replace
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
  (arr || []).flatMap((p) => String(p).split('\n')).map((p) => p.trim()).filter(Boolean);

const hasTitle = (title) => Boolean(title?.cn || title?.ru);

function readChapters(file) {
  const data = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  if (data.parts && data.chapters) throw new Error(`${file}: use either "parts" or "chapters", not both`);

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
      if (!Number.isInteger(ind) || ind < 1) throw new Error(`${where}: "ind" must be an integer >= 1`);
      if (seenParts.has(ind)) throw new Error(`${where}: duplicate ind ${ind}`);
      seenParts.add(ind);
      if (!hasTitle(p.title)) throw new Error(`${where}: "title.cn" or "title.ru" is required`);
      if (!Array.isArray(p.chapters) || !p.chapters.length) {
        throw new Error(`${where}: "chapters" must be a non-empty array`);
      }

      const part = { ind, title: { cn: p.title.cn || undefined, ru: p.title.ru || undefined } };
      return p.chapters.map((chapter, j) => ({ part, chapter, where: `${where}.chapters[${j}]` }));
    });
  } else {
    if (!Array.isArray(data.chapters) || !data.chapters.length) {
      throw new Error(`${file}: "chapters" (or "parts") must be a non-empty array`);
    }
    entries = data.chapters.map((chapter, i) => ({ chapter, where: `${file}: chapters[${i}]` }));
  }

  const seen = new Set();
  let prevInd = -1;
  return entries.map(({ part, chapter: ch, where }) => {
    const ind = ch.ind ?? prevInd + 1;
    if (!Number.isInteger(ind) || ind < 0) throw new Error(`${where}: "ind" must be an integer >= 0`);
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

async function run() {
  if (!BOOK_ID || !FILE) {
    console.error('Usage: node scripts/import-book.js --book-id=<id> --file=<path.json> [--apply] [--replace]');
    process.exit(1);
  }
  if (!mongoose.isValidObjectId(BOOK_ID)) {
    console.error(`--book-id "${BOOK_ID}" is not a valid ObjectId`);
    process.exit(1);
  }

  const chapters = readChapters(FILE);

  const { connectDB } = require('../src/mongo_db/db');
  const Book = require('../src/models/Book');
  const BookContent = require('../src/models/BookContent');
  const BookPage = require('../src/models/BookPage');

  const MONGO_DB = process.env.MONGO_IN_CONTAINER ? process.env.CONTAINER_MONGO_DB : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  const book = await Book.findById(BOOK_ID).select('title');
  if (!book) {
    console.error(`No book found with _id ${BOOK_ID}. Create it first.`);
    await mongoose.disconnect();
    return;
  }

  console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'} - "${book.title?.cn || book.title?.ru}" (${BOOK_ID})`);

  for (const chapter of chapters) {
    const volume = chapter.part ? `vol. ${chapter.part.ind} ` : '';
    const label = `${volume}[${chapter.ind}] ${chapter.title.cn || ''}${chapter.title.ru ? ` / ${chapter.title.ru}` : ''}`;
    const existing = await BookContent.findOne({ book: BOOK_ID, ind: chapter.ind });

    if (existing && !REPLACE) {
      console.log(`  skip ${label}: chapter already exists (${existing._id}), use --replace to overwrite`);
      continue;
    }

    const contentId = existing?._id || new mongoose.Types.ObjectId();
    const pages = buildPages(chapter, contentId, BOOK_ID);
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
        book: BOOK_ID,
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
