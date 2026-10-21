/**
 * Builds content/names/ru-names.json for the "Имя на китайском" pages (/names).
 *
 * Input (edit these, never ru-names.json itself):
 * - content/names/name-list.json  { m: [[name, [short forms]]], f: [...] }
 * - content/names/overrides.json  {
 *     names:    { "Вероника": [{ "cn": "维罗妮卡", "py": "wéiluónīkǎ" }] }  // replaces the variants
 *                                                   // found in the dictionary; py is optional
 *     meanings: { "娅": "..." }                // replaces a character's short meaning
 *   }
 * - content/names/char-meanings.json  { "亚": "Азия; второй" }: curated meanings of the characters
 *   used in names, the common meaning first; the dictionary's first meaning is only a fallback
 *   ("亚" -> "уступать, быть хуже") for characters missing here, which the script lists
 *
 * Variants come from the dictionary: the ru -> cn entry of the name (russianwords) gives the order,
 * and a variant is kept only if its cn -> ru entry (dictionaries) names it as a name ("имя"), so
 * "Лев" doesn't turn into 狮子. Pinyin and each character's short meaning come from the dictionary too.
 *
 * Output:
 * - content/names/ru-names.json     the data served by GET api/names
 * - content/names/missing-names.json names / short forms with no variant: add them to overrides.json
 *
 * scripts/add-names-to-dictionary.js puts the overrides into the dictionary as well.
 *
 * Usage:
 *   NODE_ENV=development node scripts/build-names.js
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
const mdbg = require('mdbg');
const { split: splitPinyin } = require('pinyin-split');
const { connectDB } = require('../src/mongo_db/db');
const Dictionary = require('../src/models/Dictionary');
const RussianWord = require('../src/models/RussianWord');

const NAMES_DIR = path.join(__dirname, '..', 'content', 'names');
const MAX_VARIANTS = 4;
const MAX_MEANING_LEN = 60;
const NAME_HANZI_RE = /^[㐀-鿿]{2,6}$/;
const HANZI_RUN_RE = /[㐀-鿿]{2,6}/g;
// characters nobody wants in their name: flagged on the page if a variant has one
const BAD_CHARS = [...'死病鬼猪屎尸丑恶穷苦杀毒狗蛆贱败亡哭呆傻蠢奴妓娼臭粪'];

const TRANSLIT = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

const slugify = (name) => [...name.toLowerCase()].map((c) => TRANSLIT[c] ?? c).join('');
const lower = (s) => s.toLowerCase().replace(/ё/g, 'е');

const readJson = (file, fallback) => {
  const p = path.join(NAMES_DIR, file);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback;
};

const writeJson = (file, data) =>
  fs.writeFileSync(path.join(NAMES_DIR, file), JSON.stringify(data, null, 2) + '\n');

/** "[m1]...[/m][m2]...[/m]" -> the lines of a BKRS-style entry, examples dropped */
function entryLines(markup) {
  return (markup || '')
    .split(/\[m\d\]/)
    .filter((line) => line.trim() && !line.includes('[ex]') && !line.includes('[*]'));
}

function cleanLine(line) {
  return line
    .replace(/\[b\][\s\S]*?\[\/b\]/g, '') // "I nà" headers, inline readings
    .replace(/\[p\][\s\S]*?\[\/p\]/g, '') // part-of-speech labels
    .replace(/\[c\][\s\S]*?\[\/c\]/g, '')
    .replace(/\[\/?[a-z]+\d?\]/g, '')
    .replace(/\\([[\]])/g, '$1')
    .replace(/^\s*(\d+\)\*?|[IVX]+|[А-Г])(\s|$)/, '') // "1)", "1)*", "I", "А"
    .replace(/^\s*\*\s*/, '') // "* скипетр": a literary meaning
    .replace(/\s+/g, ' ')
    .trim();
}

