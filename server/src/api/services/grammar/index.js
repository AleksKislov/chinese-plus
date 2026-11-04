const { apiDecorator } = require('../../api-decorator');

const { getGrammarLevels } = require('./get-grammar-levels');
const { getGrammarByLevel } = require('./get-grammar-by-level');
const { getGrammarTopic } = require('./get-grammar-topic');
const { getGrammarSlugs } = require('./get-grammar-slugs');
const { deleteAudio } = require('./delete-audio');

module.exports = {
  getGrammarLevels: apiDecorator(getGrammarLevels),
  getGrammarByLevel: apiDecorator(getGrammarByLevel),
  getGrammarTopic: apiDecorator(getGrammarTopic),
  getGrammarSlugs: apiDecorator(getGrammarSlugs),
  deleteAudio: apiDecorator(deleteAudio),
};
