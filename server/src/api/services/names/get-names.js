const { NAMES } = require('./names-data');

// light list for the hub page and the sitemap: the main variant of every name
async function getNames(req, res) {
  res.json(
    NAMES.map((n) => ({
      slug: n.slug,
      name: n.name,
      gender: n.gender,
      cn: n.variants[0].cn,
      py: n.variants[0].py,
      short: n.short.map((s) => s.name),
    })),
  );
}

module.exports = { getNames };
