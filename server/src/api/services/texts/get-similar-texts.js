const Text = require("../../../models/Text");

async function getSimilarTexts(req, res) {
  const level = +req.query.lvl || 1;
  const tags = req.query.tags?.split(",") || [];
  const isApproved = 1;

  const texts = await Text.aggregate([
    {
      $match: {
        tags: { $in: tags },
        level,
        isApproved,
      },
    },
    {
      $sample: { size: 6 },
    },
    {
      $unionWith: {
        coll: "texts",
        pipeline: [
          {
            $match: {
              tags: { $nin: tags },
              level,
              isApproved,
            },
          },
        ],
      },
    },
    {
      $sample: { size: 6 },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        audioSrc: 1,
        picUrl: "$pic_url",
      },
    },
  ]);

  return res.json(texts);
}

module.exports = { getSimilarTexts };
