const Grammar = require('../../../models/Grammar');

// topic list of a level: titles and summaries only; the full topic (rules,
// examples with tooltips) comes from /topic/:slug when it is opened
async function getGrammarByLevel(req, res) {
  const topics = await Grammar.find({ level: req.params.level })
    .select('slug level ind category title items summary')
    .sort({ ind: 1 })
    .lean();
  res.json(topics);
}

module.exports = { getGrammarByLevel };
