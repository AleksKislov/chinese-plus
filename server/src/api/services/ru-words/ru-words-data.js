// "Мама на китайском" (/na-kitayskom): hand-curated, small enough to keep in memory
const { topics: TOPICS_RAW, charMeanings } = require('../../../../content/ru-words/ru-words.json');

const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}; // prettier-ignore

const lower = (s) => s.toLowerCase().replace(/ё/g, 'е');

/** "Санкт-Петербург" -> "sankt-peterburg", "не за что" -> "ne-za-chto" */
const slugify = (ru) =>
  [...ru.toLowerCase()]
    .map((c) => TRANSLIT[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const VOWEL_START_RE = /^[aāáǎàeēéěèoōóǒò]/i;

/** "mā-ma" -> "māma", "nǚ-ér" -> "nǚ'ér", "nǐ hǎo" stays */
const pinyinText = (py) =>
  py
    .split(' ')
    .map((word) =>
      word
        .split('-')
        .map((syl, i) => (i > 0 && VOWEL_START_RE.test(syl) ? `'${syl}` : syl))
        .join(''),
    )
    .join(' ');

/** "nǐ hǎo" -> ["nǐ", "hǎo"]: one syllable per character */
const pinyinSyllables = (py) => py.split(/[\s-]+/).filter(Boolean);

const toWord = (raw, topic) => ({
  slug: slugify(raw.ru),
  ru: raw.ru,
  cn: raw.cn,
  py: pinyinText(raw.py),
  syllables: pinyinSyllables(raw.py),
  also: raw.also || [],
  alt: (raw.alt || []).map((a) => ({ cn: a.cn, py: pinyinText(a.py), ru: a.ru })),
  note: raw.note || '',
  topic: topic.slug,
});

const TOPICS = [];
const WORDS = [];
const BY_SLUG = new Map(); // words and topics share the /na-kitayskom/<slug>/ namespace

for (const rawTopic of TOPICS_RAW) {
  const topic = {
    slug: rawTopic.slug,
    name: rawTopic.name,
    title: rawTopic.title,
    intro: rawTopic.intro,
    words: [],
  };
  if (BY_SLUG.has(topic.slug)) {
    console.error(`[ru-words] duplicate slug ${topic.slug}, topic skipped`);
    continue;
  }
  BY_SLUG.set(topic.slug, { type: 'topic', topic });
  TOPICS.push(topic);

  for (const raw of rawTopic.words) {
    const word = toWord(raw, topic);
    const syllablesOk = word.syllables.length === [...word.cn].length;
    if (BY_SLUG.has(word.slug) || !syllablesOk) {
      console.error(`[ru-words] ${raw.ru}: duplicate slug or pinyin syllables != characters`);
      continue;
    }
    BY_SLUG.set(word.slug, { type: 'word', word });
    topic.words.push(word);
    WORDS.push(word);
  }
}

// "мама", "кот" (an `also` form of "кошка") -> slug; the main forms win over `also`
const SLUG_BY_RU = new Map();
WORDS.forEach((w) => SLUG_BY_RU.set(lower(w.ru), w.slug));
WORDS.forEach((w) =>
  w.also.forEach((a) => SLUG_BY_RU.has(lower(a)) || SLUG_BY_RU.set(lower(a), w.slug)),
);

// "妈妈" -> the words whose main Chinese it is ("你好": привет)
const WORDS_BY_CN = new Map();
WORDS.forEach((w) => WORDS_BY_CN.set(w.cn, [...(WORDS_BY_CN.get(w.cn) || []), w]));

/** "мама" -> "mama" */
function findRuWordSlug(word) {
  return SLUG_BY_RU.get(lower(word || '')) || null;
}

module.exports = {
  TOPICS,
  WORDS,
  BY_SLUG,
  WORDS_BY_CN,
  CHAR_MEANINGS: charMeanings || {},
  findRuWordSlug,
};
