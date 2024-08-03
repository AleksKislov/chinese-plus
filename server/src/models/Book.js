const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  chineseTitle: {
    type: String,
    required: true,
  },
  russianTitle: { type: String },
  year: { type: Number },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'bookauthors',
  },
  authorName: {
    nameRus: { type: String },
    nameChinese: { type: String },
  },
  isChinese: { type: Boolean }, // originally Chinese book or not
  length: { type: Number, default: 0 }, // total quantity of characters
  contents: [
    {
      type: Object,
    },
  ],
  annotation: {
    type: String,
    required: true,
  },
  genre: [{ type: String, lowercase: true }], // tags
  pictureUrl: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Book = mongoose.model('book', BookSchema);
