const { apiDecorator } = require('../../api-decorator');

const { getRuWords, getRuWordsByCn } = require('./get-ru-words');
const { getRuWord } = require('./get-ru-word');
const { findRuWordSlug } = require('./ru-words-data');

module.exports = {
  getRuWords: apiDecorator(getRuWords),
  getRuWordsByCn: apiDecorator(getRuWordsByCn),
  getRuWord: apiDecorator(getRuWord),
  findRuWordSlug,
};
