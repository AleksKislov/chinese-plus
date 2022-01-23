const mongoose = require("mongoose");
const HskwordSchema = new mongoose.Schema({
  id: { type: String },
  lvl: { type: String }, // aka band
  cn: { type: String },
  ru: { type: String },
  py: { type: String },
  opt: { type: String },
});

module.exports = Hskword = mongoose.model("hskword", HskwordSchema);
