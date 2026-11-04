const { getDictWordsCsv } = require('../_misc');

const UserDictWord = require('../../../models/UserWord');

const downloadUserDictWordsCsv = async (req, res) => {
  const { has_examples } = req.query;
  const hasExamples = Boolean(has_examples);

  const allWords = await UserDictWord.find({ user: req.user.id })
    .populate('wordId', ['chinese', 'pinyin'])
    .sort({ date: -1 });

  if (!allWords.length) {
    return res.status(404).json({ msg: 'No words found' });
  }

  const mapped = allWords.map((word) => ({
    chinese: word.wordId.chinese,
    pinyin: word.wordId.pinyin,
    wordId: word.wordId._id,
  }));

  const csv = await getDictWordsCsv(mapped, hasExamples, true);

  const filename = `user_dict_words_${hasExamples ? 'with' : 'no'}_examples.csv`;
  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
};

module.exports = {
  downloadUserDictWordsCsv,
};
