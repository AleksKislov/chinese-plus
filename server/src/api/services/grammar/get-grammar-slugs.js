const Grammar = require('../../../models/Grammar');

// light list for the sitemap: [{ slug, level, updatedAt }]
async function getGrammarSlugs(req, res) {
  const topics = await Grammar.find()
    .select('-_id slug level updatedAt')
    .sort({ level: 1, ind: 1 })
    .lean();
  res.json(topics);
}

module.exports = { getGrammarSlugs };
