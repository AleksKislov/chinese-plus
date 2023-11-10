const { validationResult } = require("express-validator");

const Video = require("../../../models/Video");
const { Notify } = require("../_misc");
const { shortUserInfoFields } = require("../../consts");

async function createVideo(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, desc, lvl, tags, cnSubs, pySubs, ruSubs, length, chineseArr, category, source } =
    req.body;

  const newVideo = new Video({
    title,
    desc,
    lvl,
    tags,
    cnSubs,
    pySubs,
    ruSubs,
    length,
    chineseArr,
    category,
    source,
    isApproved: 0,
    user: req.user.id,
  });

  const video = await newVideo.save();
  const resultVid = await Video.findById(video._id).populate("user", shortUserInfoFields);

  Notify.admin(`New VIDEO from ${resultVid.user.name}. Title: ${title}`);
  return res.json(resultVid);
}

module.exports = { createVideo };
