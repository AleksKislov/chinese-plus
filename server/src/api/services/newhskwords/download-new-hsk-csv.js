const { getDictWordsCsv } = require('../_misc');
const NewHskWord = require('../../../models/Hskword');

const downloadNewHskCsv = async (req, res) => {
  const { hsk_level: hskLevel } = req.params;
  const { has_examples } = req.query;
  const hasExamples = Boolean(has_examples);

  const allWords = await NewHskWord.aggregate([
    { $match: { lvl: hskLevel } },
    { $sort: { id: 1 } },
    { $project: { _id: 0, __v: 0, id: 0 } },
  ]);

  if (!allWords.length) {
    return res.status(404).json({ msg: 'No words found' });
  }

  // const fields = ['chinese', 'pinyin', 'translation'];
  // const json2csv = new Parser({ fields });
  // const csv = json2csv.parse(
  //   allWords.map((doc) => {
  //     return {
  //       chinese: doc.cn,
  //       pinyin: doc.py,
  //       translation: `${SPAN_OPEN}${doc.py}</span><br>${markupTranslation(doc.ru, hasExamples)}`,
  //     };
  //   }),
  // );

  const mapped = allWords.map((x) => ({
    chinese: x.cn,
    pinyin: x.py,
    russian: x.ru,
  }));

  const csv = getDictWordsCsv(mapped, hasExamples, true);

  const filename = `hsk_v3_lvl_${hskLevel}_${hasExamples ? 'with' : 'no'}_examples.csv`;
  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
};

module.exports = { downloadNewHskCsv };
