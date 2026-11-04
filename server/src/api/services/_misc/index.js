const { countZnChars, countUniqChars } = require('./count-zn-chars');
const { Notify } = require('./notify');
const { markupTranslation } = require('./mark-up-translation');
const { getDictWordsCsv } = require('./get-dict-words-csv');
const { CHARS_PER_PAGE } = require('./consts');
const { getBookChineseArr } = require('./get-book-chinese-arr');
const { s3 } = require('./s3-client');
const { getUserPrivileges } = require('./get-user-privileges');

module.exports = {
  Notify,
  countZnChars,
  markupTranslation,
  getDictWordsCsv,
  CHARS_PER_PAGE,
  getBookChineseArr,
  countUniqChars,
  s3,
  getUserPrivileges,
};
