const Text = require("../../../models/Text");

async function getTextsInChunks(req, res) {
  const { skip } = req.query;
  const skipNum = skip && /^\d+$/.test(skip) ? +skip : 0;

  const texts = await Text.find(getSearchQuery(req.query), undefined, {
    skip: skipNum,
    limit: 10,
  })
    .sort({ date: -1 })
    .select("-origintext -translation -chinese_arr -pages");

  return res.json(texts);
}

function getSearchQuery({ categoryInd, level, audioSrc }) {
  let qry = { isApproved: 1 };
  if (categoryInd) qry = { ...qry, categoryInd: +categoryInd };
  if (level) qry = { ...qry, level: +level };
  if (audioSrc) qry = { ...qry, audioSrc: 1 };
  return qry;
}

module.exports = { getTextsInChunks };
