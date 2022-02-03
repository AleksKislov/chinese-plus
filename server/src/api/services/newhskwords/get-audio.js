const Hskword = require("../../../models/Hskword");
const { writeMP3 } = require("./write-mp3");

async function getAudio(req, res) {
  const allLexicon = await Hskword.find({
    lvl: "6",
  })
    .select("-ru")
    .sort({ id: 1 });

  await Promise.all(allLexicon.slice(600).map(writeMP3));
  res.send("done");
}

module.exports = { getAudio };
