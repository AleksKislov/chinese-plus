const { apiDecorator } = require('../../api-decorator');

const { getHskByLvlAndLimit } = require('./get-hsk-by-lvl-and-limit');
const { getRandomHskByLvl } = require('./get-random-hsk-by-lvl');
const { searchHsk } = require('./search-hsk');

module.exports = {
  searchHsk: apiDecorator(searchHsk),
  getRandomHskByLvl: apiDecorator(getRandomHskByLvl),
  getHskByLvlAndLimit: apiDecorator(getHskByLvlAndLimit),
};
