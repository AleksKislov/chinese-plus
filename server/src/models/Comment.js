const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  post_id: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
  destination: { type: String }, // WHERE a comment sits
  path: { type: String },
  text: {
    type: String,
    required: true,
  },
  addressees: { type: Array },
  // deprecated
  name: {
    type: String,
  },
  // deprecated
  avatar: {
    type: String,
  },
  commentIdToReply: { type: Object }, // {commentId, userId, name} - info about comment we are replying to
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      name: { type: String },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Comment = mongoose.model("comment", CommentSchema);
