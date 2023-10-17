const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  title: { type: String, required: true },
  desc: { type: String },
  category: {
    type: String,
    enum: ["misc", "song", "ads", "cartoon", "science", "documentary", "news"],
    default: "misc",
  },
  cnSubs: [
    {
      start: String,
      dur: String,
      text: String,
    },
  ],
  pySubs: [{ type: String }], // pinyin
  ruSubs: [{ type: String }],
  chineseArr: [{ type: Array }], // [['你好', '吗', '?', '\n'], ['很', '好']]
  tags: [{ type: String, lowercase: true }],
  length: { type: Number },
  lvl: { type: Number, required: true },
  source: { type: String }, // youtube id
  isApproved: { type: Number }, // by admin or moderator, 1 or 0
  hits: { type: Number, default: 1 }, // number of visits
  comments_id: [
    {
      comment: {
        type: Schema.Types.ObjectId,
        ref: "comment",
      },
    },
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      name: { type: String },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = Video = mongoose.model("video", VideoSchema);
