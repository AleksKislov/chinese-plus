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

function getSearchQuery({ categoryInd, level }) {
  let qry = categoryInd ? { isApproved: 1, categoryInd: +categoryInd } : { isApproved: 1 };
  if (level) qry = { ...qry, level: +level };
  return qry;
}

module.exports = { getTextsInChunks };
