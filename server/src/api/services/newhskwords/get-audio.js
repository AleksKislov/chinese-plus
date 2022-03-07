const Hskword = require("../../../models/Hskword");
const { writeMP3 } = require("./write-mp3");

async function getAudio(req, res) {
  const allLexicon = await Hskword.find({
    lvl: "789",
  })
    .select("-ru")
    .sort({ id: 1 });

  const NUM = 6;

  const SUM = 900;
  const start = SUM * NUM;
  const end = SUM * (NUM + 1);
  return res.json(allLexicon.slice(5400));
  // await Promise.all(allLexicon.slice(5400).map(writeMP3));
  res.send("done");
}

module.exports = { getAudio };
