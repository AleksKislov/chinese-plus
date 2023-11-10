const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoLessonSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  title: { type: String, required: true },
  desc: { type: String },
  category: {
    type: String,
    enum: ["phonetics", "characters"],
    default: "misc",
  },
  tags: [{ type: String, lowercase: true }],
  lvl: { type: Number, default: 0 },
  source: { type: String }, // youtube id
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

module.exports = VideoLesson = mongoose.model("videolesson", VideoLessonSchema);
