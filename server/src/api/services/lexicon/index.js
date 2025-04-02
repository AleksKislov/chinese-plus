const { apiDecorator } = require('../../api-decorator');

const { getHskByLvlAndLimit } = require('./get-hsk-by-lvl-and-limit');
const { getRandomHskByLvl } = require('./get-random-hsk-by-lvl');
const { searchHsk } = require('./search-hsk');
const { downloadOldHskCsv } = require('./download-old-hsk-csv');

module.exports = {
  searchHsk: apiDecorator(searchHsk),
  getRandomHskByLvl: apiDecorator(getRandomHskByLvl),
  getHskByLvlAndLimit: apiDecorator(getHskByLvlAndLimit),
  downloadOldHskCsv: apiDecorator(downloadOldHskCsv),
};
