const { validationResult } = require("express-validator");

const Video = require("../../../models/Video");
const { notifyMe } = require("../_misc");

async function createVideo(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    title,
    desc,
    lvl,
    tags,
    cnSubs,
    pySubs,
    ruSubs,
    length,
    chineseArr,
    userName,
    category,
    source,
  } = req.body;

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
    userName,
    category,
    source,
    isApproved: 0,
    user: req.user.id,
  });

  const video = await newVideo.save();
  notifyMe(`New VIDEO from ${userName}. Title: ${title}`);
  return res.json(video);
}

module.exports = { createVideo };
