const { apiDecorator } = require('../../api-decorator');

const { updateWord } = require('./update-word');
const { getEditedWords } = require('./get-edited-words');
const { wildcardSearch } = require('./wildcard-search');
const { pinyinSearch } = require('./pinyin-search');
const { handwritingSearch } = require('./handwriting-search');
const { getSitemapWords } = require('./get-sitemap-words');
const { getTranslation } = require('./get-translation');
const {
  getWordForEdit,
  editWord,
  deleteWordTranslation,
  addWord,
  rollbackWord,
} = require('./edit-word');

module.exports = {
  updateWord: apiDecorator(updateWord),
  getEditedWords: apiDecorator(getEditedWords),
  wildcardSearch: apiDecorator(wildcardSearch),
  pinyinSearch: apiDecorator(pinyinSearch),
  handwritingSearch: apiDecorator(handwritingSearch),
  getSitemapWords: apiDecorator(getSitemapWords),
  getTranslation: apiDecorator(getTranslation),
  getWordForEdit: apiDecorator(getWordForEdit),
  editWord: apiDecorator(editWord),
  deleteWordTranslation: apiDecorator(deleteWordTranslation),
  addWord: apiDecorator(addWord),
  rollbackWord: apiDecorator(rollbackWord),
};
