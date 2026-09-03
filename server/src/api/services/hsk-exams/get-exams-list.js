const HskExam = require('../../../models/HskExam');

/**
 * @route GET api/hsk-exams?version=new&lvl=1
 *
 * Published exams for the picker. Sections are pulled only to count questions
 * for the card, then dropped - the full paper is fetched per-exam by slug.
 */
const getExamsList = async (req, res) => {
  const { version, lvl } = req.query;

  const query = { isApproved: true };
  if (version) query.version = version;
  if (lvl) query.level = lvl;

  const exams = await HskExam.find(query)
    .select('version level slug title descriptionRu ind durationMinutes sections')
    .sort({ version: 1, level: 1, ind: 1 })
    .lean();

  const list = exams.map(({ sections, ...exam }) => ({
    ...exam,
    questionsNum: sections.reduce(
      (sum, s) => sum + s.parts.reduce((n, p) => n + p.questions.length, 0),
      0
    ),
    sectionTypes: sections.map((s) => s.type),
  }));

  return res.json(list);
};

module.exports = { getExamsList };
