const router = require("express").Router();
const axios = require("axios");

const auth = require("../../middleware/auth");
const { getTranslation } = require("../../src/api/services/translation/get-translation");

/**
 * @method    POST
 * @route     api/translation
 * @desc      Get google translation for Chinese txt
 * @access    Private
 */
router.post("/", auth, getTranslation);

// router.post("/rus_to_zh", auth, async (req, res) => {
//   const translation = await translateRuText(req.body.text);
//   if (translation) return res.json({ translation });
//   return res.status(500).send("Server error");
// });

/**
 * @method    GET
 * @route     api/translation/unsplash/:pic_theme
 * @desc      Get pictures for the text from unsplash
 * @access    Private
 */
router.get("/unsplash/:pic_theme", auth, async (req, res) => {
  const config = {
    headers: { Authorization: process.env.UNSPLASH_APIKEY },
  };
  const url = `https://api.unsplash.com/photos/random?query=${req.params.pic_theme}&count=8&orientation=portrait`;

  try {
    const { data } = await axios.get(url, config);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
