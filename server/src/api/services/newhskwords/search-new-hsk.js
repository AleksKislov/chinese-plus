const { aggregateHskWords } = require('./get-hsk-model');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function searchNewHsk(req, res) {
  const lexicon = await aggregateHskWords(req.body.version, [
    { $match: { cn: { $regex: escapeRegex(String(req.body.chinese || '')) } } },
  ]);
  res.json(lexicon);
}

module.exports = { searchNewHsk };
