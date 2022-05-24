const mongoose = require("mongoose");

const DaySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  have_read: { type: Number },
  daily_goal: { type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Day = mongoose.model("day", DaySchema);
