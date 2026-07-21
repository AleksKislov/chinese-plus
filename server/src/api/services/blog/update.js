const { validationResult } = require('express-validator');

const BlogPost = require('../../../models/BlogPost');
const { shortUserInfoFields } = require('../../consts');

async function updatePost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { postId, title, desc, text, tags, mainPicUrl, categoryInd, isApproved } = req.body;

  const post = await BlogPost.findById(postId);
  if (!post) return res.status(404).json({ msg: 'Blog post not found' });

  const isAdmin = req.user.id === process.env.ADMIN_ID;
  const isOwner = post.user.toString() === req.user.id;
  if (!isOwner && !isAdmin) return res.status(403).json({ msg: 'Not authorized' });

  const newFields = {};
  if (title) newFields.title = title;
  if (desc !== undefined) newFields.desc = desc;
  if (text !== undefined) newFields.text = text;
  if (tags) newFields.tags = tags;
  if (mainPicUrl) newFields.mainPicUrl = mainPicUrl;
  if (categoryInd !== undefined) newFields.categoryInd = categoryInd;
  if (isAdmin && [0, 1].includes(isApproved)) newFields.isApproved = isApproved;

  const updatedPost = await BlogPost.findByIdAndUpdate(
    postId,
    { $set: newFields },
    { new: true },
  ).populate('user', shortUserInfoFields);

  return res.json(updatedPost);
}

module.exports = { updatePost };
