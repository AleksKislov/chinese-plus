const { apiDecorator } = require("../../api-decorator");

const { getYtInfo } = require("./get-yt-info");

module.exports = {
  getYtInfo: apiDecorator(getYtInfo),
};
