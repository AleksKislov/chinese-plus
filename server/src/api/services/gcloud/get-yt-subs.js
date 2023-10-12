const { getSubtitles } = require("youtube-captions-scraper");
const { google } = require("googleapis");

async function getYtSubs(req, res) {
  const { videoId, lang } = req.query;
  if (!videoId) throw new Error("No videoId provided");

  // try {
  //   const captions = await getSubtitles({ videoID, lang }); // default lang: `en` zh-CN, ru
  //   res.json(captions);

  // get list of langs
  google
    .youtube({
      version: "v3",
      auth: process.env.GC_API_KEY, // specify your API key here
    })
    .captions.list(
      {
        part: "snippet",
        videoId,
      },
      function (err, response) {
        if (err) {
          console.error("Error: " + err);
          throw err;
        }
        // console.log(response.data.items);
        res.json(response.data.items);
      }
    );
  // } catch (error) {
  //   console.log("NO SUBS", error);
  //   throw error;
  // }
}

module.exports = { getYtSubs };