/** first real meaning of a character, e.g. 山 -> "гора; гористый" */
function shortMeaning(markup, byChinese, depth = 0) {
  for (const line of entryLines(markup)) {
    const ref = line.match(/см\.[\s\S]*?\[ref\]([^[]+)\[\/ref\]/);
    if (ref && depth === 0 && byChinese.has(ref[1])) {
      // 莉: "только в сочетании; см. 茉莉" -> the meaning of 茉莉
      const refMeaning = shortMeaning(byChinese.get(ref[1]).russian, byChinese, 1);
      if (refMeaning) return `${refMeaning} (в ${ref[1]})`;
    }
    // drop clarifications: "благодарить (кого-л., за что-л.)" -> "благодарить"
    const text = cleanLine(line)
      .replace(/\s*\([^()]*\)/g, '')
      .trim();
    if (!/[а-яё]{2,}/i.test(text) || /^(только в сочетании|примечание)/i.test(text)) continue;
    const parts = text
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean);
    let meaning = parts.slice(0, 2).join('; ');
    if (meaning.length > MAX_MEANING_LEN) meaning = parts[0];
    if (meaning.length > MAX_MEANING_LEN) meaning = meaning.slice(0, MAX_MEANING_LEN - 1) + '…';
    return meaning;
  }
  return '';
}

/** cn -> ru entries naming a person: { "денис": ["丹尼斯", "杰尼斯"] } */
function buildNameIndex(docs) {
  const index = new Map();
  for (const doc of docs) {
    if (!NAME_HANZI_RE.test(doc.chinese)) continue;
    for (const line of entryLines(doc.russian)) {
      const text = cleanLine(line);
      if (!/имя/.test(text)) continue;
      // "Александр, Александра (имя)" -> both names
      for (const name of text.split('(')[0].split(',')) {
        const key = lower(name.trim());
        if (!/^[а-я]+$/.test(key)) continue;
        if (!index.has(key)) index.set(key, []);
        if (!index.get(key).includes(doc.chinese)) index.get(key).push(doc.chinese);
      }
    }
  }
  return index;
}

async function mdbgPinyin(hanzi) {
  try {
    const entry = await mdbg.get(hanzi);
    const def = entry?.definitions && Object.values(entry.definitions)[0];
    return def?.pinyin ? def.pinyin.replace(/\s+/g, '') : '';
  } catch (e) {
    return '';
  }
}

