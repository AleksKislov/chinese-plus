const { apiDecorator } = require("../../api-decorator");

const { getById } = require("./get-by-id");

module.exports = {
  getById: apiDecorator(getById),
};
