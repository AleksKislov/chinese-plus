const { validationResult } = require("express-validator");
const { notifyMe } = require("../_misc");
const Hanzi = require("../../../../routes/api/dict/dictionary");

const Text = require("../../../models/Text");

async function createTxt(req, res) {
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
    name,
    // isApproved,
    categoryInd,
    source,
    isLongText,
  } = req.body;

  let pages;
  if (isLongText) {
    pages = getPagesForLngTxt(origintext, translation);
  }

  const newText = new Text({
    theme_word,
    pic_url,
    origintext: isLongText ? [] : origintext,
    title,
    description,
    level,
    length,
    tags,
    translation: isLongText ? [] : translation,
    chinese_arr: isLongText ? [] : chinese_arr,
    name,
    isApproved: 0,
    categoryInd,
    source,
    pages,
    user: req.user.id,
  });

  const text = await newText.save();
  notifyMe(`New TEXT from ${name}. Title: ${title}`);
  return res.json(text);
}

/**
 * @param {Array<string>} origintext
 * @param {Array<string>} translation
 * @return {Array<Page>}
 */
function getPagesForLngTxt(origintext, translation) {
  let pageText = "";
  let pageTranslation = [];
  let pageOriginTxt = [];
  let pages = [];

  for (let i = 0; i < origintext.length; i++) {
    if (pageText.length < 1200) {
      pageText += origintext[i] + "\n";
      pageTranslation.push(translation[i]);
      pageOriginTxt.push(origintext[i]);
    } else {
      pages.push(new Page(Hanzi.segment(pageText.trim()), pageTranslation, pageOriginTxt));
      pageText = "";
      pageTranslation = [];
      pageOriginTxt = [];
    }
  }
  pages.push(new Page(Hanzi.segment(pageText.trim()), pageTranslation));
  return pages;
}

module.exports = { createTxt };

/**
 * 0] POST /api/texts 200 29.587 ms - 626 {
[0]   "origintext": [
[0]     "汉语很好",
[0]     "这里好"
[0]   ],
[0]   "title": "ffsf",
[0]   "description": "",
[0]   "level": 1,
[0]   "tags": [
[0]     ""
[0]   ],
[0]   "translation": [
[0]     "sfdsf",
[0]     "sdfsd"
[0]   ],
[0]   "chinese_arr": [
[0]     "汉",
[0]     "语",
[0]     "很",
[0]     "好",
[0]     "\n",
[0]     "这",
[0]     "里",
[0]     "好"
[0]   ],
[0]   "length": 8,
[0]   "pic_url": "https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjE4ODV8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjAzOTY4NjU&ixlib=rb-1.2.1&q=80&w=400",
[0]   "theme_word": "",
[0]   "categoryInd": 0,
[0]   "source": "",
[0]   "name": "Aleksandr Kislov"
[0] } - 469
 */

class Page {
  constructor(cnArr, ruTxt, origin) {
    this.chinese_arr = cnArr;
    this.translation = ruTxt;
    this.origintext = origin;
  }
}
