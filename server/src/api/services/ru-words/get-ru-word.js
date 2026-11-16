const { BY_SLUG, TOPICS, CHAR_MEANINGS } = require('./ru-words-data');
const { ruMeanings, examplesOf, hskInfo } = require('./dictionary-info');
const { findNameSlug } = require('../names');

const toLink = (w) => w && { slug: w.slug, ru: w.ru, cn: w.cn };
const withHsk = (info) => (item) => ({ ...item, ...(info[item.cn] || { hsk: null, audio: null }) });

async function wordPage(word) {
  const chars = [...new Set(word.cn)];
  const [meanings, examples, info] = await Promise.all([
    ruMeanings([word.cn, ...chars]),
    examplesOf(word.cn),
    hskInfo([word.cn, ...word.alt.map((a) => a.cn)]),
  ]);

  const topic = TOPICS.find((t) => t.slug === word.topic);
  const ind = topic.words.indexOf(word);
  return {
    type: 'word',
    word: {
      ...withHsk(info)({ slug: word.slug, ru: word.ru, cn: word.cn, py: word.py }),
      note: word.note,
      also: word.also,
      alt: word.alt.map(withHsk(info)),
      meaning: meanings[word.cn] || '',
    },
    chars: [...word.cn].map((ch, i) => ({
      ch,
      py: word.syllables[i],
      meaning: CHAR_MEANINGS[ch] ?? meanings[ch] ?? '',
    })),
    examples,
    topic: { slug: topic.slug, name: topic.name, title: topic.title },
    related: topic.words.filter((w) => w !== word).map(toLink),
    prev: toLink(topic.words[ind - 1]) || null,
    next: toLink(topic.words[ind + 1]) || null,
    // "Лев", "Надежда", "Любовь" are names too: /names has their transcription
    nameSlug: findNameSlug(word.ru),
  };
}

async function topicPage(topic) {
  const info = await hskInfo(topic.words.map((w) => w.cn));
  return {
    type: 'topic',
    topic: { slug: topic.slug, name: topic.name, title: topic.title, intro: topic.intro },
    words: topic.words.map((w) => withHsk(info)({ slug: w.slug, ru: w.ru, cn: w.cn, py: w.py })),
    topics: TOPICS.filter((t) => t !== topic).map((t) => ({ slug: t.slug, title: t.title })),
  };
}

/**
 * One page of /na-kitayskom/: a word ("мама": 妈妈 with its characters, examples, audio)
 * or a topic ("цифры": the list of its words)
 */
async function getRuWord(req, res) {
  const entry = BY_SLUG.get(req.params.slug);
  if (!entry) return res.status(404).json({ msg: 'Word not found' });
  res.json(entry.type === 'word' ? await wordPage(entry.word) : await topicPage(entry.topic));
}

module.exports = { getRuWord };
