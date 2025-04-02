const { apiDecorator } = require('../../api-decorator');

const { downloadUserDictWordsCsv } = require('./download-user-words-csv');

module.exports = {
  downloadUserDictWordsCsv: apiDecorator(downloadUserDictWordsCsv),
};
