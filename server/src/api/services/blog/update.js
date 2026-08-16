const { Notify, getUserPrivileges } = require('../_misc');
const { hasMeaningfulContent } = require('./_content-helpers');

const BlogPost = require('../../../models/BlogPost');
const { shortUserInfoFields } = require('../../consts');

async function updatePost(req, res) {
  const { postId, title, content, tags, category, isApproved } = req.body;

  if (content !== undefined && !hasMeaningfulContent(content)) {
    return res.status(400).json({ msg: 'Нужна хотя бы картинка или текст' });
  }

  const post = await BlogPost.findById(postId);
  if (!post) return res.status(404).json({ msg: 'Blog post not found' });

  const { isAdmin, isModerator } = await getUserPrivileges(req.user.id);
  const canModerate = isAdmin || isModerator;
  const isOwner = post.user.toString() === req.user.id;
  if (!isOwner && !canModerate) return res.status(403).json({ msg: 'Not authorized' });

  const newFields = {};
  if (title) newFields.title = title;
  if (content !== undefined) newFields.content = content;
  if (tags) newFields.tags = tags;
  if (category) newFields.category = category;
  if (canModerate && [0, 1].includes(isApproved)) newFields.isApproved = isApproved;

  const updatedPost = await BlogPost.findByIdAndUpdate(
    postId,
    { $set: newFields },
    { new: true },
  ).populate('user', shortUserInfoFields);

  if (!post.isApproved && newFields.isApproved) {
    Notify.socialMedia(updatedPost);
  }

  return res.json(updatedPost);
}

module.exports = { updatePost };
