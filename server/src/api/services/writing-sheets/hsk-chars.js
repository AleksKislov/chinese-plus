const Lexicon = require('../../../models/Lexicon');
const Hskword2025 = require('../../../models/Hskword2025');
const Dictionary = require('../../../models/Dictionary');
const { splitWordPinyin, isNeutral, HAN_RE } = require('./pinyin');

// '2' - old HSK 2.0 (lexicons), '3' - HSK 3.0 (2025 syllabus)
const HSK_LEVELS = {
  2: ['1', '2', '3', '4', '5', '6'],
  3: ['1', '2', '3', '4', '5', '6', '789'],
};

const INDEX_TTL = 24 * 60 * 60 * 1000;
const indexes = new Map(); // version -> { builtAt, promise }

const loadWords = async (version) => {
  if (version === '2') {
    const words = await Lexicon.find({}, { _id: 0, chinese: 1, pinyin: 1, level: 1 })
      .sort({ word_id: 1 })
      .lean();
    return words.map((w) => ({ cn: w.chinese, py: w.pinyin, lvl: String(w.level) }));
  }
  const words = await Hskword2025.find({}, { _id: 0, cn: 1, py: 1, lvl: 1, id: 1 }).lean();
  const order = HSK_LEVELS[3];
  return words.sort((a, b) => order.indexOf(a.lvl) - order.indexOf(b.lvl) || a.id - b.id);
};

// the char's reading as a word of its own (了 le, 一 yī), else the most common toned reading
// in the level's words (子 zǐ, not the zi of 杯子), else the most common one (们 men)
const pickReading = ({ solo, votes }) => {
  if (solo) return solo;
  const sorted = [...votes.entries()].sort((a, b) => b[1] - a[1]);
  return (sorted.find(([syl]) => !isNeutral(syl)) || sorted[0] || [''])[0];
};

// every character of the version in order of first appearance, with the level it first appears at
const buildIndex = async (version) => {
  const byChar = new Map();
  (await loadWords(version)).forEach(({ cn, py, lvl }) => {
    [...cn]
      .filter((ch) => HAN_RE.test(ch) && !byChar.has(ch))
      .forEach((ch) => byChar.set(ch, { ch, lvl, solo: '', votes: new Map() }));

    const pairs = splitWordPinyin(cn, py);
    if (!pairs) return;
    const solo = [...cn].length === 1 && byChar.get(cn);
    if (solo && !solo.solo) solo.solo = pairs[0][1];
    pairs.forEach(([ch, syl]) => {
      const { votes } = byChar.get(ch);
      votes.set(syl, (votes.get(syl) || 0) + 1);
    });
  });

  return [...byChar.values()].map((x) => ({ ch: x.ch, lvl: x.lvl, py: pickReading(x) }));
};

const getHskIndex = (version) => {
  const cached = indexes.get(version);
  if (cached && Date.now() - cached.builtAt < INDEX_TTL) return cached.promise;

  const promise = buildIndex(version);
  indexes.set(version, { builtAt: Date.now(), promise });
  promise.catch(() => indexes.delete(version));
  return promise;
};

const plainSyllable = (syl) =>
  syl
    .normalize('NFD')
    .replace(/[\u0300\u0301\u0304\u030c]/g, '')
    .normalize('NFC')
    .toLowerCase();

// polyphones list each reading under its own [b]II dōu[/b] heading - start from the right one
const fromReading = (russian, reading) => {
  if (!reading) return russian;
  const heading = [...russian.matchAll(/\[b\]([^[]*)\[\/b\]/g)].find((m) =>
    m[1]
      .toLowerCase()
      .split(/[\s,;]+/)
      .includes(reading),
  );
  return heading ? russian.slice(heading.index) : russian;
};

const cleanSense = (block) => {
  const text = block
    .replace(/\[(i|c|p|b|ref|com)\][\s\S]*?\[\/\1\]/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/(^|\s)(\d+|[а-я])\)/g, ' ')
    .replace(/\([^()а-яё]*\)/gi, ' ')
    .replace(/\([^)]*$/, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (/[а-яё]/i.test(text)) return text;
  // a sense that is only a note: [i]указывает на порядковое значение...[/i]
  const note = block.match(/^\s*\d+\)\s*\[i\]([^[]*)\[\/i\]/);
  return note ? note[1].trim() : '';
};

// [m1][b]I[/b] [p]сущ.[/p][/m][m2]1) хороший; приятный; ... -> 'хороший'
const shortGloss = (russian, reading) => {
  const txt = fromReading(
    (russian || '').replace(/\[ex\][\s\S]*?\[\/ex\]/g, ' ').replace(/\\\[[^\]]*\\\]/g, ''),
    reading,
  );
  const sense =
    txt
      .split(/\[m\d\]/)
      .map(cleanSense)
      .find(Boolean) || '';
  return firstMeanings(sense.split(/[;:]/)[0]);
};

// 'и (союз), с (кем-либо); гармония' -> 'и, с', '(частица, выражает ...)' -> 'частица, выражает ...'
const firstMeanings = (txt) => {
  const items = [];
  let depth = 0;
  let item = '';
  [...txt.replace(/\//g, ' ')].forEach((ch) => {
    depth += ch === '(' ? 1 : ch === ')' ? -1 : 0;
    if (ch === ',' && depth <= 0) {
      items.push(item);
      item = '';
    } else item += ch;
  });
  items.push(item);

  const short = items
    .map((x) => {
      const bare = x.replace(/\([^()]*\)?/g, ' ').trim();
      return (bare || x.replace(/[()]/g, ' ')).replace(/\s+/g, ' ').trim();
    })
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');
  return short.length > 40 ? short.slice(0, short.lastIndexOf(' ', 40)) : short;
};

// adds a short meaning - the HSK 2.0 translation when the char is a word of its own there,
// else the dictionary's; chars without a reading (outside HSK) take the dictionary's first one
const withDictInfo = async (chars) => {
  const query = { $in: chars.map((x) => x.ch) };
  const [entries, words] = await Promise.all([
    Dictionary.find({ chinese: query }, { _id: 0, chinese: 1, pinyin: 1, russian: 1 }).lean(),
    Lexicon.find({ chinese: query }, { _id: 0, chinese: 1, pinyin: 1, translation: 1 }).lean(),
  ]);

  return chars.map(({ ch, py }) => {
    const options = entries.filter((e) => e.chinese === ch);
    const readings = (e) => (e.pinyin || '').split(/[,;]/).map((x) => x.trim().toLowerCase());
    const entry =
      options.find((e) => py && readings(e).includes(py)) ||
      options.find((e) => py && readings(e).map(plainSyllable).includes(plainSyllable(py))) ||
      options[0];
    const reading = py || (entry ? readings(entry)[0] : '');

    const word = words.find(
      (w) => w.chinese === ch && plainSyllable(w.pinyin) === plainSyllable(reading),
    );
    const ru = word
      ? firstMeanings(word.translation.split(';')[0])
      : shortGloss(entry?.russian, reading);
    return { ch, py: reading, ru };
  });
};

module.exports = { HSK_LEVELS, getHskIndex, withDictInfo };
