const Lexicon = require('../../../models/Lexicon');
const Hskword2025 = require('../../../models/Hskword2025');
const Dictionary = require('../../../models/Dictionary');
const { findSenses } = require('../dictionary/translations/attach-senses');
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

// polyphones list each reading under its own pinyin (a homonym or a sense): start at the first
// node with the reading's pinyin, take the first sense with russian text outside comments /
// labels; from the beginning when nothing is found after the reading
const glossFromSenses = (senses, reading) => {
  const nodes = [];
  const flatten = (list) =>
    list.forEach((n) => {
      nodes.push(n);
      if (n.senses) flatten(n.senses);
    });
  flatten(senses);

  const start = reading
    ? nodes.findIndex((n) =>
        (n.pinyin || '')
          .toLowerCase()
          .split(/[\s,;]+/)
          .includes(reading),
      )
    : -1;

  const firstGloss = (list) => {
    for (const node of list) {
      const parts = node.content || [{ type: 'text', value: node.text || '' }];
      const plain = parts
        .map((x) => (x.type === 'text' || x.type === 'strong' ? x.value : ' '))
        .join('')
        .replace(/\[[^\]]*\]/g, '')
        .replace(/\([^()а-яё]*\)/gi, ' ')
        .replace(/\([^)]*$/, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      // a section letter left in the text: "1) [p]гл.[/p] [b] А[/b]"
      if (/[а-яё]/i.test(plain) && !/^[А-ЯЁ]\.?$/.test(plain)) {
        return firstMeanings(plain.split(/[;:]/)[0]);
      }
      // a sense that is only a note: 1) [i]указывает на порядковое значение...[/i]
      if (/^\d+$/.test(node.marker || '') && parts[0].type === 'comment') {
        return firstMeanings(parts[0].value.trim().split(/[;:]/)[0]);
      }
    }
    return '';
  };

  return (start > 0 && firstGloss(nodes.slice(start))) || firstGloss(nodes);
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
    Dictionary.find({ chinese: query }, { chinese: 1, pinyin: 1 }).lean(),
    Lexicon.find({ chinese: query }, { _id: 0, chinese: 1, pinyin: 1, translation: 1 }).lean(),
  ]);
  const sensesById = await findSenses(entries.map((e) => e._id));

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
    const senses = entry && sensesById.get(String(entry._id));
    const ru = word
      ? firstMeanings(word.translation.split(';')[0])
      : senses
        ? glossFromSenses(senses, reading)
        : '';
    return { ch, py: reading, ru };
  });
};

module.exports = { HSK_LEVELS, getHskIndex, withDictInfo };
