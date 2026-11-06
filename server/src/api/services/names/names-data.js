// built by scripts/build-names.js; small enough to keep in memory
const NAMES = require('../../../../content/names/ru-names.json');

const lower = (s) => s.toLowerCase().replace(/ё/g, 'е');

const BY_SLUG = new Map(NAMES.map((n) => [n.slug, n]));

// full names and short forms ("Саша") each have their own page
const SLUG_BY_NAME = new Map(NAMES.map((n) => [lower(n.name), n.slug]));

/** "александр" -> "aleksandr", "саша" -> "sasha" */
function findNameSlug(word) {
  return SLUG_BY_NAME.get(lower(word || '')) || null;
}

module.exports = { NAMES, BY_SLUG, findNameSlug };
