const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BLOG_CATEGORIES = [
  'general',
  'personal',
  'study',
  'culture',
  'club_news',
  'mini_post',
  'literature_poetry',
  'suggestion_bug',
  'history',
  'it_stuff',
  'food',
  'travel',
];
const BLOG_POST_TYPES = ['simple', 'article']; // simple: no tags/category, just title + picture(s) + optional text

// content is an ordered array of blocks, each shaped by its `type`:
//   { type: 'text', text }
//   { type: 'image', url, caption? }
//   { type: 'carousel', images: [{ url, caption? }] }
//   { type: 'video', url }                 // embeddable link (e.g. youtube)
//   { type: 'chinese', words: string[] }   // segmented tokens, tooltips resolved on read
// the cover image shown on cards is derived from the first image/carousel block, not stored separately
const BlogPostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  postType: { type: String, enum: BLOG_POST_TYPES, default: 'article' },
  title: { type: String, required: true },
  content: [{ type: Schema.Types.Mixed }],
  tags: [{ type: String, lowercase: true }],
  category: { type: String, enum: BLOG_CATEGORIES, default: 'general' },

  isApproved: { type: Number }, // by admin or moderator, 1 or 0
  hits: { type: Number, default: 1 }, // number of visits

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
module.exports.BLOG_CATEGORIES = BLOG_CATEGORIES;
module.exports.BLOG_POST_TYPES = BLOG_POST_TYPES;
