const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  website: {
    type: String
  },
  hsk_level: {
    type: String
  },
  location: {
    type: String
  },
  fav_char: {
    type: String
  },
  bio: {
    type: String
  },
  why_learn: {
    type: String
  },
  wechat: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
