const Dictionary = require("../../../src/models/Dictionary");

const getAllWords = async (arr) =>
  await Dictionary.find({ chinese: { $in: arr } }).select("-date -edited");

module.exports = { getAllWords };
