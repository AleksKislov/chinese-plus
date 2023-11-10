const VideoLesson = require("../../../models/VideoLesson");
const { shortUserInfoFields } = require("../../consts");

async function getAllVideoLessons(req, res) {
  const { category } = req.query;
  const vids = await VideoLesson.find({ category })
    .select("date desc title lvl source category likes hits user _id comments_id")
    .populate("user", shortUserInfoFields);

  return res.json(vids);
}

module.exports = { getAllVideoLessons };
