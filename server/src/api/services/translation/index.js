const { apiDecorator } = require("../../api-decorator");

const { getTranslation } = require("./get-translation");

module.exports = {
  getTranslation: apiDecorator(getTranslation),
};
