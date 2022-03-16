const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  googleId: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  read_today_num: { type: Number, default: 0, min: 0 },
  read_today_arr: { type: Object, default: {} }, // object  { path<string>: paragraph_indexes<[int]> }
  daily_reading_goal: { type: Number, default: 0 }, // number of Chinese characters to read every day
  finished_texts: { type: Array }, // array of text id, that user already read
  seenVideos: { type: Array },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
