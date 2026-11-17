/**
 * Printable PDF word lists for every HSK level -> Yandex bucket (hsk-pdf/…), linked from the
 * word list pages (qwik: CONST_URLS.hskPdfUrl, hskPdfKey below must match its naming).
 *
 * Two files per level:
 *   hsk-pdf/hsk3-1.pdf           № / слово / пиньинь / часть речи / перевод
 *   hsk-pdf/hsk3-1-practice.pdf  the same with an empty translation column (self-check)
 * Lists: HSK 3.0 (hskword2025: levels 1-6 and 789 -> "hsk3-7-9") for /hsk/3/table/,
 *        HSK 2.0 (lexicons: levels 1-6, no part of speech) for /hsk/2/table/.
 * The translation is the start of the word's dictionary translation (HSK 3.0) or the lexicon's
 * own one (HSK 2.0), cut to fit two lines.
 *
 * Fonts (git-ignored, SIL Open Font License): scripts/fonts/NotoSansSC-Regular.otf and
 * NotoSansSC-Bold.otf from https://github.com/notofonts/noto-cjk/raw/main/Sans/SubsetOTF/SC/
 * Logo: qwik/public/favicon.svg.
 *
 * Re-run after the HSK lists or their translations change (same keys, the files are replaced).
 * Dev and prod share the bucket, so one run covers both.
 *
 * Usage (from server/):
 *   NODE_ENV=development node scripts/generate-hsk-pdfs.js --out=./tmp/hsk-pdf
 *       # only write the files locally, to look at them
 *   NODE_ENV=development node scripts/generate-hsk-pdfs.js --apply
 *       # generate and upload all
 *   NODE_ENV=development node scripts/generate-hsk-pdfs.js --apply --list=hsk3 --level=1
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
const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { connectDB } = require('../src/mongo_db/db');
const Hskword2025 = require('../src/models/Hskword2025');
const Lexicon = require('../src/models/Lexicon');
const { s3 } = require('../src/api/services/_misc/s3-client');
const {
  findSenses,
  trimSenses,
} = require('../src/api/services/dictionary/translations/attach-senses');
const { sensesToText } = require('../src/api/services/_misc/mark-up-senses');

const APPLY = process.argv.includes('--apply');
const getArg = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : undefined;
};
const ONLY_LIST = getArg('list'); // hsk3 | hsk2
const ONLY_LEVEL = getArg('level'); // 1..6 | 789
const OUT_DIR = getArg('out');

const BUCKET = process.env.YA_S3_BUCKET;
const SITE = 'https://www.chineseplus.club';
const FONT_DIR = path.join(__dirname, 'fonts');
const FONT_REGULAR = path.join(FONT_DIR, 'NotoSansSC-Regular.otf');
const FONT_BOLD = path.join(FONT_DIR, 'NotoSansSC-Bold.otf');
const LOGO_SVG = path.join(__dirname, '..', '..', 'qwik', 'public', 'favicon.svg');

const LISTS = {
  hsk3: {
    name: 'HSK 3.0',
    levels: ['1', '2', '3', '4', '5', '6', '789'],
    pagePath: (lvl) => `/hsk/3/table/${lvl === '1' ? '' : `${lvl}/`}`,
    hasPos: true,
  },
  hsk2: {
    name: 'HSK 2.0',
    levels: ['1', '2', '3', '4', '5', '6'],
    pagePath: (lvl) => `/hsk/2/table/${lvl === '1' ? '' : `${lvl}/`}`,
    hasPos: false,
  },
};

const levelLabel = (lvl) => (lvl === '789' ? '7–9' : lvl);
const hskPdfKey = (list, lvl, practice) =>
  `hsk-pdf/${list}-${lvl === '789' ? '7-9' : lvl}${practice ? '-practice' : ''}.pdf`;

// ---------- data ----------

// part of speech of the HSK 3.0 syllabus ("名、动", "数、（副）") in russian abbreviations;
// the bracketed ones (secondary uses) are left out
const POS_RU = {
  名: 'сущ.',
  动: 'гл.',
  形: 'прил.',
  副: 'нар.',
  数: 'числ.',
  量: 'сч. сл.',
  数量: 'числ.-сч.',
  代: 'мест.',
  介: 'предл.',
  连: 'союз',
  助: 'част.',
  叹: 'межд.',
  拟声: 'звукоподр.',
  前缀: 'префикс',
  后缀: 'суффикс',
};
const unknownPos = new Set();
const posToRu = (pos = '') =>
  pos
    .replace(/（[^）]*）|\([^)]*\)/g, '')
    .split('、')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (!POS_RU[p]) unknownPos.add(p);
      return POS_RU[p] || p;
    })
    .join(', ');

const TRANSLATION_CHARS = 90;
const GRAMMAR_LABEL =
  /^(?:(?:гл|сущ|прил|нареч|числ|мест|предл|союз|служ|частица|счётное слово|счетное слово|межд)\.?\s*[;,/]?\s*)+/i;
// a leading pinyin echo of the dictionary entry: ", băi; сто, сотня" -> "сто, сотня"
const PINYIN_PREFIX = /^[a-zA-ZÀ-ɏǍ-ǜ\s']+;\s*/;

