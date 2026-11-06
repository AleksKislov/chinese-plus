const { apiDecorator } = require('../../api-decorator');

const {
  getUserHsk3Words,
  getUserHsk3WordIds,
  countUserHsk3Words,
  addUserHsk3Word,
  removeUserHsk3Word,
} = require('./user-hsk3-words');
const { downloadUserHsk3Csv } = require('./download-user-hsk3-csv');

module.exports = {
  getUserHsk3Words: apiDecorator(getUserHsk3Words),
  getUserHsk3WordIds: apiDecorator(getUserHsk3WordIds),
  countUserHsk3Words: apiDecorator(countUserHsk3Words),
  addUserHsk3Word: apiDecorator(addUserHsk3Word),
  removeUserHsk3Word: apiDecorator(removeUserHsk3Word),
  downloadUserHsk3Csv: apiDecorator(downloadUserHsk3Csv),
};
