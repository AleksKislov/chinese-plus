const { updateOrCreate, fetchReading } = require("./updateOrCreate");
const { translateRuText } = require("./translateRuText");
const { getAllWords } = require("./getAllWords");

module.exports = {
  getAllWords,
  updateOrCreate,
  fetchReading,
  translateRuText,
};
