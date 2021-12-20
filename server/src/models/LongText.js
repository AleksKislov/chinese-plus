const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LongTextSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String, lowercase: true }],
  length: { type: Number },
  level: { type: Number, required: true },
  name: { type: String }, // user name
  pic_url: { type: String },
  theme_word: { type: String },
  isApproved: { type: Number }, // by admin or moderator, 1 is true, 0 is false
  hits: { type: Number, default: 1 }, // number of visits
  source: { type: String },
  categoryInd: { type: Number, default: 0 }, // index for textCategories array (on frontend) below
  comments_id: [
    {
      comment: {
        type: Schema.Types.ObjectId,
        ref: "comments"
      }
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      name: { type: String }
    }
  ],
  date: { type: Date, default: Date.now },
  pages: [
    {
      page: {
        type: Schema.Types.ObjectId,
        ref: "texts"
      }
    }
  ]
});

module.exports = LongText = mongoose.model("longtext", LongTextSchema);
