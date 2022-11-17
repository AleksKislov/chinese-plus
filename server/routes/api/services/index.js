const { updateOrCreate, fetchReading } = require("./updateOrCreate");
const { translateRuText } = require("./translateRuText");
const { getAllWords } = require("./getAllWords");
const { getWordsForParag } = require("./getWordsForParag");

module.exports = {
  getAllWords,
  updateOrCreate,
  fetchReading,
  translateRuText,
  getWordsForParag,
};
