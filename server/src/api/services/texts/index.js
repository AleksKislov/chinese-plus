const { apiDecorator } = require('../../api-decorator');

const { updateTxt } = require('./update');
const { createTxt } = require('./create');
const { getTextsPerUserStats } = require('./get-texts-per-user-stats');
const { getAllApprovedTexts } = require('./get-all-approved-texts');
const { deleteComment } = require('./delete-comment');
const { getById } = require('./get-by-id');
const { getByUserId } = require('./get-by-user-id');
const { getTextsNum } = require('./get-texts-num');
const { getNotApprovedTexts } = require('./get-not-approved-texts');
const { getTextsInChunks } = require('./get-texts-in-chunks');
const { likeText } = require('./like-text');
const { markAsRead } = require('./mark-as-read');
const { markAsNotRead } = require('./mark-as-not-read');
const { deleteText } = require('./delete-text');
const { getMarkedTexts } = require('./get-marked-texts');
const { editChineseArr } = require('./edit-chinese-arr');
const { getSimilarTexts } = require('./get-similar-texts');

module.exports = {
  markAsNotRead: apiDecorator(markAsNotRead),
  markAsRead: apiDecorator(markAsRead),
  likeText: apiDecorator(likeText),
  getTextsInChunks: apiDecorator(getTextsInChunks),
  getNotApprovedTexts: apiDecorator(getNotApprovedTexts),
  getTextsNum: apiDecorator(getTextsNum),
  createTxt: apiDecorator(createTxt),
  updateTxt: apiDecorator(updateTxt),
  getTextsPerUserStats: apiDecorator(getTextsPerUserStats),
  getAllApprovedTexts: apiDecorator(getAllApprovedTexts),
  deleteComment: apiDecorator(deleteComment),
  getById: apiDecorator(getById),
  getByUserId: apiDecorator(getByUserId),
  deleteText: apiDecorator(deleteText),
  getMarkedTexts: apiDecorator(getMarkedTexts),
  editChineseArr: apiDecorator(editChineseArr),
  getSimilarTexts: apiDecorator(getSimilarTexts),
};
