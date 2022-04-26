const { apiDecorator } = require("../../api-decorator");

const { getDfAnswer } = require("./get-df-answer");
const { getYtInfo } = require("./get-yt-info");
const { getYtSubs } = require("./get-yt-subs");

module.exports = {
  getYtSubs: apiDecorator(getYtSubs),
  getYtInfo: apiDecorator(getYtInfo),
  getDfAnswer: apiDecorator(getDfAnswer),
};
