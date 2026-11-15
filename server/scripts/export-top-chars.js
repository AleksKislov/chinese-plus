/**
 * Exports the most frequent Chinese characters for /start/top-characters/: rank, character,
 * reading, short Russian gloss, the first HSK 3.0 level with it, and how much of a text the
 * characters up to this one cover.
 *
 * Frequencies: Jun Da's Modern Chinese character frequency list, top 1000, stored in
 * scripts/data/junda-char-freq.tsv (rank, character, cumulative frequency in %, pinyin).
 *
 * Reading, in this order of preference:
 *   1. the character as a single-character word of HSK 3.0 (hskword2025), first variant;
 *   2. the same in HSK 2021 (hskwords), if its pinyin is one plain syllable;
 *   3. the first reading of the character's first dictionary entry.
 * The script prints the characters whose reading came from the dictionary and differs from Jun
 * Da's first reading: check them, fix with READING_OVERRIDES.
 *
 * Gloss: the curated translation of the old HSK list (`lexicons`) with the same reading, else the
 * first meaning of the dictionary entry with that reading (readingGloss in lib/glosses.js), else GLOSS_OVERRIDES.
 *
 * HSK level: the lowest level of the HSK 3.0 words having the character ('' if none).
 *
 * Output (default: ../qwik/src/misc/consts/top-chars.ts, replaced):
 *   [['的', 'de', 'притяжательная частица', '1', 4.09], ...]
 *
 * Usage:
 *   NODE_ENV=development node scripts/export-top-chars.js
 *   node scripts/export-top-chars.js --out=/some/file.ts
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
const { normPinyin, readingsOf, shortGloss, readingGloss } = require('./lib/glosses');

const argValue = (name) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.slice(name.length + 3) : undefined;
};
const MAX_GLOSS = 32;
const FREQ_LIST = path.join(__dirname, 'data', 'junda-char-freq.tsv');
const OUT_FILE = path.resolve(
  argValue('out') ||
    path.join(__dirname, '..', '..', 'qwik', 'src', 'misc', 'consts', 'top-chars.ts'),
);
const HSK_LEVELS = ['1', '2', '3', '4', '5', '6', '789'];
const SYLLABLE_RE = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$/;

// Fixed by hand after a review: character -> its most common reading
const READING_OVERRIDES = {
  只: 'zhǐ', // 只 zhī (counter) is in HSK, 只 zhǐ "only" is far more common
  重: 'zhòng',
  应: 'yīng',
  什: 'shén',
  处: 'chù',
  系: 'xì',
  校: 'xiào',
  待: 'dài',
  血: 'xuè',
  背: 'bèi',
  露: 'lù',
  散: 'sàn',
  划: 'huà',
  勒: 'lè',
  量: 'liàng',
};
// Fixed by hand after a review: character -> gloss (the generated one is wrong, too narrow or
// an old meaning)
const GLOSS_OVERRIDES = {
  了: 'частица завершённости',
  个: 'штука; счётное слово',
  们: 'суффикс множественного числа',
  对: 'правильный; к, по отношению к',
  子: 'сын; суффикс существительных',
  得: 'частица результата и степени',
  着: 'частица длительности',
  后: 'после, сзади',
  然: 'так, таким образом',
  经: 'проходить через; канон',
  成: 'становиться; завершать',
  方: 'сторона; квадрат',
  么: 'суффикс: 什么, 怎么',
  没: 'не, нет; не иметь',
  定: 'устанавливать; определённо',
  其: 'его, их; тот',
  样: 'вид, образец',
  本: 'корень; основной',
  前: 'перед, впереди',
  只: 'только, лишь',
  实: 'реальный, действительный',
  军: 'армия, войско',
  无: 'не иметь, без',
  把: 'держать; предлог 把',
  机: 'машина, механизм',
  第: 'префикс порядковых числ.',
  公: 'общественный, публичный',
  此: 'этот, это',
  已: 'уже',
  明: 'светлый, ясный',
  将: 'будет; собираться',
  点: 'точка; немного',
  间: 'промежуток, между',
  重: 'тяжёлый; важный',
  并: 'и, к тому же; совсем',
  应: 'следует, должен',
  文: 'письменность, текст',
  政: 'политика, управление',
  被: 'служебное слово пассива',
  什: 'что (什么)',
  二: '2, два',
  或: 'или',
  制: 'система; производить',
  合: 'соединять; закрывать',
  特: 'особый, специальный',
  表: 'выражать; таблица',
  世: 'мир; поколение',
  员: 'сотрудник, член',
  原: 'изначальный, исходный',
  及: 'достигать; и',
  解: 'развязывать, решать',
  真: 'настоящий; правда',
  处: 'место; отдел',
  认: 'узнавать, признавать',
  条: 'полоса; счётное слово',
  系: 'система; связь',
  气: 'воздух, газ',
  总: 'всегда; общий',
  何: 'что, какой (книжн.)',
  才: 'только что, лишь',
  必: 'непременно, обязательно',
  市: 'рынок; город',
  命: 'жизнь, судьба',
  金: 'золото',
  克: 'справиться; грамм',
  决: 'решать',
  科: 'отрасль, наука',
  则: 'правило; тогда',
  即: 'то есть; сразу',
  且: 'к тому же; пока',
  权: 'власть, право',
  告: 'сообщать',
  程: 'путь, порядок',
  交: 'передавать, сдавать',
  规: 'правило',
  万: '10 000, десять тысяч',
  格: 'клетка, рамка; стиль',
  领: 'вести, руководить',
  亲: 'родной, близкий',
  往: 'в направлении, к',
  英: 'выдающийся; Англия',
  准: 'точный; разрешать',
  台: 'платформа, сцена',
  单: 'один; список',
  具: 'орудие, инструмент',
  罗: 'сеть; (в транскрипциях)',
  调: 'перемещать; мелодия',
  质: 'качество, свойство',
  华: 'великолепный; Китай',
  城: 'город',
  府: 'резиденция, учреждение',
  亚: 'второй; Азия',
  际: 'граница; между',
  约: 'договариваться; около',
  复: 'повторять, снова',
  精: 'отборный, тонкий',
  支: 'поддерживать; счётное слово',
  须: 'должен, необходимо',
  研: 'исследовать',
  企: 'предприятие; надеяться',
  片: 'кусок, ломтик',
  易: 'лёгкий; менять',
  曾: 'некогда, когда-то',
  装: 'наряжать; устанавливать',
  李: 'слива; фамилия Ли',
  标: 'знак, метка',
  念: 'думать; читать вслух',
  历: 'проходить; история',
  号: 'номер, число',
  较: 'сравнительно, более',
  注: 'вливать; примечание',
  考: 'экзамен; проверять',
  青: 'сине-зелёный; молодой',
  节: 'праздник; сустав',
  案: 'дело, судебное дело',
  维: 'поддерживать',
  革: 'кожа; изменять',
  划: 'черта; планировать',
  陈: 'расставлять; фамилия Чэнь',
  态: 'состояние, форма',
  兴: 'процветать',
  营: 'лагерь; управлять',
  巴: 'прилипать; (в транскрипциях)',
  效: 'эффект; подражать',
  紧: 'тугой; срочный',
  段: 'отрезок, часть',
  群: 'группа, толпа',
  项: 'пункт, статья',
  纪: 'дисциплина; летопись',
  苏: 'оживать; Сучжоу',
  止: 'останавливать',
  刻: 'вырезать; четверть часа',
  率: 'коэффициент, доля',
  甚: 'очень, весьма',
  般: 'вид, сорт',
  弹: 'играть на струнных',
  校: 'школа',
  承: 'принимать, нести',
  股: 'доля, акция; бедро',
  若: 'если; как будто',
  血: 'кровь',
  素: 'простой; белый',
  省: 'провинция; экономить',
  险: 'опасность',
  待: 'ждать; обращаться',
  习: 'учиться, упражняться',
  纳: 'принимать, вносить',
  冲: 'бросаться; промывать',
  略: 'кратко, немного',
  范: 'образец, рамки',
  竟: 'неожиданно, всё-таки',
  策: 'план, стратегия',
  演: 'играть роль, выступать',
  简: 'простой, краткий',
  担: 'нести; брать на себя',
  宗: 'род, предок',
  灵: 'душа; ловкий',
  审: 'рассматривать, проверять',
  超: 'превосходить',
  伊: 'он, она; (в транскрипциях)',
  怀: 'грудь; лелеять',
  航: 'плыть, лететь',
  著: 'выдающийся; сочинение',
  控: 'контролировать',
  背: 'спина',
  概: 'общий; приблизительно',
  央: 'центр, середина',
  户: 'дверь; семья',
  烈: 'сильный, яростный',
  索: 'канат; искать',
  胡: 'борода; варварский',
  靠: 'опираться; рядом',
  景: 'вид, пейзаж',
  姐: 'старшая сестра',
  讨: 'обсуждать; требовать',
  监: 'надзирать',
  临: 'приближаться; у',
  露: 'роса; обнажать',
  野: 'дикий; поле',
  括: 'заключать, охватывать',
  楚: 'ясный; царство Чу',
  散: 'рассеиваться',
  封: 'запечатывать; сч. слово писем',
  移: 'перемещать',
  松: 'сосна; свободный',
  谢: 'благодарить',
  康: 'здоровый, благополучный',
  销: 'продавать, сбывать',
  剧: 'драма, пьеса',
  巨: 'огромный',
  炮: 'пушка',
  录: 'записывать',
  睛: 'зрачок, глаз',
  输: 'проигрывать; перевозить',
  招: 'манить, звать',
  旅: 'путешествовать',
  泽: 'водоём, болото',
  莫: 'не, нельзя',
  勒: 'обуздывать; (в транскрипциях)',
  诺: 'обещание',
  奥: 'глубокий, сокровенный',
  俄: 'Россия',
  洛: '(в транскрипциях)',
  旁: 'сторона, рядом',
  荣: 'слава, почёт',
  牙: 'зуб',
  量: 'количество',
  阿: 'префикс; (в транскрипциях)',
  斯: 'этот; (в транскрипциях)',
};

/** Jun Da's pinyin with tone numbers ('lü4') -> 'lǜ'. */
function numberedToMarks(py) {
  const m = /^([a-zü:v]+)([1-5]?)$/.exec((py || '').toLowerCase());
  if (!m) return '';
  const syllable = m[1].replace(/u:|v/g, 'ü');
  const tone = Number(m[2] || 5);
  if (tone === 5) return syllable;
  const marks = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', ü: 'ǖǘǚǜ' };
  // a and e take the mark, then o in ou, else the last vowel
  let idx = syllable.search(/[ae]/);
  if (idx < 0) idx = syllable.indexOf('ou');
  if (idx < 0) {
    const vowels = [...syllable.matchAll(/[iouü]/g)];
    idx = vowels.length ? vowels[vowels.length - 1].index : -1;
  }
  if (idx < 0) return syllable;
  return syllable.slice(0, idx) + marks[syllable[idx]][tone - 1] + syllable.slice(idx + 1);
}

