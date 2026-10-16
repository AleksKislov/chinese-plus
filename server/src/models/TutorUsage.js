const mongoose = require('mongoose');

// AI tutor LLM usage of one user per day (server/src/api/services/tutor/usage.js)
const TutorUsageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  day: { type: String, required: true }, // 'YYYY-MM-DD' (UTC)
  chatRequests: { type: Number, default: 0 },
  summaryRequests: { type: Number, default: 0 },
  failedRequests: { type: Number, default: 0 },
  promptTokens: { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
  cachedTokens: { type: Number, default: 0 }, // part of promptTokens served from the cache
  costUsd: { type: Number, default: 0 }, // LLM (chat + summary) estimate, prices from TUTOR_PRICE_* env
  ttsRequests: { type: Number, default: 0 }, // new clips generated (cached clips not counted)
  ttsChars: { type: Number, default: 0 }, // billable characters reported by the TTS API
  ttsCostUsd: { type: Number, default: 0 }, // estimate, TUTOR_PRICE_TTS_PER_M_CHARS env
});

TutorUsageSchema.index({ user: 1, day: 1 }, { unique: true });
TutorUsageSchema.index({ day: 1 });

module.exports = mongoose.model('tutorusage', TutorUsageSchema);
