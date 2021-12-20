const router = require("express").Router();
const auth = require("../../middleware/auth");
const { translateText, translateRuText } = require("./services");

const axios = require("axios");

router.post("/", auth, async (req, res) => {
  const translation = await translateText(req.body.text);
  // console.log("HEREEEE 222");

  if (translation) return res.json({ translation });
  return res.status(500).send("Server error");
});

router.post("/rus_to_zh", auth, async (req, res) => {
  const translation = await translateRuText(req.body.text);
  if (translation) return res.json({ translation });
  return res.status(500).send("Server error");
});

router.get("/unsplash/:pic_theme", auth, async (req, res) => {
  const config = {
    headers: { Authorization: process.env.UNSPLASH_APIKEY }
  };
  const url1 = `https://api.unsplash.com/search/photos?query=${req.params.pic_theme}&per_page=7&orientation=portrait`;
  const url2 = `https://api.unsplash.com/photos/random?query=${req.params.pic_theme}&count=8&orientation=portrait`;

  try {
    const { data } = await axios.get(url2, config);

    // console.log(data);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
