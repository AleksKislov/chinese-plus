const { validationResult } = require('express-validator');
const { Notify, getUserPrivileges } = require('../_misc');

const Video = require('../../../models/Video');
const { shortUserInfoFields } = require('../../consts');
const { parseRutubeUrl } = require('./rutube-id');

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
    cnSubs,
    rutubeUrl,
  } = req.body;

  let foundVid;
  if (isApproved) {
    foundVid = await Video.findById(videoId);
    if (!foundVid) throw new Error('No video to update');
  }

  let newFields = {};
  if (title) newFields.title = title;
  if (length) newFields.length = length;
  if (desc) newFields.desc = desc;
  if (lvl) newFields.lvl = lvl;
  if (tags) newFields.tags = tags;
  if (category) newFields.category = category;
  if ([0, 1].includes(isApproved)) newFields.isApproved = isApproved;
  if (source) newFields.source = source;
  if (chineseArr) newFields.chineseArr = chineseArr;
  if (pySubs) newFields.pySubs = pySubs;
  if (ruSubs) newFields.ruSubs = ruSubs;
  if (cnSubs) newFields.cnSubs = cnSubs;

  if (typeof rutubeUrl === 'string') {
    const { isAdmin } = await getUserPrivileges(req.user.id);
    if (isAdmin) {
      const rutubeSource = parseRutubeUrl(rutubeUrl);
      if (rutubeSource === null) {
        return res.status(400).json({ errors: [{ msg: 'Неверная ссылка на Rutube' }] });
      }
      newFields.rutubeSource = rutubeSource; // empty string removes the Rutube player
    }
  }

  const updatedVid = await Video.findByIdAndUpdate(
    videoId,
    { $set: newFields },
    { new: true },
  ).populate('user', shortUserInfoFields);

  if (foundVid && !foundVid.isApproved && isApproved) {
    Notify.socialMedia(updatedVid);
  }

  return res.json({ status: 'done', _id: videoId });
}

module.exports = { updateVideo };
