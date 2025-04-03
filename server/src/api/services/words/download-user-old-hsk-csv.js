const OldHskUserWord = require('../../../models/Word');
const { getDictWordsCsv } = require('../_misc');

const downloadUserOldHskCsv = async (req, res) => {
  // const { hsk_level: hskLevel } = req.params;
  const { is_html: isHtml } = req.query;

  const allWords = await OldHskUserWord.find({ user: req.user.id })
    .populate('wordId', ['chinese', 'translation', 'pinyin'])
    .sort({ date: -1 });

  if (allWords.length === 0) {
    return res.status(404).json({ msg: 'No words found' });
  }

  const mapped = allWords.map((x) => ({
    chinese: x.wordId.chinese,
    pinyin: x.wordId.pinyin,
    russian: x.wordId.translation,
  }));

  const csv = getDictWordsCsv(mapped, false, isHtml);

  res.setHeader(
    'Content-disposition',
    `attachment; filename=hsk_v2_user_words${isHtml ? '_html' : ''}.csv`,
  );
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
};

module.exports = { downloadUserOldHskCsv };
