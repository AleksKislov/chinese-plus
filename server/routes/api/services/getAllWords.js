const Dictionary = require('../../../src/models/Dictionary');

const getAllWords = (arr) =>
  Dictionary.find({ chinese: { $in: arr } }).select('-date -edited -previous -date -updatedAt');

module.exports = { getAllWords };
