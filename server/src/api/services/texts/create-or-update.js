const { validationResult } = require("express-validator");
const { notifyMe } = require("../_misc");

const Text = require("../../../models/Text");

const createOrUpdate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  // if (isLongText) {
  // }

  if (req.body.textId) {
    await update(req, res);
  } else {
    await create(req, res);
  }
};

module.exports = { createOrUpdate };

async function create(req, res) {
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
    name,
    isApproved,
    categoryInd,
    source,
    isLongText,
  } = req.body;

  const newText = new Text({
    theme_word,
    pic_url,
    origintext,
    title,
    description,
    level,
    length,
    tags,
    translation,
    chinese_arr,
    name,
    isApproved,
    categoryInd,
    source,
    user: req.user.id,
  });

  const text = await newText.save();

  notifyMe(`New TEXT from ${name}. Title: ${title}`);

  res.json(text);
}

async function update(req, res) {
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
  } = req.body;

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

  const newText = await Text.findByIdAndUpdate(
    textId,
    {
      $set: newFields,
    },
    { new: true }
  );

  return res.json(newText);
}
