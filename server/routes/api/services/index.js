const { updateOrCreate, fetchReading } = require('./updateOrCreate');
const { translateRuText } = require('./translateRuText');
const { getAllWords } = require('./getAllWords');
const { getWordsForParag } = require('./getWordsForParag');
const { encodeJWT } = require('./encodeJWT');
const { shortenTranslation } = require('./shortenTranslation');

module.exports = {
  encodeJWT,
  getAllWords,
  updateOrCreate,
  fetchReading,
  translateRuText,
  getWordsForParag,
  shortenTranslation,
};
