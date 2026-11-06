const { NAMES } = require('./names-data');

// light list for the hub page and the sitemap: the main variant of every name and short form
async function getNames(req, res) {
  res.json(
    NAMES.map((n) => ({
      kind: n.kind,
      slug: n.slug,
      name: n.name,
      gender: n.gender,
      cn: n.variants[0].cn,
      py: n.variants[0].py,
      short: n.short.map((s) => ({ name: s.name, slug: s.slug })),
    })),
  );
}

module.exports = { getNames };
