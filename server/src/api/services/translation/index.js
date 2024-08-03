const { apiDecorator } = require('../../api-decorator');

const { getPics } = require('./get-pics');
const { getTranslation } = require('./get-translation');

module.exports = {
  getTranslation: apiDecorator(getTranslation),
  getPics: apiDecorator(getPics),
};
