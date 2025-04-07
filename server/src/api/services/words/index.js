const { apiDecorator } = require('../../api-decorator');

const { downloadUserOldHskCsv } = require('./download-user-old-hsk-csv');

module.exports = {
  downloadUserOldHskCsv: apiDecorator(downloadUserOldHskCsv),
};
