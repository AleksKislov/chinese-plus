const Text = require("../../../models/Text");
// const { shortUserInfoFields } = require("../../consts");

async function getAllApprovedTexts(req, res) {
  const texts = await Text.find({ isApproved: 1 })
    .sort({ date: -1 })
    .select("date title level categoryInd likes hits _id comments_id audioSrc tags");
  // .populate("user", shortUserInfoFields);
  const allTags = [...new Set(texts.map((t) => t.tags).flat())];

  const mapped = texts.map(
    ({
      date,
      title,
      level: lvl,
      categoryInd: category,
      likes,
      hits,
      tags,
      // user,
      _id,
      comments_id,
      audioSrc,
    }) => ({
      _id,
      date: getShortDate(date),
      lvl,
      hits,
      tags,
      // user,
      title,
      audioSrc,
      category,
      likes: likes.length,
      comments: comments_id.length,
    })
  );
  return res.json({ texts: mapped, allTags });
}

const getShortDate = (str) => {
  return new Date(str).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

module.exports = { getAllApprovedTexts };
