const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookauthorSchema = new Schema({
  name: {
    ru: { type: String, default: null },
    cn: { type: String, default: null },
  },
  year: {
    born: { type: Number },
    dead: { type: Number, default: null },
  },
  about: { type: String },
  country: { type: String, default: null },
});

module.exports = Bookauthor = mongoose.model('bookauthors', BookauthorSchema);
