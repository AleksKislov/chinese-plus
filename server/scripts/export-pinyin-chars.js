/**
 * Exports example characters for the pinyin chart (/start/pinyin-chart/): for every toned syllable
 * of the chart (the inner keys of `pinyinMap` in qwik/src/misc/consts/pinyin.ts, e.g. 'mǎ'), the
 * most common character read that way, with a short Russian gloss.
 *
 * Characters, in this order of preference:
 *   1. single-character words of the HSK lists, by level: HSK 3.0 (hskword2025), then HSK 2021
 *      (hskwords); the 2021 `py` often holds the dictionary's whole list of readings
 *      ('hǎo; hào', with markup), such entries are skipped;
 *   2. characters of multi-character HSK 3.0 words, by the word's level, with the reading the word
 *      gives them (否 only appears in 否则 fǒuzé, 否认 and so on);
 *   3. other characters with jieba frequency >= --min-freq (@node-rs/jieba's dict.txt), with
 *      the first reading of their dictionary entry; shown only if they get a gloss;
 *   4. any single character of the dictionary, with its first reading, if jieba has it or at least
 *      MIN_DICT_WORDS dictionary words contain it; shown only if it gets a gloss.
 * Above this order: a character is used for its main reading (the first reading of its dictionary
 * entries) before any character for a secondary one, so 看 (kàn; kān) is not an example of kān
 * while 刊 is. Ties are broken by the jieba frequency, then by how many dictionary words of 2-4
 * characters contain the character. HSK entries are matched by the list's own reading, so a
 * polyphone like 好 goes to hǎo and to hào. Neutral-tone readings are left out (的 de, 吗 ma),
 * except "me" (么), the only one the chart has.
 *
 * Gloss: the curated translation of the old HSK list (`lexicons`) when it has the character with
 * the same reading, else the first meaning of the dictionary entry (`dictionarytranslations`)
 * without its comments and labels. For a reading other than the entry's first one, only a homonym
 * marked with that pinyin is used (homonyms of other readings are often unmarked), else the gloss
 * is empty.
 *
 * Output (default: ../qwik/src/misc/consts/pinyin-chars.ts, replaced):
 *   { 'mǎ': ['马', 'лошадь'], ... }
 * Review it after a run: glosses are cut automatically and a few may read oddly.
 *
 * Usage:
 *   NODE_ENV=development node scripts/export-pinyin-chars.js
 *   node scripts/export-pinyin-chars.js --min-freq=2000 --out=/some/file.ts
 *   node scripts/export-pinyin-chars.js --explain=kān   # also prints how kān's candidates rank
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
const { normPinyin, readingsOf, shortGloss, dictionaryGloss } = require('./lib/glosses');

const argValue = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.slice(name.length + 3) : undefined;
};
// --explain=pài prints the ranked candidates of a syllable
const EXPLAIN = (argValue('explain') || '').toLowerCase().normalize('NFC');
const CANDIDATES = 5; // best characters per syllable whose glosses are looked up
const MIN_FREQ = Number(argValue('min-freq') || 1000);
const QWIK_CONSTS = path.join(__dirname, '..', '..', 'qwik', 'src', 'misc', 'consts');
const PINYIN_TS = path.join(QWIK_CONSTS, 'pinyin.ts');
const OUT_FILE = path.resolve(argValue('out') || path.join(QWIK_CONSTS, 'pinyin-chars.ts'));
const FREQ_LIST = path.join(__dirname, '..', 'node_modules/@node-rs/jieba/dict.txt');

const HSK_LEVELS = ['1', '2', '3', '4', '5', '6', '789'];
const HSK_LISTS = ['hskword2025', 'hskwords'];
// first item of a candidate's rank: where the character comes from (see the order above)
const TIER_HSK_CHAR = 0;
const TIER_HSK_WORD = 1;
const TIER_FREQ = 2;
const TIER_DICT = 3;
// a character of the dictionary not in the jieba list is an example only if this many words have it
const MIN_DICT_WORDS = 3;
// their tone changes inside words (不对 búduì, 一个 yígè): not examples of bú, yí
const SANDHI_CHARS = ['一', '不'];

// Glosses fixed by hand after a review: '<character> <reading>' -> gloss ('' hides a wrong one)
const GLOSS_OVERRIDES = {
  '率 lǜ': 'коэффициент, доля', // the dictionary has an unmarked shuài homonym first
  '刊 kān': 'журнал, издание', // the dictionary starts with the old meaning "вырезать"
  '航 háng': 'плыть, лететь', // and "плоскодонное судно"
  '么 me': 'частица: 什么, 怎么', // the dictionary starts with "чмок"
};

// Characters removed by hand after a review: never used as examples
const EXCLUDED_CHARS = [
  '紑', // fóu: too rare
  '芣', // fóu: the next one, just as rare
];

const SINGLE_HAN_RE = /^\p{Script=Han}$/u;
const TONE_MARK_RE = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
const SYLLABLE_RE = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$/;

/**
 * Toned syllables of the chart: { normalized: as written in pinyin.ts }, how many have audio,
 * and every syllable spelling (toned and toneless) for splitting the pinyin of words.
 */
