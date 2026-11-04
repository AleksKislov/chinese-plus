const Dictionary = require('../../../src/models/Dictionary');

const getAllWords = (arr) =>
  Dictionary.find({ $or: [{ chinese: { $in: arr } }, { tradChinese: { $in: arr } }] }).select(
    '-date -edited -previous -date -updatedAt',
  );

module.exports = { getAllWords };
