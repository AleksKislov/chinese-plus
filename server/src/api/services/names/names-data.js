// built by scripts/build-names.js; small enough to keep in memory
const NAMES = require('../../../../content/names/ru-names.json');

const lower = (s) => s.toLowerCase().replace(/ё/g, 'е');

const BY_SLUG = new Map(NAMES.map((n) => [n.slug, n]));

// full names and short forms ("Саша") -> slugs of the full names' pages
const SLUGS_BY_NAME = new Map();
for (const n of NAMES) {
  for (const name of [n.name, ...n.short.map((s) => s.name)]) {
    const key = lower(name);
    if (!SLUGS_BY_NAME.has(key)) SLUGS_BY_NAME.set(key, []);
    SLUGS_BY_NAME.get(key).push(n.slug);
  }
}

/** "александр" -> "aleksandr"; a full name wins over a short form of another name */
function findNameSlug(word) {
  const slugs = SLUGS_BY_NAME.get(lower(word || ''));
  if (!slugs) return null;
  return slugs.find((slug) => lower(BY_SLUG.get(slug).name) === lower(word)) || slugs[0];
}

module.exports = { NAMES, BY_SLUG, findNameSlug };
