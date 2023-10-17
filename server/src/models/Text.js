const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TextSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  title: { type: String, required: true },
  // belongsToLongText: { type: Schema.Types.ObjectId, ref: "longtexts" },
  description: { type: String },
  origintext: [{ type: String }],
  translation: [{ type: String }],
  chinese_arr: [{ type: String }],
  tags: [{ type: String, lowercase: true }],
  length: { type: Number },
  level: { type: Number, required: true },
  name: { type: String }, // user name deprecated
  pic_url: { type: String },
  theme_word: { type: String },
  isApproved: { type: Number }, // by admin or moderator, 1 or 0
  hits: { type: Number, default: 1 }, // number of visits
  source: { type: String },
  audioSrc: { type: Number, default: 0 }, // yes or no
  categoryInd: { type: Number, default: 0 }, // index for textCategories array (on frontend) below
  comments_id: [
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
  pages: [
    {
      origintext: [{ type: String }],
      chinese_arr: [{ type: String }],
      translation: [{ type: String }],
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = Text = mongoose.model("text", TextSchema);

// textCategories: [
//   "Учебные и HSK",
//   "Детское",
//   "Документы и бизнес",
//   "Новости",
//   "Наука",
//   "Лит-ра, песни и поэзия",
//   "Познавательное",
//   "Вэньянь"
// ]
