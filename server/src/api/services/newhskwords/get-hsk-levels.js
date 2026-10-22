const Hskword2025 = require('../../../models/Hskword2025');

const LEVELS = ['1', '2', '3', '4', '5', '6', '789'];
const MAX_WORDS = 300;

// ['学习', '猫'] -> { 学习: '1', 猫: '2' }: the lowest HSK 3.0 level of each word, words outside HSK left out
async function getHskLevels(req, res) {
  const words = (Array.isArray(req.body) ? req.body : [])
    .filter((w) => typeof w === 'string')
    .slice(0, MAX_WORDS);

  const found = await Hskword2025.find({ cn: { $in: words } }, { _id: 0, cn: 1, lvl: 1 }).lean();
  const levels = {};
  found.forEach(({ cn, lvl }) => {
    if (!levels[cn] || LEVELS.indexOf(lvl) < LEVELS.indexOf(levels[cn])) levels[cn] = lvl;
  });
  res.json(levels);
}

module.exports = { getHskLevels };
