const { apiDecorator } = require('../../api-decorator');

const { getNames } = require('./get-names');
const { getName } = require('./get-name');
const { findNameSlug } = require('./names-data');

module.exports = {
  getNames: apiDecorator(getNames),
  getName: apiDecorator(getName),
  findNameSlug,
};
