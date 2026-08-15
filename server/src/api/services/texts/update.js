const { validationResult } = require('express-validator');
const { Notify, getUserPrivileges } = require('../_misc');

const Text = require('../../../models/Text');
const { shortUserInfoFields } = require('../../consts');
const { invalidateTag } = require('../../../cache');

async function updateTxt(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    origintext,
    title,
    description,
    level,
    tags,
    translation,
    length,
    pic_url,
    chinese_arr,
    theme_word,
    textId,
    isApproved,
    categoryInd,
    source,
    isLongText,
    pageToEdit,
    audioSrc,
    updateDate,
  } = req.body;

  const foundText = await Text.findById(textId);
  if (!foundText) return res.status(404).json({ msg: 'Text not found' });

  const { isAdmin, isModerator } = await getUserPrivileges(req.user.id);
  const canModerate = isAdmin || isModerator;
  const isOwner = foundText.user && foundText.user.toString() === req.user.id;

  if (!canModerate && !(isOwner && !foundText.isApproved)) {
    return res.status(403).json({ msg: 'Not authorized' });
  }

  const isLngTxtEdit = isLongText && Number.isInteger(pageToEdit);

  let newFields = {};
  if (origintext && !isLngTxtEdit) newFields.origintext = origintext;
  if (chinese_arr && !isLngTxtEdit) newFields.chinese_arr = chinese_arr;
  if (translation && !isLngTxtEdit) newFields.translation = translation;
  if (length && !isLngTxtEdit) newFields.length = length;
  if (title) newFields.title = title;
  if (description) newFields.description = description;
  if (level) newFields.level = level;
  if (tags) newFields.tags = tags;
  if (pic_url) newFields.pic_url = pic_url;
  if (theme_word) newFields.theme_word = theme_word;
  if (canModerate && [0, 1].includes(isApproved)) newFields.isApproved = isApproved;
  if (categoryInd) newFields.categoryInd = categoryInd;
  if (source) newFields.source = source;
  if (canModerate && audioSrc) newFields.audioSrc = audioSrc;
  if (canModerate && updateDate) newFields.date = new Date();
  if (isLngTxtEdit) {
    newFields = {
      ...newFields,
      [`pages.${pageToEdit}`]: {
        origintext,
        chinese_arr,
        translation,
      },
    };
  }

  const updatedTxt = await Text.findByIdAndUpdate(
    textId,
    { $set: newFields },
    { new: true },
  ).populate('user', shortUserInfoFields);

  if (!foundText.isApproved && newFields.isApproved) {
    Notify.socialMedia(updatedTxt);
  }

  invalidateTag('texts');
  return res.json({ status: 'done' });
}

module.exports = { updateTxt };
