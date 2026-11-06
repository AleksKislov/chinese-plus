const Hskword = require('../../../models/Hskword');
const Hskword2025 = require('../../../models/Hskword2025');
const { attachSenses } = require('../dictionary/translations/attach-senses');

const isLegacy = (version) => String(version) === '2021';

// `version=2021` -> old list, anything else -> current (2025) list; neither keeps a translation:
// the parsed `senses` of the word's dictionary entry (`dictId`) are added
const aggregateHskWords = (version, stages) =>
  (isLegacy(version) ? Hskword : Hskword2025)
    .aggregate([...stages, { $project: { ru: 0 } }])
    .then((words) => attachSenses(words, { idField: 'dictId' }));

module.exports = { aggregateHskWords, isLegacy };
