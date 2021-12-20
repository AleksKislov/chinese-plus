const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookauthorSchema = new Schema({
  nameRus: { type: String },
  nameChinese: { type: String },
  yearBorn: { type: Number },
  yearDead: { type: Number },
  about: { type: String },
  pictureUrl: { type: String },
  isChinese: { type: Boolean },
  books: [
    {
      book: {
        type: Schema.Types.ObjectId,
        ref: "books"
      }
    }
  ]
});

module.exports = Bookauthor = mongoose.model("bookauthor", BookauthorSchema);
