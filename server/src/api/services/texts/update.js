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

  if (isLongText && (pageToEdit || pageToEdit === 0)) {
    console.log("апдейт", JSON.stringify(req.body, null, 2));
  }
  return res.send("ok");

  const newFields = {};
  if (origintext) newFields.origintext = origintext;
  if (title) newFields.title = title;
  if (description) newFields.description = description;
  if (level) newFields.level = level;
  if (tags) newFields.tags = tags;
  if (translation) newFields.translation = translation;
  if (length) newFields.length = length;
  if (chinese_arr) newFields.chinese_arr = chinese_arr;
  if (pic_url) newFields.pic_url = pic_url;
  if (theme_word) newFields.theme_word = theme_word;
  if (isApproved) newFields.isApproved = isApproved;
  if (categoryInd) newFields.categoryInd = categoryInd;
  if (source) newFields.source = source;

  const newText = await Text.findByIdAndUpdate(textId, { $set: newFields }, { new: true });

  return res.json(newText);
}

module.exports = { updateTxt };
