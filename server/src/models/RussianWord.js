const mongoose = require('mongoose');

const RussianWordSchema = new mongoose.Schema({
  cn: { type: String },
  ru: { type: String },
});

module.exports = mongoose.model('RussianWord', RussianWordSchema, 'russianwords');