const cutText = (text, n) => {
  if (text.length <= n) return text;
  const cut = text.slice(0, n);
  const space = cut.lastIndexOf(' ');
  return `${(space > n / 2 ? cut.slice(0, space) : cut).replace(/[\s,;:(—–-]+$/, '')}…`;
};

// the grammar label is in its own column (HSK 3.0) or of no use in a word list
const cleanTranslation = (text = '') => {
  let t = text.replace(/\s+/g, ' ').trim();
  t = t.replace(/^[\s,;/]+/, '');
  if (PINYIN_PREFIX.test(t)) t = t.replace(PINYIN_PREFIX, '');
  const withoutLabel = t.replace(GRAMMAR_LABEL, '');
  if (withoutLabel) t = withoutLabel;
  return cutText(t.replace(/^[\s,;/]+/, ''), TRANSLATION_CHARS);
};

async function loadWords(list, lvl) {
  if (list === 'hsk3') {
    const words = await Hskword2025.find({ lvl }, { cn: 1, py: 1, pos: 1, dictId: 1 })
      .sort({ id: 1 })
      .lean();
    const senses = await findSenses(words.filter((w) => w.dictId).map((w) => String(w.dictId)));
    return words.map((w) => {
      const s = w.dictId && senses.get(String(w.dictId));
      return {
        cn: w.cn,
        py: w.py,
        pos: posToRu(w.pos),
        ru: s ? cleanTranslation(sensesToText(trimSenses(s, TRANSLATION_CHARS + 20))) : '',
      };
    });
  }
  const words = await Lexicon.find({ level: +lvl }).sort({ word_id: 1 }).lean();
  return words.map((w) => ({
    cn: w.chinese,
    py: w.pinyin,
    ru: cleanTranslation(w.translation),
  }));
}

// ---------- pdf ----------

const PAGE = { size: 'A4', margin: 40 };
const COLORS = {
  text: '#1f2937',
  muted: '#6b7280',
  accent: '#e84141', // the logo red
  line: '#d1d5db',
};
const FOOTER_HEIGHT = 24;
const CELL_PAD_X = 4;
const CELL_PAD_Y = 5;

const plural = (n, [one, few, many]) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

const columnsFor = (hasPos, width) => {
  const fixed = hasPos
    ? [
        { key: 'n', title: '№', width: 34 },
        { key: 'cn', title: 'Слово', width: 96 },
        { key: 'py', title: 'Пиньинь', width: 100 },
        { key: 'pos', title: 'Часть речи', width: 62 },
      ]
    : [
        { key: 'n', title: '№', width: 34 },
        { key: 'cn', title: 'Слово', width: 96 },
        { key: 'py', title: 'Пиньинь', width: 110 },
      ];
  const used = fixed.reduce((s, c) => s + c.width, 0);
  return [...fixed, { key: 'ru', title: 'Перевод', width: width - used }];
};

const CELL_STYLE = {
  n: { font: 'regular', size: 8.5, color: COLORS.muted },
  cn: { font: 'regular', size: 14, color: COLORS.text },
  py: { font: 'regular', size: 10, color: COLORS.text },
  pos: { font: 'regular', size: 8.5, color: COLORS.muted },
  ru: { font: 'regular', size: 9.5, color: COLORS.text },
};

