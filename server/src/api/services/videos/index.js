const { apiDecorator } = require("../../api-decorator");

const { deleteComment } = require("./delete-comment");
const { createVideo } = require("./create-video");
const { getAllApprovedVids } = require("./get-all-approved-videos");
const { getById } = require("./get-by-id");
const { getNotApprovedVids } = require("./get-not-approved-vids");
const { likeVideo } = require("./like-video");
const { markAsSeen } = require("./mark-as-seen");

module.exports = {
  markAsSeen: apiDecorator(markAsSeen),
  deleteComment: apiDecorator(deleteComment),
  likeVideo: apiDecorator(likeVideo),
  getNotApprovedVids: apiDecorator(getNotApprovedVids),
  getById: apiDecorator(getById),
  createVideo: apiDecorator(createVideo),
  getAllApprovedVids: apiDecorator(getAllApprovedVids),
};
