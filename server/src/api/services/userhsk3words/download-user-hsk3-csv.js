const { getDictWordsCsv } = require('../_misc');
const { findUserHsk3Words } = require('./find-user-hsk3-words');

const downloadUserHsk3Csv = async (req, res) => {
  const { has_examples } = req.query;
  const hasExamples = Boolean(has_examples);

  const allWords = await findUserHsk3Words(req.user.id);

  if (!allWords.length) {
    return res.status(404).json({ msg: 'No words found' });
  }

  const mapped = allWords.map((x) => ({
    chinese: x.cn,
    pinyin: x.py,
    russian: x.ru,
  }));

  const csv = getDictWordsCsv(mapped, hasExamples, true);

  const filename = `hsk_v3_user_words_${hasExamples ? 'with' : 'no'}_examples.csv`;
  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
};

module.exports = { downloadUserHsk3Csv };
