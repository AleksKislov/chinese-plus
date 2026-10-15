const Grammar = require('../../../models/Grammar');

const TTL = 60 * 60 * 1000; // grammar changes only with scripts/import-grammar.js
const cache = new Map(); // level -> { at, topics }

// topics of one grammar level: [{ slug, title }] (title in Russian)
async function getLevelTopics(level) {
  const hit = cache.get(level);
  if (hit && Date.now() - hit.at < TTL) return hit.topics;

  const docs = await Grammar.find({ level }).sort({ ind: 1 }).select('slug title.ru').lean();
  const topics = docs.map((d) => ({ slug: d.slug, title: d.title.ru }));
  cache.set(level, { at: Date.now(), topics });
  return topics;
}

// what the tutor may link to at an HSK level: that level and the one below
async function getGrammarCatalog(hskLevel) {
  const levels = [hskLevel - 1, hskLevel].filter((l) => l >= 1).map(String);
  const lists = await Promise.all(levels.map(getLevelTopics));
  const topics = lists.flat();
  return { topics, bySlug: new Map(topics.map((t) => [t.slug, t])) };
}

module.exports = { getGrammarCatalog };