function loadChartSyllables() {
  const src = fs.readFileSync(PINYIN_TS, 'utf8');
  const start = src.indexOf('const pinyinMap');
  const mapSrc = src.slice(start, src.indexOf('\n};', start));
  const syllables = new Map();
  const spellings = new Set(['r']); // erhua: 一点儿 yìdiǎnr
  let withAudio = 0;
  for (const [, key, audio] of mapSrc.matchAll(/^ {4}'?([^\s':]+)'?: '([^']*)',$/gm)) {
    syllables.set(normPinyin(key), key);
    spellings.add(normPinyin(key));
    if (audio) withAudio++;
  }
  for (const [, base] of mapSrc.matchAll(/^ {2}'?([^\s':]+)'?: \{$/gm))
    spellings.add(normPinyin(base));
  return { syllables, spellings, withAudio };
}

/**
 * Splits the pinyin of a word into `count` syllables: 'fǒuzé' -> ['fǒu', 'zé'], null if it
 * can't. Spaces and apostrophes are syllable boundaries ('yǔ fǒu', "xī'ān").
 */
function splitSyllables(py, count, spellings) {
  const chunks = normPinyin(py)
    .split(/[\s'’\-·]+/)
    .filter(Boolean);
  // all splits of a chunk into known syllables (a few at most); inside a chunk a syllable can't
  // start with a, o, e (pinyin puts an apostrophe there): 大脑 dànǎo is dà-nǎo, not dàn-ǎo
  const splitsOf = (chunk, first) => {
    if (!chunk) return [[]];
    if (!first && /^[aāáǎàoōóǒòeēéěè]/.test(chunk)) return [];
    const out = [];
    for (let len = Math.min(6, chunk.length); len > 0 && out.length < 8; len--) {
      const head = chunk.slice(0, len);
      if (!spellings.has(head)) continue;
      for (const rest of splitsOf(chunk.slice(len), false)) out.push([head, ...rest]);
    }
    return out;
  };
  let combos = [[]];
  for (const chunk of chunks) {
    const splits = splitsOf(chunk, true);
    combos = combos.flatMap((c) => splits.map((s) => [...c, ...s])).slice(0, 64);
  }
  return combos.find((c) => c.length === count) || null;
}

/**
 * { character: jieba frequency }, and the characters jieba uses as words (not tagged as a
 * morpheme `g`/`zg` or unknown `x`: rare characters like 嶅 or 鏄 get high counts with these tags).
 */
function loadFrequencies() {
  const freq = new Map();
  const words = new Set();
  for (const line of fs.readFileSync(FREQ_LIST, 'utf8').split('\n')) {
    const [word, count, tag] = line.trim().split(/\s+/);
    if (!word || !SINGLE_HAN_RE.test(word)) continue;
    freq.set(word, Number(count) || 0);
    if (!['g', 'zg', 'x'].includes(tag)) words.add(word);
  }
  return { freq, words };
}

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  const db = mongoose.connection.db;
  const dictionaries = db.collection('dictionaries');

  const { syllables, spellings, withAudio } = loadChartSyllables();
  const { freq, words } = loadFrequencies();
  console.log(`Chart: ${syllables.size} toned syllables, jieba: ${freq.size} characters`);

  // syllable -> Map<char, { rank: [tier, level, source, -freq], reading, dictId }>
  const candidates = new Map();
  const unmatched = new Set();
  const hskReadings = new Map(); // char -> readings of it as a single-character HSK word
  const addCandidate = (cn, reading, rank, dictId) => {
    if (EXCLUDED_CHARS.includes(cn)) return;
    const syllable = syllables.get(reading);
    if (!syllable) {
      // neutral tones are in the chart only as "me" (么); the others are skipped quietly
      if (TONE_MARK_RE.test(reading)) unmatched.add(`${cn} ${reading}`);
      return;
    }
    const chars = candidates.get(syllable) || new Map();
    const current = chars.get(cn);
    if (!current || compareRanks(rank, current.rank) < 0) chars.set(cn, { rank, reading, dictId });
    candidates.set(syllable, chars);
  };

  for (const [source, collection] of HSK_LISTS.entries()) {
    const docs = await db
      .collection(collection)
      .find({ cn: /^\p{Script=Han}$/u }, { projection: { cn: 1, py: 1, lvl: 1, dictId: 1 } })
      .toArray();
    for (const { cn, py, lvl, dictId } of docs) {
      const level = HSK_LEVELS.indexOf(String(lvl));
      const rank = [
        TIER_HSK_CHAR,
        level < 0 ? HSK_LEVELS.length : level,
        source,
        -(freq.get(cn) || 0),
      ];
      // HSK 3.0 has one reading or two variants ('shú/shóu'); lists of readings are skipped
      for (const reading of normPinyin(py).split('/')) {
        if (!SYLLABLE_RE.test(reading)) continue;
        // main readings from HSK 3.0 only: HSK 2021 pinyin was copied from the dictionary (派 pā)
        if (source === 0) hskReadings.set(cn, (hskReadings.get(cn) || new Set()).add(reading));
        addCandidate(cn, reading, rank, dictId);
      }
    }
  }

  // characters of HSK 3.0 words, with the reading the word gives them
  const hskWords = await db
    .collection('hskword2025')
    .find({ cn: /^\p{Script=Han}{2,}$/u }, { projection: { cn: 1, py: 1, lvl: 1 } })
    .toArray();
  // readings of their characters in the dictionary: a split is checked against them
  // (感恩 is 'gǎnēn' in the list, without the apostrophe, and splits as gǎ-nēn)
  const wordChars = [...new Set(hskWords.flatMap((w) => [...w.cn]))];
  const charReadings = new Map();
  const wordCharEntries = await dictionaries
    .find({ chinese: { $in: wordChars } }, { projection: { chinese: 1, pinyin: 1 } })
    .toArray();
  for (const e of wordCharEntries) {
    const set = charReadings.get(e.chinese) || new Set();
    readingsOf(e.pinyin).forEach((r) => set.add(r));
    charReadings.set(e.chinese, set);
  }
  let unsplit = 0;
  let wrongReading = 0;
  for (const { cn: word, py, lvl } of hskWords) {
    const chars = [...word];
    const readings = splitSyllables(py.split('/')[0], chars.length, spellings);
    if (!readings) {
      unsplit++;
      continue;
    }
    const level = HSK_LEVELS.indexOf(String(lvl));
    chars.forEach((cn, i) => {
      if (SANDHI_CHARS.includes(cn)) return;
      if (TONE_MARK_RE.test(readings[i]) && !charReadings.get(cn)?.has(readings[i])) {
        wrongReading++;
        return;
      }
      addCandidate(cn, readings[i], [
        TIER_HSK_WORD,
        level < 0 ? HSK_LEVELS.length : level,
        0,
        -(freq.get(cn) || 0),
      ]);
    });
  }
  console.log(
    `HSK 3.0 words: ${hskWords.length}, pinyin not split: ${unsplit}, readings not in the dictionary: ${wrongReading}`,
  );

  // other frequent characters, with their first reading
  const frequent = [...words].filter((cn) => freq.get(cn) >= MIN_FREQ);
  const frequentEntries = await dictionaries
    .find({ chinese: { $in: frequent } }, { projection: { chinese: 1, pinyin: 1 } })
    .toArray();
  for (const entry of frequentEntries) {
    const [reading] = readingsOf(entry.pinyin);
    if (SYLLABLE_RE.test(reading || '')) {
      addCandidate(entry.chinese, reading, [TIER_FREQ, 0, 0, -freq.get(entry.chinese)], entry._id);
    }
  }

  // every single character of the dictionary: main readings, and the last fallback
  const { mainReadings, wordCounts } = await loadDictionaryCharacters(dictionaries);
  for (const [cn, { reading, dictId }] of mainReadings.firstEntry) {
    const words = wordCounts.get(cn) || 0;
    if (!freq.get(cn) && words < MIN_DICT_WORDS) continue; // too rare to be an example
    if (SYLLABLE_RE.test(reading))
      addCandidate(cn, reading, [TIER_DICT, 0, 0, -(freq.get(cn) || 0)], dictId);
  }

  // main readings of a character: the first readings of its dictionary entries, narrowed by its
  // HSK readings when they share some (派 has an entry starting with pā, HSK has it as pài)
  const isMainReading = (cn, reading) => {
    const dict = mainReadings.of(cn);
    const hsk = hskReadings.get(cn);
    const both = dict && hsk ? [...dict].filter((r) => hsk.has(r)) : [];
    // no common reading: trust HSK (the dictionary has 派 only as pā)
    const main = both.length ? both : [...(hsk || dict || [reading])];
    return main.includes(reading);
  };
  // the best characters per syllable: the main reading of a character first (看 is kàn: kān
  // gets 刊), then by the rank, then by how many dictionary words have the character
  const sortKey = (cn, { rank, reading }) => [
    isMainReading(cn, reading) ? 0 : 1,
    ...rank,
    -(wordCounts.get(cn) || 0),
  ];
  const picked = new Map();
  for (const [syllable, chars] of candidates) {
    const sorted = [...chars.entries()].sort(([cnA, a], [cnB, b]) =>
      compareRanks(sortKey(cnA, a), sortKey(cnB, b)),
    );
    if (EXPLAIN === syllable) {
      console.log(`Candidates for ${syllable}: [secondary, tier, level, list, -freq, -words]`);
      sorted
        .slice(0, 15)
        .forEach(([cn, c]) => console.log(`  ${cn} ${JSON.stringify(sortKey(cn, c))}`));
    }
    picked.set(
      syllable,
      sorted.slice(0, CANDIDATES).map(([cn, info]) => ({ cn, ...info })),
    );
  }

  // glosses
  const pickedChars = [...picked.values()].flat();
  // characters taken from words: the dictionary entry with their reading, the first one preferred
  const withoutEntry = pickedChars.filter((c) => !c.dictId);
  const charEntries = await dictionaries
    .find(
      { chinese: { $in: [...new Set(withoutEntry.map((c) => c.cn))] } },
      { projection: { chinese: 1, pinyin: 1 } },
    )
    .toArray();
  for (const c of withoutEntry) {
    const own = charEntries.filter((e) => e.chinese === c.cn);
    const entry =
      own.find((e) => readingsOf(e.pinyin)[0] === c.reading) ||
      own.find((e) => readingsOf(e.pinyin).includes(c.reading));
    c.dictId = entry?._id;
  }
  const dictIds = pickedChars.map((c) => c.dictId).filter(Boolean);
  const [lexicons, entries, translations] = await Promise.all([
    db
      .collection('lexicons')
      .find(
        { chinese: { $in: pickedChars.map((c) => c.cn) } },
        { projection: { chinese: 1, pinyin: 1, translation: 1 } },
      )
      .toArray(),
    dictionaries.find({ _id: { $in: dictIds } }, { projection: { pinyin: 1 } }).toArray(),
    db
      .collection('dictionarytranslations')
      .find({ wordId: { $in: dictIds }, lang: 'ru' }, { projection: { wordId: 1, senses: 1 } })
      .toArray(),
  ]);
  const lexiconGloss = new Map(
    lexicons.map((l) => [`${l.chinese} ${normPinyin(l.pinyin)}`, shortGloss(l.translation)]),
  );
  const pinyinById = new Map(entries.map((e) => [String(e._id), e.pinyin]));
  const sensesById = new Map(translations.map((t) => [String(t.wordId), t.senses]));
  const glossOf = ({ cn, reading, dictId }) =>
    GLOSS_OVERRIDES[`${cn} ${reading}`] ??
    (lexiconGloss.get(`${cn} ${reading}`) ||
      (dictId
        ? dictionaryGloss(reading, pinyinById.get(String(dictId)), sensesById.get(String(dictId)))
        : ''));

  const out = {};
  const noGloss = [];
  for (const syllable of syllables.values()) {
    const chars = picked.get(syllable);
    if (!chars) continue;
    const best = chars
      .map((c) => ({ ...c, gloss: glossOf(c) }))
      // a character taken from the frequency list or the dictionary is shown only with a meaning
      .find((c) => c.gloss || c.rank[0] < TIER_FREQ);
    if (!best) continue;
    if (!best.gloss) noGloss.push(`${best.cn} ${best.reading}`);
    out[syllable] = [best.cn, best.gloss];
  }

  const lines = Object.entries(out).map(
    ([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`,
  );
  fs.writeFileSync(
    OUT_FILE,
    [
      '// Generated by server/scripts/export-pinyin-chars.js, do not edit by hand.',
      '// Toned syllable of the pinyin chart -> a common character read that way: [character, gloss].',
      '// prettier-ignore',
      'const pinyinChars: { [syllable: string]: [string, string] } = {',
      ...lines,
      '};',
      '',
      'export default pinyinChars;',
      '',
    ].join('\n'),
  );

  console.log(`Written ${OUT_FILE}`);
  console.log(
    `Syllables with characters: ${Object.keys(out).length} of ${
      syllables.size
    } (${withAudio} have audio)`,
  );
  console.log(`Without a gloss (${noGloss.length}): ${noGloss.join(', ')}`);
  console.log(`Readings not in the chart (${unmatched.size}): ${[...unmatched].join(', ')}`);
  await mongoose.disconnect();
}

/**
 * Reads the whole dictionary once:
 *   mainReadings.of(char): Set of the first readings of its entries (看 'kàn; kān' -> {kàn}),
 *     undefined if the dictionary has no such character;
 *   mainReadings.firstEntry: char -> { reading, dictId } of its first entry;
 *   wordCounts: char -> how many words of 2-4 characters have it (a popularity measure).
 */
async function loadDictionaryCharacters(dictionaries) {
  const main = new Map();
  const firstEntry = new Map();
  const wordCounts = new Map();
  const cursor = dictionaries.find({}, { projection: { chinese: 1, pinyin: 1 } }).batchSize(20000);
  for await (const { _id, chinese, pinyin } of cursor) {
    const chars = [...(chinese || '')];
    if (chars.length === 1) {
      if (!SINGLE_HAN_RE.test(chinese)) continue;
      const [reading] = readingsOf(pinyin);
      if (!reading) continue;
      main.set(chinese, (main.get(chinese) || new Set()).add(reading));
      if (!firstEntry.has(chinese)) firstEntry.set(chinese, { reading, dictId: _id });
    } else if (chars.length <= 4) {
      new Set(chars).forEach((c) => wordCounts.set(c, (wordCounts.get(c) || 0) + 1));
    }
  }
  return { mainReadings: { of: (cn) => main.get(cn), firstEntry }, wordCounts };
}

function compareRanks(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
