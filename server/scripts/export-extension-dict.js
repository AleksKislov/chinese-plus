/**
 * Export a compact, offline dictionary for the browser extension (`extension/`).
 *
 * Takes short words (1..MAX_LEN Chinese characters) from the dictionary collection and
 * writes one line per entry, sorted by word:
 *
 *   chinese \t tradChinese (empty if same) \t pinyin \t short russian \t dictionary _id
 *
 * The russian field is BKRS markup reduced to plain text: examples dropped, meaning blocks
 * joined with "|", cut to about MAX_RU characters. The _id lets the extension add the word
 * to the user's vocabulary (POST /api/userwords/:wordId) without any lookup.
 *
 * Usage:
 *   NODE_ENV=development node scripts/export-extension-dict.js
 *   node scripts/export-extension-dict.js --max-len=2 --max-ru=150
 *   node scripts/export-extension-dict.js --out=/some/dir
 *   (default out: ../extension/src/data/)
 */
const path = require('path');
const fs = require('fs');

const arg = (name, def) => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.split('=')[1] : def;
};

const MAX_LEN = Number(arg('max-len', 3));
const MAX_RU = Number(arg('max-ru', 200));
const OUT_DIR = path.resolve(arg('out', path.join(__dirname, '..', '..', 'extension', 'src', 'data')));

const HAN_RE = /^\p{Script=Han}+$/u;
const MEANING_SEP = '|';

function cleanBlock(txt) {
  return txt
    .replace(/\[b\]\\\[o\\\]\d\[\/b\]/g, '')
    .replace(/\\\[(.+?)\\\]/g, '($1)')
    .replace(/\[ref\](.+?)\[\/ref\]/g, '$1')
    .replace(/\[[^\]]*\]/g, '')
    .replaceAll(MEANING_SEP, '/')
    .replace(/\s+/g, ' ')
    .trim();
}

/** BKRS markup -> "meaning 1|meaning 2|..." of at most about maxLen chars */
function shortRussian(russian, maxLen = MAX_RU) {
  if (!russian) return '';
  const noExamples = russian.replace(/\[\*\]\[ex\][\s\S]*?\[\/ex\]\[\/\*\]/g, '');
  const blocks = [...noExamples.matchAll(/\[m\d\]([\s\S]*?)\[\/m\]/g)].map((m) => m[1]);
  const meanings = (blocks.length ? blocks : [noExamples]).map(cleanBlock).filter(Boolean);

  const kept = [];
  let len = 0;
  for (const meaning of meanings) {
    if (kept.length && len + meaning.length > maxLen) break;
    kept.push(meaning.length > maxLen ? meaning.slice(0, maxLen - 1).trimEnd() + '…' : meaning);
    len += meaning.length + 1;
  }
  return kept.join(MEANING_SEP);
}

const oneLine = (str) => (str || '').replace(/[\t\r\n]+/g, ' ').trim();

function toLine(doc) {
  const trad = doc.tradChinese && doc.tradChinese !== doc.chinese ? doc.tradChinese : '';
  return [
    doc.chinese,
    HAN_RE.test(trad) ? trad : '',
    oneLine(doc.pinyin).replace(/\s*,\s*/g, ', '),
    shortRussian(oneLine(doc.russian)),
    String(doc._id),
  ].join('\t');
}

async function main() {
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
  const Dictionary = require('../src/models/Dictionary');

  await connectDB(
    process.env.MONGO_IN_CONTAINER ? process.env.CONTAINER_MONGO_DB : process.env.MONGO_DB,
  );

  const cursor = Dictionary.aggregate([
    { $match: { $expr: { $lte: [{ $strLenCP: { $ifNull: ['$chinese', ''] } }, MAX_LEN] } } },
    { $project: { chinese: 1, tradChinese: 1, pinyin: 1, russian: 1 } },
  ]).cursor({ batchSize: 2000 });

  const lines = [];
  let skipped = 0;
  for await (const doc of cursor) {
    const chinese = (doc.chinese || '').trim();
    if (!HAN_RE.test(chinese)) {
      skipped++;
      continue;
    }
    const line = toLine({ ...doc, chinese });
    if (!line.split('\t')[3]) {
      skipped++;
      continue;
    }
    lines.push(line);
  }
  await mongoose.disconnect();

  lines.sort();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const dictPath = path.join(OUT_DIR, 'dict.tsv');
  fs.writeFileSync(dictPath, lines.join('\n') + '\n');
  fs.writeFileSync(
    path.join(OUT_DIR, 'dict-meta.json'),
    JSON.stringify(
      { entries: lines.length, maxLen: MAX_LEN, maxRu: MAX_RU, date: new Date().toISOString() },
      null,
      2,
    ) + '\n',
  );

  const mb = (fs.statSync(dictPath).size / 1024 / 1024).toFixed(1);
  console.log(`Wrote ${lines.length} entries (${mb} MB) to ${dictPath}; skipped ${skipped}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { shortRussian, toLine };
