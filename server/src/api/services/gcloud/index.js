const { apiDecorator } = require("../../api-decorator");

const { getYtInfo } = require("./get-yt-info");
const { getYtSubs } = require("./get-yt-subs");

module.exports = {
  getYtInfo: apiDecorator(getYtInfo),
  getYtSubs: apiDecorator(getYtSubs),
};
