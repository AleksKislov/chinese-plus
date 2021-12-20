const Dictionary = require("../../../src/models/Dictionary");

const getAllWords = async arr => await Dictionary.find({ chinese: { $in: arr } });

module.exports = { getAllWords };
