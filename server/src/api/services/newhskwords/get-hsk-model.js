const Hskword = require('../../../models/Hskword');
const Hskword2025 = require('../../../models/Hskword2025');
const { attachSenses } = require('../dictionary/translations/attach-senses');

const isLegacy = (version) => String(version) === '2021';

// `version=2021` -> old list, with its own `ru` translation; anything else -> current (2025) list,
// which keeps no translation: the parsed `senses` of its dictionary entry (`dictId`) are added
const aggregateHskWords = (version, stages) =>
  isLegacy(version)
    ? Hskword.aggregate(stages)
    : Hskword2025.aggregate(stages).then((words) => attachSenses(words, { idField: 'dictId' }));

module.exports = { aggregateHskWords, isLegacy };
