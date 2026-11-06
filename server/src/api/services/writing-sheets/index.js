const { apiDecorator } = require('../../api-decorator');

const { getHskChars } = require('./get-hsk-chars');
const { getChars } = require('./get-chars');

module.exports = {
  getHskChars: apiDecorator(getHskChars),
  getChars: apiDecorator(getChars),
};
