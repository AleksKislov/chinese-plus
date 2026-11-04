const BlogPost = require('../../../models/BlogPost');
const { shortUserInfoFields } = require('../../consts');

async function getAllApproved(req, res) {
  const { skip, limit, category, tag } = req.query;
  const skipNum = skip && /^\d+$/.test(skip) ? +skip : 0;
  const limitNum = limit && /^\d+$/.test(limit) ? +limit : 10;

  const qry = { isApproved: 1 };
  if (category) qry.category = category;
  if (tag) qry.tags = tag.toLowerCase();

  const posts = await BlogPost.find(qry, undefined, { skip: skipNum, limit: limitNum })
    .sort({ date: -1 })
    .populate('user', shortUserInfoFields);

  return res.json(posts);
}

module.exports = { getAllApproved };
