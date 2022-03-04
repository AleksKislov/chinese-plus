const { apiDecorator } = require("../../api-decorator");

const { updateTxt } = require("./update");
const { createTxt } = require("./create");
const { getTextsPerUserStats } = require("./get-texts-per-user-stats");
const { getAllApprovedTexts } = require("./get-all-approved-texts");
const { deleteComment } = require("./delete-comment");

module.exports = {
  createTxt: apiDecorator(createTxt),
  updateTxt: apiDecorator(updateTxt),
  getTextsPerUserStats: apiDecorator(getTextsPerUserStats),
  getAllApprovedTexts: apiDecorator(getAllApprovedTexts),
  deleteComment: apiDecorator(deleteComment),
};
