/**
 * Adds the names from content/names/overrides.json to the dictionary, so /dictionary finds them
 * both ways:
 * - cn -> ru (dictionaries): " [m1]Злата ([i]женское имя[/i])[/m]" with pinyin, if the word is missing
 * - ru -> cn (russianwords): "[m1]兹拉塔 zīlātǎ[/m]", if the capitalized name is missing
 *   ("майя" the people exists, so "Майя" the name is added next to it)
 *
 * Existing entries are never changed: ones that don't mention the name are only reported.
 * Run scripts/build-names.js afterwards, so the names pages pick up the dictionary pinyin.
 *
 * Usage:
 *   NODE_ENV=development node scripts/add-names-to-dictionary.js           # dry run, no writes
 *   NODE_ENV=development node scripts/add-names-to-dictionary.js --apply   # writes changes
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
const Dictionary = require('../src/models/Dictionary');
const RussianWord = require('../src/models/RussianWord');

const APPLY = process.argv.includes('--apply');
const NAMES_DIR = path.join(__dirname, '..', 'content', 'names');
const DIACRITICS_RE = /[̀-ͯ]/g;
// the dictionary (and CC-CEDICT) give archaic variants as their traditional form: 德 -> 惪, 塔 -> 墖
const SAME_IN_TRADITIONAL = new Set([...'德塔克捷法托']);

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(NAMES_DIR, file), 'utf8'));
const lower = (s) => s.toLowerCase().replace(/ё/g, 'е');
// same as cleanPinyin in backfill-pinyin.js
const stripDiacritics = (str) =>
  str.normalize('NFD').replace(DIACRITICS_RE, '').replace(/\s+/g, '').toLowerCase();

/** "Злата" -> "женское имя", "Вова" -> "имя, уменьшительное от Владимир" */
function nameLabels(list) {
  const labels = new Map();
  const shortOf = new Map();
  for (const [gender, people] of Object.entries(list)) {
    for (const [name, short] of people) {
      labels.set(name, gender === 'm' ? 'мужское имя' : 'женское имя');
      for (const s of short) shortOf.set(s, [...(shortOf.get(s) || []), name]);
    }
  }
  for (const [s, fullNames] of shortOf) {
    if (!labels.has(s)) labels.set(s, `имя, уменьшительное от ${fullNames.join(' и ')}`);
  }
  return labels;
}

async function run() {
  const overrides = readJson('overrides.json').names || {};
  const labels = nameLabels(readJson('name-list.json'));

  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  console.log(APPLY ? 'APPLYING' : 'DRY RUN');

  const variants = Object.values(overrides).flat();
  const allCn = [...new Set(variants.map((v) => v.cn))];
  const allChars = [...new Set(allCn.flatMap((cn) => [...cn]))];
  const docs = await Dictionary.find(
    { chinese: { $in: [...allCn, ...allChars] } },
    'chinese tradChinese russian',
  ).lean();
  const byChinese = new Map(docs.map((d) => [d.chinese, d]));
  const toTrad = (cn) =>
    [...cn]
      .map((ch) => {
        if (SAME_IN_TRADITIONAL.has(ch)) return ch;
        const trad = byChinese.get(ch)?.tradChinese;
        return trad && [...trad].length === 1 ? trad : ch;
      })
      .join('');

  const ruWords = await RussianWord.find({ ru: { $in: Object.keys(overrides) } }).lean();
  const ruByName = new Map(ruWords.map((w) => [w.ru, w]));

  const newDict = [];
  const newRu = [];
  const report = [];

  for (const [name, nameVariants] of Object.entries(overrides)) {
    const label = labels.get(name);
    if (!label) {
      report.push(`${name}: not in name-list.json, skipped`);
      continue;
    }

    for (const { cn, py } of nameVariants) {
      const existing = byChinese.get(cn);
      if (existing) {
        if (!lower(existing.russian || '').includes(lower(name))) {
          report.push(
            `${name}: ${cn} exists with another meaning: ${existing.russian.slice(0, 80)}`,
          );
        }
        continue;
      }
      if (!py) {
        report.push(`${name}: ${cn} has no pinyin in overrides.json, skipped`);
        continue;
      }
      newDict.push({
        chinese: cn,
        tradChinese: toTrad(cn),
        pinyin: py,
        cleanPinyin: stripDiacritics(py),
        russian: ` [m1]${name} ([i]${label}[/i])[/m]`,
      });
      byChinese.set(cn, newDict[newDict.length - 1]);
    }

    const ruWord = ruByName.get(name);
    if (ruWord) {
      const absent = nameVariants.filter((v) => !ruWord.cn.includes(v.cn));
      if (absent.length) {
        report.push(`${name}: russianwords has "${ruWord.cn}", without ${absent.map((v) => v.cn)}`);
      }
      continue;
    }
    newRu.push({
      ru: name,
      cn: `[m1]${nameVariants.map((v) => (v.py ? `${v.cn} ${v.py}` : v.cn)).join(', ')}[/m]`,
    });
  }

  console.log(`\ndictionaries (cn -> ru), ${newDict.length} new:`);
  newDict.forEach((d) => console.log(`  ${d.chinese} ${d.tradChinese} ${d.pinyin}${d.russian}`));
  console.log(`\nrussianwords (ru -> cn), ${newRu.length} new:`);
  newRu.forEach((w) => console.log(`  ${w.ru}: ${w.cn}`));
  if (report.length) console.log(`\nleft as is:\n  ${report.join('\n  ')}`);

  if (APPLY) {
    if (newDict.length) await Dictionary.insertMany(newDict);
    if (newRu.length) await RussianWord.insertMany(newRu);
    console.log(`\ninserted ${newDict.length} dictionary words, ${newRu.length} russian words`);
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
