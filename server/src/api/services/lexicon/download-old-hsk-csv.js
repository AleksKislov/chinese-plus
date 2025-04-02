const Lexicon = require('../../../models/Lexicon');
const { getDictWordsCsv } = require('../_misc');

const downloadOldHskCsv = async (req, res) => {
  const { hsk_level: hskLevel } = req.params;
  const { is_html: isHtml } = req.query;

  const allLexicon = await Lexicon.aggregate([
    { $match: { level: +hskLevel } },
    { $project: { _id: 0, __v: 0, word_id: 0 } },
  ]);

  if (allLexicon.length === 0) {
    return res.status(404).json({ msg: 'No words found' });
  }

  const mapped = allLexicon.map((x) => ({
    chinese: x.chinese,
    pinyin: x.pinyin,
    russian: x.translation,
  }));
  const csv = getDictWordsCsv(mapped, false, isHtml);

  res.setHeader(
    'Content-disposition',
    `attachment; filename=hsk_v2_lvl_${hskLevel}${isHtml ? '_html' : ''}.csv`,
  );
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
};

module.exports = { downloadOldHskCsv };
