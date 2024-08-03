const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChapterpageSchema = new Schema({
  chapter: { type: Number }, // chapter in book.contents
  book: {
    type: Schema.Types.ObjectId,
    ref: 'books',
  }, // book this page belongs to
  page_number: { type: Number },
  origintext: [{ type: String }],
  translation: [{ type: String }],
  // wordsarr: [{ type: Array }], unneccessary
  chinese_arr: [{ type: String }],
  length: { type: Number },
  comments_id: [
    {
      comment: {
        type: Schema.Types.ObjectId,
        ref: 'comments',
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Chapterpage = mongoose.model('chapterpage', ChapterpageSchema);
