const Grammar = require('../../../models/Grammar');
const { attachTooltips } = require('./attach-tooltips');

// one topic plus its neighbours within the level (for prev / next links)
async function getGrammarTopic(req, res) {
  const topic = await Grammar.findOne({ slug: req.params.slug }).select('-__v').lean();
  if (!topic) return res.status(404).json({ msg: 'Topic not found' });

  const neighbour = (ind, dir) =>
    Grammar.findOne({ level: topic.level, ind: dir > 0 ? { $gt: ind } : { $lt: ind } })
      .sort({ ind: dir })
      .select('slug title')
      .lean();
  const [prev, next] = await Promise.all([neighbour(topic.ind, -1), neighbour(topic.ind, 1)]);

  const [withTooltips] = await attachTooltips([topic]);
  res.json({ topic: withTooltips, prev, next });
}

module.exports = { getGrammarTopic };
