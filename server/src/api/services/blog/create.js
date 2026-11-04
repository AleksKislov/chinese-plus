const { Notify } = require('../_misc');
const { hasMeaningfulContent } = require('./_content-helpers');

const BlogPost = require('../../../models/BlogPost');
const { shortUserInfoFields } = require('../../consts');

async function createPost(req, res) {
  const { title, content, tags, category, postType } = req.body;
  const isSimple = postType === 'simple';

  if (!(title || '').trim()) {
    return res.status(400).json({ msg: 'Нужен заголовок' });
  }
  if (!hasMeaningfulContent(content)) {
    return res.status(400).json({ msg: 'Нужна хотя бы картинка или текст' });
  }

  const newPost = new BlogPost({
    postType: isSimple ? 'simple' : 'article',
    title,
    content,
    tags: isSimple ? undefined : tags,
    category: isSimple ? 'mini_post' : category,
    isApproved: 0,
    user: req.user.id,
  });

  const post = await newPost.save();
  const resultPost = await BlogPost.findById(post._id).populate('user', shortUserInfoFields);

  Notify.admin(`Новый пост в блоге от ${resultPost.user.name}. Заголовок: ${title}`);
  return res.json(resultPost);
}

module.exports = { createPost };
