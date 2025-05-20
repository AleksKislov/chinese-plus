const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookauthorSchema = new Schema({
  name: {
    ru: { type: String, default: null },
    cn: { type: String, default: null },
  },
  year: {
    born: { type: Number },
    dead: { type: Number, default: true },
  },
  about: { type: String },
  isChinese: { type: Boolean },
});

module.exports = Bookauthor = mongoose.model('bookauthors', BookauthorSchema);
