const mongoose = require("mongoose");
const NoticeSchema = new mongoose.Schema({
  text: { type: String },
  display: { type: Boolean }
});

module.exports = Notice = mongoose.model("notice", NoticeSchema);
