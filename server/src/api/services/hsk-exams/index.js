const { apiDecorator } = require('../../api-decorator');

const { getExamsList } = require('./get-exams-list');
const { getExamBySlug } = require('./get-exam-by-slug');

module.exports = {
  getExamsList: apiDecorator(getExamsList),
  getExamBySlug: apiDecorator(getExamBySlug),
};
