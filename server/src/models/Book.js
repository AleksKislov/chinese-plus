const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    ru: { type: String, default: null },
    cn: { type: String, default: null },
  },
  year: { type: Number },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'bookauthors',
  },
  isChinese: { type: Boolean }, // originally Chinese book or not
  length: { type: Number, default: 0 }, // total quantity of characters
  about: {
    type: String,
    required: true,
  },
  genres: [{ type: String, lowercase: true }], // tags
  picUrl: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Book = mongoose.model('books', BookSchema);
