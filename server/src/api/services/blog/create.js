const { validationResult } = require('express-validator');
const { Notify } = require('../_misc');

const BlogPost = require('../../../models/BlogPost');
const { shortUserInfoFields } = require('../../consts');

async function createPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, desc, text, tags, mainPicUrl, categoryInd } = req.body;

  const newPost = new BlogPost({
    title,
    desc,
    text,
    tags,
    mainPicUrl,
    categoryInd,
    isApproved: 0,
    user: req.user.id,
  });

  const post = await newPost.save();
  const resultPost = await BlogPost.findById(post._id).populate('user', shortUserInfoFields);

  Notify.admin(`Новый пост в блоге от ${resultPost.user.name}. Заголовок: ${title}`);
  return res.json(resultPost);
}

module.exports = { createPost };
