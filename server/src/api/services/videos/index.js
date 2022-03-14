const { apiDecorator } = require("../../api-decorator");

const { createVideo } = require("./create-video");
const { getById } = require("./get-by-id");

module.exports = {
  getById: apiDecorator(getById),
  createVideo: apiDecorator(createVideo),
};
