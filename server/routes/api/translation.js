const router = require('express').Router();

const auth = require('../../middleware/auth');
const { getPics, getTranslation } = require('../../src/api/services/translation');

/**
 * @method    POST
 * @route     api/translation
 * @desc      Get google translation for Chinese txt
 * @access    Private
 */
router.post('/', auth, getTranslation);

/**
 * @method    GET
 * @route     api/translation/unsplash/:pic_theme
 * @desc      Get pictures for the text from unsplash
 * @access    Private
 */
router.get('/unsplash/:pic_theme', auth, getPics);

// router.post("/rus_to_zh", auth, async (req, res) => {
//   const translation = await translateRuText(req.body.text);
//   if (translation) return res.json({ translation });
//   return res.status(500).send("Server error");
// });

module.exports = router;
