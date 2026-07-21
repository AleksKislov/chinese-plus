const { apiDecorator } = require('../../api-decorator');

const { createPost } = require('./create');
const { updatePost } = require('./update');
const { deletePost } = require('./delete-post');
const { getById } = require('./get-by-id');
const { getAllApproved } = require('./get-all-approved');
const { getByUserId } = require('./get-by-user-id');
const { getNotApproved } = require('./get-not-approved');
const { uploadImage } = require('./upload-image');

module.exports = {
  createPost: apiDecorator(createPost),
  updatePost: apiDecorator(updatePost),
  deletePost: apiDecorator(deletePost),
  getById: apiDecorator(getById),
  getAllApproved: apiDecorator(getAllApproved),
  getByUserId: apiDecorator(getByUserId),
  getNotApproved: apiDecorator(getNotApproved),
  uploadImage: apiDecorator(uploadImage),
};
