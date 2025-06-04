const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookPageSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'books',
  },
  belongsTo: {
    type: Schema.Types.ObjectId,
    ref: 'bookcontents',
  },
  ind: {
    type: Number, // page index in book content
    required: true,
  },
  length: { type: Number, default: 0 }, // total quantity of characters
  origintext: [{ type: String }],
  translation: [{ type: String }],
  chinese_arr: [{ type: String }],
  comments_id: [
    {
      comment: {
        type: Schema.Types.ObjectId,
        ref: 'comment',
      },
    },
  ],
});

module.exports = BookPage = mongoose.model('bookpages', BookPageSchema);
