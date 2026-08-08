const { apiDecorator } = require('../../api-decorator');

const { updateWord } = require('./update-word');
const { rollbackUpdate } = require('./rollback-update');
const { getEditedWords } = require('./get-edited-words');
const { wildcardSearch } = require('./wildcard-search');
const { pinyinSearch } = require('./pinyin-search');
const { handwritingSearch } = require('./handwriting-search');

module.exports = {
  updateWord: apiDecorator(updateWord),
  rollbackUpdate: apiDecorator(rollbackUpdate),
  getEditedWords: apiDecorator(getEditedWords),
  wildcardSearch: apiDecorator(wildcardSearch),
  pinyinSearch: apiDecorator(pinyinSearch),
  handwritingSearch: apiDecorator(handwritingSearch),
};
