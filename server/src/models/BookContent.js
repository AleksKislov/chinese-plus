const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookContentSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'books',
  },
  // partOf: {},
  ind: {
    type: Number, // index of content in book, 0 - prologue, 1 - chapter 1, 2 - chapter 2, etc.
    required: true,
  },
  // length: { type: Number, default: 0 }, // total quantity of characters
  title: {
    ru: { type: String, default: null },
    cn: { type: String, default: null },
  },
});

module.exports = BookContent = mongoose.model('bookcontents', BookContentSchema);
