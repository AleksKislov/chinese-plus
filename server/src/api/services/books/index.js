const { apiDecorator } = require('../../api-decorator');
const { createPages } = require('./create-pages');
const { getPage } = require('./get-page');
const { updateBookPage } = require('./update');
const { getBookPageById } = require('./get-book-page-by-id');
const { createBook } = require('./create-book');
const { createAuthor } = require('./create-author');

module.exports = {
  createPages: apiDecorator(createPages),
  getPage: apiDecorator(getPage),
  updateBookPage: apiDecorator(updateBookPage),
  getBookPageById: apiDecorator(getBookPageById),
  createBook: apiDecorator(createBook),
  createAuthor: apiDecorator(createAuthor),
};
