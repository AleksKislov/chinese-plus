const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  userName: { type: String }, // user name
  title: { type: String, required: true },
  desc: { type: String },
  cnSubs: [
    {
      start: String,
      dur: String,
      text: String,
    },
  ],
  pySubs: [{ type: String }], // pinyin
  ruSubs: [{ type: String }],
  chineseArr: [{ type: String }],
  tags: [{ type: String, lowercase: true }],
  length: { type: Number },
  lvl: { type: Number, required: true },
  picUrl: { type: String },
  isApproved: { type: Number }, // by admin or moderator, 1 or 0
  hits: { type: Number, default: 1 }, // number of visits
  categoryInd: { type: Number, default: 0 },
  commentsId: [
    {
      comment: {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    },
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      name: { type: String },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = Video = mongoose.model("video", VideoSchema);
