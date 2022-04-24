const { apiDecorator } = require("../../api-decorator");

const { getDfAnswer } = require("./getDfAnswer");

module.exports = {
  getDfAnswer: apiDecorator(getDfAnswer),
};
