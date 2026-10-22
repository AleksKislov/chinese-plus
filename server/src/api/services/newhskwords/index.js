const { apiDecorator } = require('../../api-decorator');

const { getAudio } = require('./get-audio');
const { getNewHskByLvlAndLimit } = require('./get-new-hsk-by-lvl-and-limit');
const { getRandomNewHskByLvl } = require('./get-random-new-hsk-by-lvl');
const { searchNewHsk } = require('./search-new-hsk');
const { downloadNewHskCsv } = require('./download-new-hsk-csv');
const { getHskLevels } = require('./get-hsk-levels');

module.exports = {
  getRandomNewHskByLvl: apiDecorator(getRandomNewHskByLvl),
  getNewHskByLvlAndLimit: apiDecorator(getNewHskByLvlAndLimit),
  searchNewHsk: apiDecorator(searchNewHsk),
  getAudio: apiDecorator(getAudio),
  downloadNewHskCsv: apiDecorator(downloadNewHskCsv),
  getHskLevels: apiDecorator(getHskLevels),
};
