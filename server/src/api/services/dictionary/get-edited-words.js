const Dictionary = require("../../../models/Dictionary");

async function getEditedWords(req, res) {
  const { skip } = req.query;
  const skipNum = skip && /^\d+$/.test(skip) ? +skip : 0;

  const condition = { edited: true };
  const [words, count] = await Promise.all([
    Dictionary.find(condition, null, {
      skip: skipNum,
      limit: 50,
    }).sort({ date: -1 }),
    Dictionary.find(condition).count(),
  ]);
  res.json({ words, count });
}

module.exports = { getEditedWords };