async function run() {
  const list = readJson('name-list.json', { m: [], f: [] });
  const overrides = readJson('overrides.json', { names: {}, meanings: {} });
  const overrideNames = overrides.names || {};
  const overridePinyin = new Map(
    Object.values(overrideNames)
      .flat()
      .filter((v) => v.py)
      .map((v) => [v.cn, v.py]),
  );
  const overrideMeanings = overrides.meanings || {};
  const charMeanings = readJson('char-meanings.json', {});
  const uncurated = new Set();

  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);

  const people = [
    ...list.m.map(([name, short]) => ({ name, short, gender: 'm' })),
    ...list.f.map(([name, short]) => ({ name, short, gender: 'f' })),
  ];
  const allNames = [...new Set(people.flatMap((p) => [p.name, ...p.short]))];

  const nameIndex = buildNameIndex(
    await Dictionary.find({ russian: /имя/ }, 'chinese russian').lean(),
  );
  const ruWords = await RussianWord.find({ ru: { $in: allNames } })
    .collation(RussianWord.RU_COLLATION)
    .lean();
  const ruCnByName = new Map(ruWords.map((w) => [lower(w.ru), w.cn]));

  const variantsOf = (name) => {
    if (overrideNames[name]) return overrideNames[name].map((v) => v.cn);
    const named = nameIndex.get(lower(name)) || [];
    const fromRu = (cleanLine(ruCnByName.get(lower(name)) || '').match(HANZI_RUN_RE) || []).filter(
      (cn) => named.includes(cn),
    );
    return [...new Set([...fromRu, ...named])].slice(0, MAX_VARIANTS);
  };

  const variantsByName = new Map(allNames.map((name) => [name, variantsOf(name)]));
  const allVariants = [...new Set([...variantsByName.values()].flat())];
  const allChars = [...new Set(allVariants.flatMap((cn) => [...cn]))];

  const dictDocs = await Dictionary.find(
    { chinese: { $in: [...allVariants, ...allChars] } },
    'chinese pinyin russian',
  ).lean();
  const byChinese = new Map(dictDocs.map((d) => [d.chinese, d]));
  // "see 茉莉" references of the characters, for shortMeaning
  const refs = dictDocs
    .flatMap((d) => [...(d.russian || '').matchAll(/\[ref\]([^[]+)\[\/ref\]/g)].map((m) => m[1]))
    .filter((cn) => !byChinese.has(cn));
  for (const d of await Dictionary.find({ chinese: { $in: refs } }, 'chinese russian').lean()) {
    byChinese.set(d.chinese, d);
  }

  const dictMeaning = (ch) => {
    uncurated.add(ch);
    return shortMeaning(byChinese.get(ch)?.russian, byChinese);
  };

  const toVariant = async (cn, withChars) => {
    // "shāshā,sāsā" -> the first reading
    const dictPy = (byChinese.get(cn)?.pinyin || '').split(/[,;]/)[0].replace(/\s+/g, '');
    const py = overridePinyin.get(cn) || dictPy || (await mdbgPinyin(cn));
    const syllables = py ? splitPinyin(py) : [];
    const variant = { cn, py };
    const warn = [...cn].filter((ch) => BAD_CHARS.includes(ch));
    if (warn.length) variant.warn = warn;
    if (withChars) {
      variant.chars = await Promise.all(
        [...cn].map(async (ch, i) => ({
          ch,
          py: syllables.length === cn.length ? syllables[i] : await mdbgPinyin(ch),
          meaning: overrideMeanings[ch] ?? charMeanings[ch] ?? dictMeaning(ch),
        })),
      );
    }
    return variant;
  };

  const names = [];
  const missing = { names: [], short: [] };
  const fullSlugs = new Map(people.map((p) => [p.name, slugify(p.name)]));
  // short form -> the full names it belongs to ("Саша" -> Александр, Александра)
  const shortOf = new Map();
  for (const person of people) {
    const variants = variantsByName.get(person.name);
    if (!variants.length) {
      missing.names.push(person.name);
      continue;
    }
    const short = [];
    for (const shortName of person.short) {
      const shortVariants = variantsByName.get(shortName);
      if (!shortVariants.length) {
        missing.short.push(`${shortName} (${person.name})`);
        continue;
      }
      // a short form that is also a full name in the list ("Ян") links to that name's page
      const slug = fullSlugs.get(shortName) || slugify(shortName);
      short.push({
        name: shortName,
        slug,
        variants: await Promise.all(shortVariants.map((cn) => toVariant(cn, false))),
      });
      if (!fullSlugs.has(shortName)) {
        if (!shortOf.has(shortName)) shortOf.set(shortName, []);
        shortOf.get(shortName).push(person);
      }
    }
    names.push({
      kind: 'full',
      slug: slugify(person.name),
      name: person.name,
      gender: person.gender,
      variants: await Promise.all(variants.map((cn) => toVariant(cn, true))),
      short,
    });
  }

  // short forms get their own pages too: "Саша на китайском" is searched on its own
  for (const [shortName, fullNames] of shortOf) {
    const genders = [...new Set(fullNames.map((p) => p.gender))];
    names.push({
      kind: 'short',
      slug: slugify(shortName),
      name: shortName,
      gender: genders.length > 1 ? 'mf' : genders[0],
      of: fullNames.map((p) => ({ slug: fullSlugs.get(p.name), name: p.name })),
      variants: await Promise.all(variantsByName.get(shortName).map((cn) => toVariant(cn, true))),
      short: [],
    });
  }

  const slugs = names.map((n) => n.slug);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length) throw new Error(`duplicate slugs: ${dupes.join(', ')}`);

  names.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  writeJson('ru-names.json', names);
  writeJson('missing-names.json', missing);

  console.log(
    `${names.length} names written (${shortOf.size} short forms), missing: ${missing.names.length} names, ${missing.short.length} short forms`,
  );
  const withoutPinyin = names.flatMap((n) => n.variants).filter((v) => !v.py);
  if (withoutPinyin.length) console.log('no pinyin:', withoutPinyin.map((v) => v.cn).join(', '));
  if (uncurated.size) {
    console.log(`no curated meaning (add to char-meanings.json): ${[...uncurated].join(' ')}`);
  }
  const warned = names.filter((n) => n.variants.some((v) => v.warn));
  if (warned.length) console.log('bad characters in:', warned.map((n) => n.name).join(', '));
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
