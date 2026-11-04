const { getDictWordsCsv } = require('../_misc');
const { aggregateHskWords } = require('./get-hsk-model');

const downloadNewHskCsv = async (req, res) => {
  const { hsk_level: hskLevel } = req.params;
  const { has_examples, version } = req.query;
  const hasExamples = Boolean(has_examples);

  const allWords = await aggregateHskWords(version, [
    { $match: { lvl: hskLevel } },
    { $sort: { id: 1 } },
    { $project: { _id: 0, __v: 0, id: 0 } },
  ]);

  if (!allWords.length) {
    return res.status(404).json({ msg: 'No words found' });
  }

  const mapped = allWords.map((x) => ({
    chinese: x.cn,
    pinyin: x.py,
    wordId: x.dictId,
  }));

  const csv = await getDictWordsCsv(mapped, hasExamples, true);

  const filename = `hsk_v3${version === '2021' ? '_2021' : ''}_lvl_${hskLevel}_${hasExamples ? 'with' : 'no'}_examples.csv`;
  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
};

module.exports = { downloadNewHskCsv };
