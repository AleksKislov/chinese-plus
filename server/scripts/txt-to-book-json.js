/**
 * Turn a .txt with Chinese text into a JSON file for scripts/import-book.js.
 * Nothing is written to the DB here: check the JSON, then import it.
 *
 * - One paragraph per non-empty line; indentation (incl. full-width spaces) is trimmed.
 * - The file can be UTF-8 or GBK/GB18030 (common for Chinese .txt), detected automatically.
 *
 * Splitting into chapters and volumes, first rule that applies:
 * 1. Marked headings. A line starting with ### is a chapter title, with ## a volume title;
 *    a Russian title can follow after "|":
 *        ## 第一部 出发 | Часть 1
 *        ### 序章 | Пролог
 *        ### 第一章 新朋友
 *    Used whenever the file has such lines; --split is not needed.
 * 2. --split: headings found by their wording. Chapters: 序章, 第一章, 第12话, 尾声 … (see
 *    CHAPTER_RE, or pass your own --heading=<regexp>); volumes: 第一部, 第二卷, 上册 …
 *    (VOLUME_RE). A heading is the marker alone or followed by a space or punctuation, so
 *    "第三节课开始了。" is text.
 * 3. Otherwise the whole file is one chapter.
 * Text before the first chapter heading (or between a volume heading and its first chapter)
 * is left out with a warning.
 *
 * Params:
 *   --txt=<path>              required, the text file
 *   --book-id=<id>            required, the Book to import into (must exist already)
 *   --volume=<n>              volume of the chapters in the file (1, 2, …). With volume headings
 *                             in the file: the number of the first one (default 1), the next
 *                             headings get +1. Omit for a book without volumes.
 *   --volume-cn=<title>       title of volume --volume, e.g. 第二卷; optional when the volume
 *   --volume-ru=<title>         already has chapters in the DB (import-book.js copies the title
 *                               from them) or when the file starts with its heading
 *   --chapter=<n>             `ind` of the first chapter in the book (it runs through all
 *                             volumes); omit to add after the last chapter of the book
 *   --title-cn=<title>        chapter title, for a file without headings; without --title-cn
 *   --title-ru=<title>          the first line is taken as title.cn if it is a chapter heading
 *                               (第三章 …) or if there is no --title-ru either
 *   --split                   find headings by their wording, see above
 *   --heading=<regexp>        custom chapter heading pattern for --split
 *   --out=<path>              default: the .txt path with .json extension
 *
 * Usage (from server/):
 *   node scripts/txt-to-book-json.js --txt=~/books/book.txt --book-id=<id>          # ##/### marks
 *   node scripts/txt-to-book-json.js --txt=~/books/v1c1.txt --book-id=<id> --volume=1 \
 *     --volume-cn=第一卷 --volume-ru="Том 1" --title-ru="Глава 1"
 *   node scripts/txt-to-book-json.js --txt=~/books/volume2.txt --book-id=<id> --volume=2 --split
 *   node scripts/import-book.js --file=~/books/volume2.json            # dry run, then --apply
 */
const path = require('path');
const fs = require('fs');

const getArg = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : undefined;
};
const SPLIT = process.argv.includes('--split');

const NUM = '[0-9０-９零〇一二三四五六七八九十百千两]+';
const AFTER = '(\\s|$|[:：·、.])'; // marker alone or followed by a space/punctuation
const CHAPTER_RE = new RegExp(
  `^(序章|序幕|序言|楔子|引子|终章|尾声|后记|番外.*|第${NUM}[章话話回节節幕])${AFTER}`,
);
const VOLUME_RE = new RegExp(`^(第${NUM}|[上中下])[部卷册冊]${AFTER}`);
const MARK_RE = /^(#{2,3})(?!#)\s*(.*)$/; // ## volume, ### chapter

const toInt = (name, min) => {
  const value = getArg(name);
  if (value === undefined) return undefined;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min) throw new Error(`--${name} must be an integer >= ${min}`);
  return n;
};

const expandHome = (p) => (p.startsWith('~/') ? path.join(require('os').homedir(), p.slice(2)) : p);

