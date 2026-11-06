const mongoose = require('mongoose');

// new hsk vocab lvls 1 to 7,8,9 (the 2021 list); the translation is the parsed one of the
// dictionary entry `dictId` (its own copy `ru` is in deprecated_hskwords_ru,
// see scripts/link-hsk2021-to-dictionary.js)
const HskwordSchema = new mongoose.Schema({
  id: { type: Number },
  lvl: { type: String }, // aka band
  cn: { type: String },
  py: { type: String },
  opt: { type: String },
  dictId: { type: mongoose.Schema.Types.ObjectId, ref: 'dictionary' },
});

module.exports = Hskword = mongoose.model('hskword', HskwordSchema);
