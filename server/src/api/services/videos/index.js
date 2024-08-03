const { apiDecorator } = require('../../api-decorator');

const { deleteComment } = require('./delete-comment');
const { createVideo } = require('./create-video');
const { getAllApprovedVids } = require('./get-all-approved-videos');
const { getById } = require('./get-by-id');
const { getNotApprovedVids } = require('./get-not-approved-vids');
const { likeVideo } = require('./like-video');
const { markAsSeen } = require('./mark-as-seen');
const { getVidsInChunks } = require('./get-vids-in-chunks');
const { updateVideo } = require('./update');
const { getVideosNum } = require('./get-videos-num');
const { getMarkedVideos } = require('./get-marked-videos');
const { getByUserId } = require('./get-by-user-id');
const { getAllVideoLessons } = require('./get-all-video-lessons');
const { getVideoLessonById } = require('./get-video-lesson-by-id');
const { likeVideoLesson } = require('./like-phonetics-video');
const { deleteVideo } = require('./delete-video');

module.exports = {
  getVideosNum: apiDecorator(getVideosNum),
  updateVideo: apiDecorator(updateVideo),
  getVidsInChunks: apiDecorator(getVidsInChunks),
  markAsSeen: apiDecorator(markAsSeen),
  deleteVideo: apiDecorator(deleteVideo),
  deleteComment: apiDecorator(deleteComment),
  likeVideo: apiDecorator(likeVideo),
  getNotApprovedVids: apiDecorator(getNotApprovedVids),
  getById: apiDecorator(getById),
  createVideo: apiDecorator(createVideo),
  getAllApprovedVids: apiDecorator(getAllApprovedVids),
  getMarkedVideos: apiDecorator(getMarkedVideos),
  getByUserId: apiDecorator(getByUserId),
  getAllVideoLessons: apiDecorator(getAllVideoLessons),
  getVideoLessonById: apiDecorator(getVideoLessonById),
  likeVideoLesson: apiDecorator(likeVideoLesson),
};
