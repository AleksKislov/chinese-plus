const { apiDecorator } = require('../../api-decorator');

const { getExamsList } = require('./get-exams-list');
const { getExamBySlug } = require('./get-exam-by-slug');
const { setApproved } = require('./set-approved');
const { uploadHskExamImage } = require('./upload-image');
const { deleteHskExamImage } = require('./delete-image');

module.exports = {
  getExamsList: apiDecorator(getExamsList),
  getExamBySlug: apiDecorator(getExamBySlug),
  setApproved: apiDecorator(setApproved),
  uploadHskExamImage: apiDecorator(uploadHskExamImage),
  deleteHskExamImage: apiDecorator(deleteHskExamImage),
};
