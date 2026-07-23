const { apiDecorator } = require('../../api-decorator');
const { getWord } = require('./get-word');

module.exports = {
  getWord: apiDecorator(getWord),
};