function renderPdf({ list, lvl, words, practice, logo }) {
  const cfg = LISTS[list];
  const pageUrl = `${SITE}${cfg.pagePath(lvl)}`;
  const pageUrlShort = pageUrl.replace(/^https:\/\/www\./, '');
  const title = `Слова ${cfg.name} — уровень ${levelLabel(lvl)}`;
  const count = `${words.length} ${plural(words.length, ['слово', 'слова', 'слов'])}`;

  const doc = new PDFDocument({
    ...PAGE,
    bufferPages: true,
    info: {
      Title: `${title}${practice ? ' (для самопроверки)' : ''}`,
      Author: 'Chinese+ (chineseplus.club)',
      Subject: `Список слов ${cfg.name}, уровень ${levelLabel(lvl)}: ${count} с пиньинем и переводом`,
      Keywords: `${cfg.name}, HSK ${levelLabel(lvl)}, слова, список слов, китайский язык, pdf`,
    },
  });
  doc.registerFont('regular', FONT_REGULAR);
  doc.registerFont('bold', FONT_BOLD);

  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const bottom = () => doc.page.height - doc.page.margins.bottom - FOOTER_HEIGHT;
  const columns = columnsFor(cfg.hasPos, width);
  if (practice) columns[columns.length - 1].title = 'Перевод (впишите сами)';

  // header of the first page: logo, title, link to the page with audio and tests
  let y = doc.page.margins.top;
  if (logo) doc.image(logo, left, y, { width: 26, height: 26 });
  // a link needs an explicit width with lineBreak: false (pdfkit computes NaN otherwise)
  doc.font('bold').fontSize(14).fillColor(COLORS.text);
  doc.text('Chinese+', left + (logo ? 34 : 0), y + 4, {
    width: doc.widthOfString('Chinese+') + 2,
    lineBreak: false,
    link: SITE,
  });
  doc
    .font('regular')
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text('chineseplus.club', left, y + 8, { width, align: 'right', link: SITE });
  y += 42;
  doc.font('bold').fontSize(20).fillColor(COLORS.text).text(title, left, y, { width });
  y = doc.y + 4;
  const subtitle = practice
    ? `${count} · версия для самопроверки: впишите перевод, затем сверьтесь с полным списком`
    : `${count} · иероглифы, пиньинь и перевод на русский`;
  doc.font('regular').fontSize(10).fillColor(COLORS.muted).text(subtitle, left, y, { width });
  y = doc.y + 3;
  doc
    .fillColor(COLORS.muted)
    .text('Озвучка, тесты и карточки для этих слов: ', left, y, { continued: true })
    .fillColor(COLORS.accent)
    .text(pageUrlShort, { link: pageUrl, underline: true });
  y = doc.y + 14;

  const cellHeight = (col, value) => {
    const st = CELL_STYLE[col.key];
    return doc
      .font(st.font)
      .fontSize(st.size)
      .heightOfString(String(value || ' '), { width: col.width - CELL_PAD_X * 2 });
  };

  const drawHeaderRow = () => {
    let x = left;
    doc.font('bold').fontSize(8.5).fillColor(COLORS.muted);
    columns.forEach((col) => {
      doc.text(col.title, x + CELL_PAD_X, y, { width: col.width - CELL_PAD_X * 2, lineBreak: false });
      x += col.width;
    });
    y += 14;
    doc.moveTo(left, y).lineTo(left + width, y).lineWidth(0.8).strokeColor(COLORS.text).stroke();
    y += 2;
  };

  // at most two lines of translation: shortened at a word boundary until it fits
  const ruCol = columns[columns.length - 1];
  const twoLines = cellHeight(ruCol, 'а\nа') + 0.5;
  const fitTranslation = (text) => {
    let fitted = text;
    let n = text.length;
    while (n > 20 && cellHeight(ruCol, fitted) > twoLines) {
      n -= 4;
      fitted = cutText(text.replace(/…$/, ''), n);
    }
    return fitted;
  };

  drawHeaderRow();
  words.forEach((w, i) => {
    const row = { ...w, n: i + 1, ru: practice ? '' : fitTranslation(w.ru) };
    const height = Math.max(
      practice ? 26 : 22,
      ...columns.map((col) => cellHeight(col, row[col.key]) + CELL_PAD_Y * 2),
    );
    if (y + height > bottom()) {
      doc.addPage();
      y = doc.page.margins.top;
      drawHeaderRow();
    }

    let x = left;
    columns.forEach((col) => {
      const st = CELL_STYLE[col.key];
      const value = String(row[col.key] || '');
      const h = cellHeight(col, value);
      // vertically centered in the row
      doc
        .font(st.font)
        .fontSize(st.size)
        .fillColor(st.color)
        .text(value, x + CELL_PAD_X, y + (height - h) / 2, { width: col.width - CELL_PAD_X * 2 });
      x += col.width;
    });
    y += height;
    // one thin full-width rule under each row rather than shaded stripes (less ink when printed);
    // in the practice version it is also the line to write the translation on
    doc
      .moveTo(left, y)
      .lineTo(left + width, y)
      .lineWidth(practice ? 0.5 : 0.3)
      .strokeColor(COLORS.line)
      .stroke();
  });

  // footer on every page: where the list comes from and page numbers
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i += 1) {
    doc.switchToPage(i);
    const { margins } = doc.page;
    const savedBottom = margins.bottom;
    margins.bottom = 0; // writing below the bottom margin would otherwise add a page
    const fy = doc.page.height - savedBottom - 10;
    doc
      .font('regular')
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(`${title} · ${pageUrlShort}`, left, fy, { width, lineBreak: false, link: pageUrl });
    doc.text(`стр. ${i + 1} из ${range.count}`, left, fy, { width, align: 'right', lineBreak: false });
    margins.bottom = savedBottom;
  }

  doc.end();
  return done;
}

