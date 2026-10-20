const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookContentSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'books',
  },
  ind: {
    type: Number, // index of content in book, 0 - prologue, 1 - chapter 1, 2 - chapter 2, etc.
    required: true,
  },
  // optional volume the chapter belongs to; `ind` above keeps running across volumes.
  // No defaults here: chapters of books without volumes must come back without `part`
  part: {
    ind: { type: Number }, // 1 - volume 1, 2 - volume 2, etc.
    title: {
      ru: { type: String },
      cn: { type: String },
    },
  },
  // length: { type: Number, default: 0 }, // total quantity of characters
  title: {
    ru: { type: String, default: null },
    cn: { type: String, default: null },
  },
});

module.exports = BookContent = mongoose.model('bookcontents', BookContentSchema);
