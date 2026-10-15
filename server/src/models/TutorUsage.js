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
  costUsd: { type: Number, default: 0 }, // estimate, prices from TUTOR_PRICE_* env
});

TutorUsageSchema.index({ user: 1, day: 1 }, { unique: true });
TutorUsageSchema.index({ day: 1 });

module.exports = mongoose.model('tutorusage', TutorUsageSchema);
