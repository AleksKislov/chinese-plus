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
  about: {
    type: String,
    required: true,
  },
  genres: [{ type: String, lowercase: true }], // tags
  picUrl: { type: String },
  translationSrc: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = Book = mongoose.model('books', BookSchema);
