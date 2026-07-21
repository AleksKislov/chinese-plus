const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  title: { type: String, required: true },
  desc: { type: String },
  text: { type: String },
  tags: [{ type: String, lowercase: true }],

  mainPicUrl: { type: String },
  isApproved: { type: Number }, // by admin or moderator, 1 or 0
  hits: { type: Number, default: 1 }, // number of visits

  categoryInd: { type: Number, default: 0 }, // index for textCategories array (on frontend) below
  comments_id: [
    {
      comment: {
        type: Schema.Types.ObjectId,
        ref: 'comment',
      },
    },
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      name: { type: String },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = BlogPost = mongoose.model('blogpost', BlogPostSchema);
