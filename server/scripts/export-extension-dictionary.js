/**
 * Exports the dictionary for the browser extension (../../extension/): words of 1-4 chinese
 * characters with their pinyin and parsed meanings (`dictionarytranslations.senses`), without
 * examples. The extension reads these files offline, nothing is requested from the site.
 *
 * Output (default: ../../extension/dict/, its *.json files are replaced):
 *   meta.json  { version, buckets, maxLen, words, trad }
 *   <n>.json   bucket n = (code point of the word's first character) % buckets:
 *     {
 *       w: { "<simplified>": [[pinyin, senses], ...] },  // several entries for homographs
 *       t: { "<traditional>": ["<simplified>", ...] },   // lookup by traditional form
 *       h: { "<simplified>": "1" | ... | "789" },        // lowest HSK 3.0 level, as on the site
 *     }
 *   A hover looks up at most 4 prefixes of the same first character, so it reads one bucket
 *   (plus the simplified word's bucket for a traditional form).
 *
 * `senses` is the parsed tree (src/api/services/dictionary/translations/parse-dsl.js) with
 * short keys, to keep the files small:
 *   Node    { k?: 'h' | 's' (homonym | section), m?: marker, p?: pinyin, l?: [label],
 *             t?: text (plain) | c?: [Inline] (with markup), s?: [Node] }
 *   Inline  "plain text" | [type, value], type: l label, m comment, r ref, p pinyin, e en, b strong
 *
 * Rare words are left out (most of the 1.4M words of 1-4 characters are rare compounds and
 * terms): a word of 2+ characters is kept only if the jieba word list (@node-rs/jieba's
 * jieba.dict.utf8, "word frequency tag" per line) has it with frequency >= --min-freq, or tags it
 * as an idiom (`i`, chengyu: kept whatever the frequency). Single characters and HSK words
 * (old HSK, HSK 2021, HSK 3.0 lists) are always kept.
 *
 * Usage:
 *   node scripts/export-extension-dictionary.js                 # writes ../extension/dict
 *   node scripts/export-extension-dictionary.js --min-freq=20   # fewer words, smaller files
 *   node scripts/export-extension-dictionary.js --all-words     # no frequency filter
 *   node scripts/export-extension-dictionary.js --max-len=4 --buckets=512 --out=/some/dir
 *   node scripts/export-extension-dictionary.js --limit=5000    # quick try on a part of the words
 */
const fs = require('fs');
const path = require('path');

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

const argValue = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.slice(name.length + 3) : undefined;
};
const MAX_LEN = Number(argValue('max-len') || 4);
const BUCKETS = Number(argValue('buckets') || 512);
const LIMIT = Number(argValue('limit') || 0);
const OUT_DIR = path.resolve(
  argValue('out') || path.join(__dirname, '..', '..', 'extension', 'dict'),
);
const ALL_WORDS = process.argv.includes('--all-words');
const MIN_FREQ = Number(argValue('min-freq') || 5);
const FREQ_LIST = path.join(__dirname, '..', 'node_modules/@node-rs/jieba/dict.txt');
const BATCH_SIZE = 2000;

// only chinese characters: the extension never looks up latin letters, digits or punctuation
const HAN_WORD_RE = new RegExp(`^\\p{Script=Han}{1,${MAX_LEN}}$`, 'u');

// HSK word lists: always exported (jieba misses some, e.g. 不客气, 打篮球)
const HSK_LISTS = [
  { collection: 'lexicons', field: 'chinese' }, // old HSK
  { collection: 'hskwords', field: 'cn' }, // HSK 2021
  { collection: 'hskword2025', field: 'cn' }, // HSK 3.0
];

const HSK3_LEVELS = ['1', '2', '3', '4', '5', '6', '789'];

/** { word: its lowest HSK 3.0 level }, like src/api/services/newhskwords/get-hsk-levels.js */
async function loadHskLevels(db) {
  const levels = new Map();
  const docs = await db
    .collection('hskword2025')
    .find({}, { projection: { cn: 1, lvl: 1 } })
    .toArray();
  for (const { cn, lvl } of docs) {
    const word = (cn || '').trim();
    if (!word || !HSK3_LEVELS.includes(lvl)) continue;
    const current = levels.get(word);
    if (!current || HSK3_LEVELS.indexOf(lvl) < HSK3_LEVELS.indexOf(current)) levels.set(word, lvl);
  }
  return levels;
}

/** Words of 2+ characters to export: jieba list + HSK words; null: all of them. */
async function loadCommonWords(db) {
  if (ALL_WORDS) return null;
  const words = new Set();
  for (const line of fs.readFileSync(FREQ_LIST, 'utf8').split('\n')) {
    const [word, freq, tag] = line.trim().split(/\s+/);
    if (word && (Number(freq) >= MIN_FREQ || tag === 'i')) words.add(word);
  }
  for (const { collection, field } of HSK_LISTS) {
    const docs = await db
      .collection(collection)
      .find({}, { projection: { [field]: 1 } })
      .toArray();
    docs.forEach((doc) => doc[field] && words.add(doc[field].trim()));
  }
  return words;
}

const INLINE_CODES = {
  label: 'l',
  comment: 'm',
  ref: 'r',
  pinyin: 'p',
  en: 'e',
  strong: 'b',
};
const KIND_CODES = { homonym: 'h', section: 's' };

const compactInline = ({ type, value }) =>
  INLINE_CODES[type] ? [INLINE_CODES[type], value] : value;

