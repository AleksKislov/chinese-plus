const mongoose = require('mongoose');

// new hsk vocab lvls 1 to 7,8,9
const HskwordSchema = new mongoose.Schema({
  id: { type: Number },
  lvl: { type: String }, // aka band
  cn: { type: String },
  ru: { type: String },
  py: { type: String },
  opt: { type: String },
});

module.exports = Hskword = mongoose.model('hskword', HskwordSchema);
