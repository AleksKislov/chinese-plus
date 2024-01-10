const express = require("express");
const router = express.Router();
const Comment = require("../../src/models/Comment");
const Post = require("../../src/models/Post");
const Text = require("../../src/models/Text");
const Video = require("../../src/models/Video");
const Donate = require("../../src/models/Donate");
const User = require("../../src/models/User");

// const ADMIN_ID = process.env.ADMIN_ID;
const VERSION = process.env.BE_VERSION;

router.get("/version", (req, res) => {
  res.json({ v: VERSION });
});

router.get("/pulse", async (req, res) => {
  const currentDate = new Date();
  const last2MonthsStartDate = new Date(currentDate.getTime() - 2 * 28 * 24 * 60 * 60 * 1000);
  const last1MonthStartDate = new Date(currentDate.getTime() - 28 * 24 * 60 * 60 * 1000);
  const searchCond = { date: { $gte: last2MonthsStartDate } };

  try {
    const [comments, posts, texts, videos, donates, users] = await Promise.all([
      Comment.find(searchCond).select("date user"),
      Post.find(searchCond).select("date user"),
      Text.find({ ...searchCond, isApproved: 1 }).select("date user"),
      Video.find({ ...searchCond, isApproved: 1 }).select("date user"),
      Donate.find({
        createdAt: { $gte: last2MonthsStartDate },
      }).select("createdAt userId"),
      User.find(searchCond).select("date"),
    ]);

    res.json({
      comment: getMetricsFor2Months(comments, "date", currentDate, last1MonthStartDate),
      post: getMetricsFor2Months(posts, "date", currentDate, last1MonthStartDate),
      text: getMetricsFor2Months(texts, "date", currentDate, last1MonthStartDate),
      video: getMetricsFor2Months(videos, "date", currentDate, last1MonthStartDate),
      donate: getMetricsFor2Months(donates, "createdAt", currentDate, last1MonthStartDate),
      user: getMetricsFor2Months(users, "date", currentDate, last1MonthStartDate),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

function getMetricsFor2Months(arr, datePropName = "date", currentDate, last1MonthStartDate) {
  const lastMonth = getCountForLastMonth(arr, datePropName, currentDate, last1MonthStartDate);
  return {
    lastMonth: lastMonth,
    prevMonth: arr.length - lastMonth,
  };
}

function getCountForLastMonth(arr, datePropName, currentDate, last1MonthStartDate) {
  return arr.filter((x) => {
    const date = new Date(x[datePropName]);
    return date >= last1MonthStartDate && date <= currentDate;
  }).length;
}

module.exports = router;