// UTF-8 if it decodes cleanly, otherwise GB18030 (superset of GBK/GB2312)
function readText(file) {
  const buf = fs.readFileSync(file);
  try {
    return { text: new TextDecoder('utf-8', { fatal: true }).decode(buf), encoding: 'utf-8' };
  } catch {
    return { text: new TextDecoder('gb18030').decode(buf), encoding: 'gb18030' };
  }
}

const toLines = (text) =>
  text
    .replace(/^﻿/, '')
    .split(/\r?\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean);

// "第一章 新朋友 | Глава 1" -> { cn, ru }, empty halves left out
function parseTitle(str) {
  const [cn, ru] = str.split('|').map((t) => t.trim());
  const title = {};
  if (cn) title.cn = cn;
  if (ru) title.ru = ru;
  return title;
}

// -> { type: 'volume' | 'chapter', title } for a heading line, null for text
function markedHeading(line) {
  const m = line.match(MARK_RE);
  if (!m) return null;
  return { type: m[1] === '##' ? 'volume' : 'chapter', title: parseTitle(m[2]) };
}

function wordingHeading(line, chapterRe) {
  if (VOLUME_RE.test(line)) return { type: 'volume', title: { cn: line } };
  if (chapterRe.test(line)) return { type: 'chapter', title: { cn: line } };
  return null;
}

/**
 * @param {string[]} lines
 * @param {Function} getHeading line -> heading or null
 * @param {Object|null} firstPart volume from --volume, gets the chapters before any volume heading
 * @returns {{ parts: Object[], chapters: Object[] }} chapters: all of them, in order
 */
function splitBook(lines, getHeading, firstPart) {
  const parts = firstPart ? [firstPart] : [];
  const chapters = [];
  const skipped = [];
  let current = null; // chapter the text goes to

  lines.forEach((line) => {
    const heading = getHeading(line);
    if (heading?.type === 'volume') {
      const last = parts.at(-1);
      if (last?.fromArgs && !last.chapters.length) {
        // the file starts with the heading of --volume
        last.title = { ...last.title, ...heading.title };
      } else {
        parts.push({ ind: last ? last.ind + 1 : 1, title: heading.title, chapters: [] });
      }
      parts.at(-1).fromArgs = false;
      current = null;
    } else if (heading?.type === 'chapter') {
      if (!heading.title.cn && !heading.title.ru)
        throw new Error(`Chapter heading without title: "${line}"`);
      current = { title: heading.title, paragraphs: [] };
      chapters.push(current);
      if (parts.length) parts.at(-1).chapters.push(current);
    } else if (current) {
      current.paragraphs.push(line);
    } else {
      skipped.push(line);
    }
  });

  if (skipped.length) {
    console.warn(
      `WARNING: ${skipped.length} line(s) outside of chapters are left out:\n` +
        skipped
          .slice(0, 5)
          .map((l) => `  | ${l.slice(0, 60)}`)
          .join('\n') +
        (skipped.length > 5 ? '\n  | …' : ''),
    );
  }

  const inParts = parts.reduce((sum, p) => sum + p.chapters.length, 0);
  if (parts.length && inParts !== chapters.length) {
    throw new Error(
      `${chapters.length - inParts} chapter(s) before the first volume heading; ` +
        'pass --volume=<n> for them or add a volume heading',
    );
  }
  const emptyPart = parts.find((p) => !p.chapters.length);
  if (emptyPart) {
    throw new Error(
      `Volume ${emptyPart.ind} ${emptyPart.title.cn || emptyPart.title.ru || ''} has no chapters`,
    );
  }

  return { parts, chapters };
}

