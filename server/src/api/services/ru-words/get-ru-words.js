const { TOPICS, WORDS_BY_CN } = require('./ru-words-data');

// light list for the hub page and the sitemap: every topic with its words
async function getRuWords(req, res) {
  res.json(
    TOPICS.map((t) => ({
      slug: t.slug,
      name: t.name,
      title: t.title,
      words: t.words.map((w) => ({ slug: w.slug, ru: w.ru, cn: w.cn, py: w.py, also: w.also })),
    })),
  );
}

// the pages of a Chinese word, for a link from its /dictionary page: 你好 -> [привет]
async function getRuWordsByCn(req, res) {
  res.json((WORDS_BY_CN.get(req.params.cn) || []).map((w) => ({ slug: w.slug, ru: w.ru })));
}

module.exports = { getRuWords, getRuWordsByCn };