/** Senses with short keys; drops example counts, ids and empty nodes. */
function compactSenses(nodes) {
  const out = [];
  for (const node of nodes || []) {
    const c = {};
    if (KIND_CODES[node.kind]) c.k = KIND_CODES[node.kind];
    if (node.marker) c.m = node.marker;
    if (node.pinyin) c.p = node.pinyin;
    if (node.labels?.length) c.l = node.labels;
    if (node.content?.length) c.c = node.content.map(compactInline);
    else if (node.text) c.t = node.text;
    const children = compactSenses(node.senses);
    if (children.length) c.s = children;
    if (c.p || c.l || c.c || c.t || c.s) out.push(c);
  }
  return out;
}

// dictionary pinyin may start with a space: ' hǎo, hào'
const cleanPinyin = (pinyin) => (pinyin || '').replace(/\s+/g, ' ').trim();

const firstCodePoint = (word) => word.codePointAt(0);
const bucketOf = (word) => firstCodePoint(word) % BUCKETS;

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  const db = mongoose.connection.db;
  const translations = db.collection('dictionarytranslations');
  const dictionaries = db.collection('dictionaries');

  // bucket -> { w: Map<word, Map<serialized entry, true>>, t: Map<trad, Set<word>> }
  const buckets = Array.from({ length: BUCKETS }, () => ({ w: new Map(), t: new Map() }));
  const commonWords = await loadCommonWords(db);
  const hskLevels = await loadHskLevels(db);
  const isKept = (word) => !commonWords || [...word].length === 1 || commonWords.has(word);
  console.log(
    commonWords
      ? `Frequency filter: ${commonWords.size} words (jieba freq >= ${MIN_FREQ} or idiom, HSK)`
      : 'No frequency filter',
  );

  const stats = {
    read: 0,
    skippedNotHan: 0,
    skippedRare: 0,
    skippedNoSenses: 0,
    noDictEntry: 0,
    entries: 0,
  };

  const addBatch = async (batch) => {
    const words = await dictionaries
      .find(
        { _id: { $in: batch.map((t) => t.wordId) } },
        { projection: { chinese: 1, tradChinese: 1, pinyin: 1 } },
      )
      .toArray();
    const byId = new Map(words.map((w) => [String(w._id), w]));

    for (const tr of batch) {
      const word = byId.get(String(tr.wordId));
      if (!word) {
        stats.noDictEntry++;
        continue;
      }
      const senses = compactSenses(tr.senses);
      if (!senses.length) {
        stats.skippedNoSenses++;
        continue;
      }
      const chinese = word.chinese.trim();
      const bucket = buckets[bucketOf(chinese)];
      const entry = JSON.stringify([cleanPinyin(word.pinyin), senses]);
      if (!bucket.w.has(chinese)) bucket.w.set(chinese, new Map());
      bucket.w.get(chinese).set(entry, true);
      stats.entries++;

      const trad = (word.tradChinese || '').trim();
      if (trad && trad !== chinese && HAN_WORD_RE.test(trad)) {
        const tradBucket = buckets[bucketOf(trad)];
        if (!tradBucket.t.has(trad)) tradBucket.t.set(trad, new Set());
        tradBucket.t.get(trad).add(chinese);
      }
    }
  };

  const cursor = translations
    .find(
      { $expr: { $lte: [{ $strLenCP: { $ifNull: ['$chinese', ''] } }, MAX_LEN] } },
      { projection: { wordId: 1, chinese: 1, senses: 1 } },
    )
    .batchSize(BATCH_SIZE);

  let batch = [];
  for await (const tr of cursor) {
    stats.read++;
    const chinese = (tr.chinese || '').trim();
    if (!HAN_WORD_RE.test(chinese)) {
      stats.skippedNotHan++;
    } else if (!isKept(chinese)) {
      stats.skippedRare++;
    } else {
      batch.push(tr);
    }
    if (batch.length >= BATCH_SIZE) {
      await addBatch(batch);
      batch = [];
    }
    if (stats.read % 100000 === 0) console.log(`  ${stats.read} translations read`);
    if (LIMIT && stats.read >= LIMIT) break;
  }
  if (batch.length) await addBatch(batch);
  await cursor.close();

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (file.endsWith('.json')) fs.unlinkSync(path.join(OUT_DIR, file));
  }

  let words = 0;
  let trad = 0;
  let hsk = 0;
  let totalBytes = 0;
  let largest = { n: 0, bytes: 0 };
  buckets.forEach((bucket, n) => {
    const w = [...bucket.w].map(
      ([word, entries]) => `${JSON.stringify(word)}:[${[...entries.keys()].join(',')}]`,
    );
    // a traditional form that is also a simplified word is found through `w` already
    const t = [...bucket.t]
      .filter(([form]) => !bucket.w.has(form))
      .map(([form, simplified]) => `${JSON.stringify(form)}:${JSON.stringify([...simplified])}`);
    const h = [...bucket.w.keys()]
      .filter((word) => hskLevels.has(word))
      .map((word) => `${JSON.stringify(word)}:${JSON.stringify(hskLevels.get(word))}`);
    words += w.length;
    trad += t.length;
    hsk += h.length;
    const json = `{"w":{${w.join(',')}},"t":{${t.join(',')}},"h":{${h.join(',')}}}`;
    fs.writeFileSync(path.join(OUT_DIR, `${n}.json`), json);
    const bytes = Buffer.byteLength(json);
    totalBytes += bytes;
    if (bytes > largest.bytes) largest = { n, bytes };
  });

  const meta = {
    version: new Date().toISOString(),
    buckets: BUCKETS,
    maxLen: MAX_LEN,
    minFreq: commonWords ? MIN_FREQ : null,
    words,
    trad,
    hsk,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

  const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  console.log({ ...stats, words, trad, hsk });
  console.log(
    `Written to ${OUT_DIR}: ${BUCKETS} buckets, ${mb(totalBytes)} in total, ` +
      `largest ${largest.n}.json ${(largest.bytes / 1024).toFixed(0)} KB`,
  );
  return mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