function run() {
  const txt = getArg('txt');
  const bookId = getArg('book-id');
  if (!txt || !bookId) {
    console.error(
      'Usage: node scripts/txt-to-book-json.js --txt=<file.txt> --book-id=<id> [--volume=<n>] [--chapter=<n>] …',
    );
    console.error('See the comment at the top of the script for all params.');
    process.exit(1);
  }
  if (!/^[0-9a-f]{24}$/i.test(bookId)) {
    throw new Error(`--book-id "${bookId}" is not a valid ObjectId`);
  }

  const volume = toInt('volume', 1);
  const firstInd = toInt('chapter', 0);
  const volumeTitle = parseTitle(
    [getArg('volume-cn'), getArg('volume-ru')].map((t) => t || '').join('|'),
  );
  if (volume === undefined && (volumeTitle.cn || volumeTitle.ru)) {
    throw new Error('--volume-cn/--volume-ru need --volume=<n>');
  }
  const firstPart =
    volume === undefined ? null : { ind: volume, title: volumeTitle, chapters: [], fromArgs: true };

  const txtPath = expandHome(txt);
  const { text, encoding } = readText(txtPath);
  const lines = toLines(text);
  if (!lines.length) throw new Error(`${txtPath} has no text`);

  let mode;
  let book;
  if (lines.some((line) => markedHeading(line))) {
    mode = '##/### marks';
    book = splitBook(lines, markedHeading, firstPart);
  } else if (SPLIT) {
    mode = '--split';
    const chapterRe = getArg('heading') ? new RegExp(getArg('heading')) : CHAPTER_RE;
    book = splitBook(lines, (line) => wordingHeading(line, chapterRe), firstPart);
  } else {
    mode = 'one chapter';
    const title = parseTitle(
      [getArg('title-cn'), getArg('title-ru')].map((t) => t || '').join('|'),
    );
    // first line as title.cn: when it is a chapter heading, or when no title is given at all
    if (!title.cn && (CHAPTER_RE.test(lines[0]) || !title.ru)) title.cn = lines.shift();
    const chapter = { title, paragraphs: lines };
    if (firstPart) firstPart.chapters.push(chapter);
    book = { parts: firstPart ? [firstPart] : [], chapters: [chapter] };
  }
  if (!book.chapters.length) {
    throw new Error('No chapter headings found; check the file or pass --heading=<regexp>');
  }

  const empty = book.chapters.filter((ch) => !ch.paragraphs.length);
  if (empty.length) {
    throw new Error(
      `Chapter(s) without text: ${empty.map((ch) => ch.title.cn || ch.title.ru).join(', ')}`,
    );
  }

  // chapter -> JSON for import-book.js; ind only when --chapter is given
  const toJson = (ch) => ({
    ...(firstInd !== undefined && { ind: firstInd + book.chapters.indexOf(ch) }),
    title: ch.title,
    paragraphs: ch.paragraphs,
  });
  const data = book.parts.length
    ? {
        bookId,
        parts: book.parts.map((p) => ({
          ind: p.ind,
          title: p.title,
          chapters: p.chapters.map(toJson),
        })),
      }
    : { bookId, chapters: book.chapters.map(toJson) };

  const out = expandHome(getArg('out') || txtPath.replace(/\.[^./]+$/, '') + '.json');
  fs.writeFileSync(out, JSON.stringify(data, null, 2) + '\n');

  console.log(`Read ${txtPath} (${encoding}, ${mode}), wrote ${out}:`);
  const printChapter = (ch, indent) => {
    const ind = firstInd !== undefined ? firstInd + book.chapters.indexOf(ch) : '(after last)';
    const title = [ch.title.cn, ch.title.ru].filter(Boolean).join(' / ');
    const chars = ch.paragraphs.join('').length;
    console.log(`${indent}[${ind}] ${title}: ${ch.paragraphs.length} paragraph(s), ${chars} chars`);
  };
  if (book.parts.length) {
    book.parts.forEach((p) => {
      const title = [p.title.cn, p.title.ru].filter(Boolean).join(' / ') || '(title from DB)';
      console.log(`  volume ${p.ind} ${title}`);
      p.chapters.forEach((ch) => printChapter(ch, '    '));
    });
  } else {
    book.chapters.forEach((ch) => printChapter(ch, '  '));
  }
  console.log(`Next: node scripts/import-book.js --file=${out}   (dry run, then add --apply)`);
}

try {
  run();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
