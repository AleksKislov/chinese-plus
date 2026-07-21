const BlogPost = require('../../../models/BlogPost');
const { shortUserInfoFields } = require('../../consts');

async function getAllApproved(req, res) {
  const { skip, categoryInd, tag } = req.query;
  const skipNum = skip && /^\d+$/.test(skip) ? +skip : 0;

  const qry = { isApproved: 1 };
  if (categoryInd) qry.categoryInd = +categoryInd;
  if (tag) qry.tags = tag.toLowerCase();

  const posts = await BlogPost.find(qry, undefined, { skip: skipNum, limit: 10 })
    .sort({ date: -1 })
    .select('-text')
    .populate('user', shortUserInfoFields);

  return res.json(posts);
}

module.exports = { getAllApproved };
