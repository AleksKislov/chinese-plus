const mongoose = require('mongoose');

// what the AI tutor remembers about a user between chats, plus the daily message quota
const TutorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  memory: { type: String, default: '' }, // LLM-written summary of past chats
  memoryUpdatedAt: { type: Date },
  level: { type: Number, min: 1, max: 6, default: 1 }, // last HSK level chosen
  // audio settings, keys of TTS_VOICES / TTS_SPEEDS (server/src/api/services/tutor/consts.js)
  tts: {
    voice: { type: String, default: 'teacher' },
    speed: { type: String, default: 'normal' },
  },
  listenMode: { type: Boolean, default: false }, // "Аудирование": Chinese text hidden behind audio
  usage: {
    day: { type: String, default: '' }, // 'YYYY-MM-DD' (UTC)
    count: { type: Number, default: 0 },
    ttsCount: { type: Number, default: 0 }, // generated audio clips
  },
});

module.exports = mongoose.model('tutorprofile', TutorProfileSchema);