// ---------- main ----------

async function main() {
  for (const f of [FONT_REGULAR, FONT_BOLD]) {
    if (!fs.existsSync(f)) {
      throw new Error(
        `Font not found: ${f}. Download NotoSansSC-Regular.otf and NotoSansSC-Bold.otf from ` +
          'https://github.com/notofonts/noto-cjk/raw/main/Sans/SubsetOTF/SC/ into scripts/fonts/',
      );
    }
  }
  if (APPLY && !BUCKET) throw new Error('YA_S3_BUCKET is not set');
  if (ONLY_LIST && !LISTS[ONLY_LIST]) throw new Error(`--list must be one of ${Object.keys(LISTS)}`);
  if (!APPLY && !OUT_DIR) {
    console.log('Dry run: add --out=<dir> to write the files locally, --apply to upload them.');
  }
  if (OUT_DIR) fs.mkdirSync(OUT_DIR, { recursive: true });

  const logo = fs.existsSync(LOGO_SVG)
    ? await sharp(LOGO_SVG, { density: 600 }).resize(156, 156).png().toBuffer()
    : null;
  if (!logo) console.warn(`No logo at ${LOGO_SVG}, the PDFs go without it`);

  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  for (const [list, cfg] of Object.entries(LISTS)) {
    if (ONLY_LIST && list !== ONLY_LIST) continue;
    for (const lvl of cfg.levels) {
      if (ONLY_LEVEL && lvl !== ONLY_LEVEL) continue;
      const words = await loadWords(list, lvl);
      if (!words.length) {
        console.warn(`${list} ${lvl}: no words, skipped`);
        continue;
      }
      const noTranslation = words.filter((w) => !w.ru).length;

      for (const practice of [false, true]) {
        const key = hskPdfKey(list, lvl, practice);
        if (!APPLY && !OUT_DIR) {
          console.log(`${key}: ${words.length} words`);
          continue;
        }
        const pdf = await renderPdf({ list, lvl, words, practice, logo });
        if (OUT_DIR) fs.writeFileSync(path.join(OUT_DIR, path.basename(key)), pdf);
        if (APPLY) {
          await s3.send(
            new PutObjectCommand({
              Bucket: BUCKET,
              Key: key,
              Body: pdf,
              ContentType: 'application/pdf',
              ContentDisposition: `inline; filename="chineseplus-${path.basename(key)}"`,
              CacheControl: 'public, max-age=86400',
              ACL: 'public-read',
            }),
          );
        }
        console.log(
          `${key}: ${words.length} words, ${(pdf.length / 1024).toFixed(0)} KB` +
            `${APPLY ? ', uploaded' : ''}${!practice && noTranslation ? `, ${noTranslation} without translation` : ''}`,
        );
      }
    }
  }

  if (unknownPos.size) console.warn('Parts of speech without a russian name:', [...unknownPos]);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
