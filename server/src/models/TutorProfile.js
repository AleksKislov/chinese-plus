const mongoose = require('mongoose');

// what the AI tutor remembers about a user between chats, plus the daily message quota
const TutorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  memory: { type: String, default: '' }, // LLM-written summary of past chats
  memoryUpdatedAt: { type: Date },
  level: { type: Number, min: 1, max: 6, default: 1 }, // last HSK level chosen
  usage: {
    day: { type: String, default: '' }, // 'YYYY-MM-DD' (UTC)
    count: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('tutorprofile', TutorProfileSchema);
