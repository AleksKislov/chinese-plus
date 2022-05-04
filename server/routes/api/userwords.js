const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
// const puppeteer = require("puppeteer");

const UserWord = require("../../src/models/UserWord");

/**
 * @route     GET api/userwords
 * @desc      Get all the words for personal vocabulary
 * @access    Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const words = await UserWord.find({ user: req.user.id }).sort({ date: -1 });

    if (words.length <= 0) return res.status(400).json({ msg: "There are no words yet" });

    res.json(words);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route     POST api/userwords
 * @desc      Add new word to your vocab
 * @access    Private
 */
router.post("/", auth, async (req, res) => {
  const { chinese, translation, pinyin } = req.body;

  let newWords = {};
  newWords.user = req.user.id;
  newWords.chinese = chinese;
  newWords.translation = translation;
  newWords.pinyin = pinyin;
  const words = new UserWord(newWords);

  try {
    await words.save();

    return res.json(words);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route   DELETE api/userwords/:chinese
 * @desc    Delete word from your vocab
 * @access  Private
 */
router.delete("/:chinese", auth, async (req, res) => {
  const chinese = req.params.chinese;
  try {
    await UserWord.findOneAndDelete({ chinese, user: req.user.id });
    return res.json({ msg: "Word removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @desc    search words for web app search url
 * @access  Public
 */
// router.get("/search/:word", async (req, res) => {
//   const searchWord = req.params.word;

//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     const url = "https://bkrs.info/slovo.php?ch=" + encodeURI(searchWord);
//     await page.goto(url);

//     let data;
//     if (/[а-яА-ЯЁё]/.test(searchWord)) {
//       data = await page.evaluate(() => document.querySelector(".ch_ru").innerHTML);
//     } else {
//       const pinyin = await page
//         .evaluate(() =>
//           document
//             .querySelector(".py")
//             .innerHTML.replace('<img class="pointer"', ' <i class="fas fa-play"')
//             .replace('src="images/player/negative_small/playup.png">', "></i>")
//         )
//         .catch(async (e) => {
//           // data = await page.evaluate(() => document.querySelector(".margin_left").innerHTML);
//           // // console.log(data);
//           // data = `<table class="table">${data}</table>`;
//           data = "Error";
//         });

//       if (pinyin && pinyin.includes("<")) {
//         data = pinyin.slice(pinyin.indexOf("<"));
//       }

//       // console.log("up here " + pinyin);

//       // if (typeof pinyin === "string") {
//       //   const translation = await page.evaluate(() => document.querySelector(".ru").innerHTML);
//       //   data = `<div class='dictPinyin'>${pinyin}</div>${translation}`;
//       // }
//     }

//     browser.close();
//     return res.json(data);
//   } catch (err) {
//     console.log(err);
//     // return res.json(err);
//   }
// });

module.exports = router;
