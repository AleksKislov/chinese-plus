const mongoose = require('mongoose');

// index of AI tutor audio clips that exist in the bucket (audio/{path}), so a chat can show
// which sentences already have audio with one query instead of a bucket request per sentence
const TutorAudioSchema = new mongoose.Schema({
  path: { type: String, required: true, unique: true }, // 'tutor/{hash}.mp3'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('tutoraudio', TutorAudioSchema);