function loadFrequencies() {
  return fs
    .readFileSync(FREQ_LIST, 'utf8')
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [rank, cn, cumulative] = line.split('\t');
      return { rank: Number(rank), cn, cumulative: Number(cumulative) };
    });
}

async function run() {
  const MONGO_DB = process.env.MONGO_IN_CONTAINER
    ? process.env.CONTAINER_MONGO_DB
    : process.env.MONGO_DB;
  await connectDB(MONGO_DB);
  const db = mongoose.connection.db;

  const chars = loadFrequencies();
  const cns = chars.map((c) => c.cn);
  const junDaReadings = loadJunDaReadings();

  // HSK 3.0: readings of single-character words, lowest level of the words with a character
  const hsk3Reading = new Map();
  const hskLevel = new Map();
  const hsk3Words = await db
    .collection('hskword2025')
    .find({}, { projection: { cn: 1, py: 1, lvl: 1 } })
    .toArray();
  for (const { cn, py, lvl } of hsk3Words) {
    const level = HSK_LEVELS.indexOf(String(lvl));
    if (level < 0 || !cn) continue;
    for (const c of new Set(cn)) {
      if (!hskLevel.has(c) || level < hskLevel.get(c)) hskLevel.set(c, level);
    }
    if ([...cn].length === 1) {
      const [reading] = normPinyin(py).split('/');
      if (SYLLABLE_RE.test(reading) && !hsk3Reading.has(cn)) hsk3Reading.set(cn, reading);
    }
  }
  const hsk2Reading = new Map();
  const hsk2Words = await db
    .collection('hskwords')
    .find({ cn: { $in: cns } }, { projection: { cn: 1, py: 1 } })
    .toArray();
  for (const { cn, py } of hsk2Words) {
    const reading = normPinyin(py);
    if (SYLLABLE_RE.test(reading) && !hsk2Reading.has(cn)) hsk2Reading.set(cn, reading);
  }

  // first dictionary entry of each character
  const entries = await db
    .collection('dictionaries')
    .find({ chinese: { $in: cns } }, { projection: { chinese: 1, pinyin: 1 } })
    .toArray();
  const ownEntries = new Map();
  for (const e of entries) ownEntries.set(e.chinese, [...(ownEntries.get(e.chinese) || []), e]);

  const fromDictionary = [];
  const picked = chars.map((c) => {
    let reading = READING_OVERRIDES[c.cn] || hsk3Reading.get(c.cn) || hsk2Reading.get(c.cn);
    const own = ownEntries.get(c.cn) || [];
    if (!reading) {
      reading = readingsOf(own[0]?.pinyin)[0] || junDaReadings.get(c.cn) || '';
      if (reading !== junDaReadings.get(c.cn))
        fromDictionary.push(`${c.cn} ${reading} (Jun Da: ${junDaReadings.get(c.cn)})`);
    }
    const entry =
      own.find((e) => readingsOf(e.pinyin)[0] === reading) ||
      own.find((e) => readingsOf(e.pinyin).includes(reading));
    return { ...c, reading, entry };
  });

  const dictIds = picked.map((c) => c.entry?._id).filter(Boolean);
  const [lexicons, translations] = await Promise.all([
    db
      .collection('lexicons')
      .find({ chinese: { $in: cns } }, { projection: { chinese: 1, pinyin: 1, translation: 1 } })
      .toArray(),
    db
      .collection('dictionarytranslations')
      .find({ wordId: { $in: dictIds }, lang: 'ru' }, { projection: { wordId: 1, senses: 1 } })
      .toArray(),
  ]);
  const lexiconGloss = new Map(
    lexicons.map((l) => [
      `${l.chinese} ${normPinyin(l.pinyin)}`,
      shortGloss(l.translation, MAX_GLOSS),
    ]),
  );
  const sensesById = new Map(translations.map((t) => [String(t.wordId), t.senses]));

  const noGloss = [];
  const rows = picked.map(({ cn, reading, entry, cumulative }) => {
    const gloss =
      GLOSS_OVERRIDES[cn] ??
      (lexiconGloss.get(`${cn} ${reading}`) ||
        (entry
          ? readingGloss(reading, entry.pinyin, sensesById.get(String(entry._id)), MAX_GLOSS)
          : ''));
    if (!gloss) noGloss.push(`${cn} ${reading}`);
    const level = hskLevel.has(cn) ? HSK_LEVELS[hskLevel.get(cn)] : '';
    return [cn, reading, gloss, level, cumulative];
  });

  fs.writeFileSync(
    OUT_FILE,
    [
      '// Generated by server/scripts/export-top-chars.js, do not edit by hand.',
      "// The most frequent characters (Jun Da's list), by rank:",
      '// [character, pinyin, gloss, first HSK 3.0 level or "", cumulative frequency in %].',
      '// prettier-ignore',
      'const topChars: [string, string, string, string, number][] = [',
      ...rows.map((r) => `  ${JSON.stringify(r)},`),
      '];',
      '',
      'export default topChars;',
      '',
    ].join('\n'),
  );

  console.log(`Written ${OUT_FILE}: ${rows.length} characters`);
  console.log(`Not in HSK 3.0: ${rows.filter((r) => !r[3]).length}`);
  console.log(`Without a gloss (${noGloss.length}): ${noGloss.join(', ')}`);
  console.log(
    `Reading from the dictionary, not Jun Da's first (${fromDictionary.length}): ${fromDictionary.join(', ')}`,
  );
  await mongoose.disconnect();
}

/** Jun Da's first reading of each character (4th column of the TSV: 'de/di2/di4' -> 'de'). */
function loadJunDaReadings() {
  const readings = new Map();
  for (const line of fs.readFileSync(FREQ_LIST, 'utf8').split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const [, cn, , py] = line.split('\t');
    if (py) readings.set(cn, numberedToMarks(py.split('/')[0]));
  }
  return readings;
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
