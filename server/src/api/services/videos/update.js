const { validationResult } = require("express-validator");
// const { notifyMe } = require("../_misc");

const Video = require("../../../models/Video");

async function updateVideo(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    videoId,
    isApproved,
    title,
    length,
    desc,
    lvl,
    tags,
    category,
    source,
    chineseArr,
    pySubs,
    ruSubs,
    // cnSubs,
  } = req.body;

  let newFields = {};
  if (title) newFields.title = title;
  if (length) newFields.length = length;
  if (desc) newFields.desc = desc;
  if (lvl) newFields.lvl = lvl;
  if (tags) newFields.tags = tags;
  if (category) newFields.category = category;
  if (isApproved) newFields.isApproved = isApproved;
  if (source) newFields.source = source;
  if (chineseArr) newFields.chineseArr = chineseArr;
  if (pySubs) newFields.pySubs = pySubs;
  if (ruSubs) newFields.ruSubs = ruSubs;
  // if (cnSubs) newFields.cnSubs = cnSubs;

  await Video.findByIdAndUpdate(videoId, { $set: newFields }, { new: true });
  return res.json({ status: "done" });
}

module.exports = { updateVideo };
