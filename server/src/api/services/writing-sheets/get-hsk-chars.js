const { HSK_LEVELS, getHskIndex, withDictInfo } = require('./hsk-chars');

// characters that first appear at the level, in syllabus order
async function getHskChars(req, res) {
  const version = String(req.query.version || '3');
  const level = String(req.query.level || '1');
  if (!HSK_LEVELS[version]?.includes(level)) {
    return res.status(400).json({ msg: 'Unknown HSK version or level' });
  }

  const index = await getHskIndex(version);
  res.json(await withDictInfo(index.filter((x) => x.lvl === level)));
}

module.exports = { getHskChars };
