const Hskword = require('../../../models/Hskword');
const Hskword2025 = require('../../../models/Hskword2025');
const Dictionary = require('../../../models/Dictionary');

const isLegacy = (version) => String(version) === '2021';

// 2025 words keep no translation; join `ru` from the dictionary entry
const dictLookup = () => [
  {
    $lookup: {
      from: Dictionary.collection.name,
      localField: 'dictId',
      foreignField: '_id',
      pipeline: [{ $project: { russian: 1 } }],
      as: 'dict',
    },
  },
  { $addFields: { ru: { $ifNull: [{ $arrayElemAt: ['$dict.russian', 0] }, ''] } } },
  { $project: { dict: 0, dictId: 0 } },
];

// `version=2021` -> old list, anything else -> current (2025) list
const aggregateHskWords = (version, stages) =>
  isLegacy(version)
    ? Hskword.aggregate(stages)
    : Hskword2025.aggregate([...stages, ...dictLookup()]);

module.exports = { aggregateHskWords, isLegacy };
