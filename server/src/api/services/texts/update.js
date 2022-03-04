const { validationResult } = require("express-validator");
// const { notifyMe } = require("../_misc");
// const Hanzi = require("../../../../routes/api/dict/dictionary");

const Text = require("../../../models/Text");

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
  } = req.body;

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
  if (isApproved) newFields.isApproved = isApproved;
  if (categoryInd) newFields.categoryInd = categoryInd;
  if (source) newFields.source = source;
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

  await Text.findByIdAndUpdate(textId, { $set: newFields }, { new: true });
  return res.json({ status: "done" });
}

module.exports = { updateTxt };
