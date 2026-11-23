const mongoose = require('mongoose');

// AI tutor conversation of one user (server/src/api/services/tutor)
const BlockSchema = new mongoose.Schema(
  {
    // Chinese sentence | Russian explanation | link to a grammar lesson | reply hints
    kind: { type: String, enum: ['cn', 'note', 'grammar', 'hints'], required: true },
    text: { type: String, required: true }, // 'grammar': the lesson title; 'hints': items joined
    ru: { type: String }, // translation of a 'cn' block
    slug: { type: String }, // 'grammar' block: Grammar.slug, checked against the DB
    audio: { type: String }, // 'cn' block: path under the audio bucket, e.g. 'tutor/3f2a….mp3'
    words: { type: [String], default: [] }, // segmented text, for word tooltips
    // 'hints': possible replies of the student, shown on "Подсказки?" (latest reply only)
    items: { type: [{ text: String, ru: String, _id: false }], default: undefined },
  },
  { _id: false },
);

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String }, // user message, as typed
  blocks: { type: [BlockSchema], default: undefined }, // assistant reply
  // assistant reply: key of TUTOR_DIALECTS (tutor/consts.js) it was written in; '' / missing =
  // Putonghua. Decides its voice, so switching the setting never changes old replies.
  dialect: { type: String },
  date: { type: Date, default: Date.now },
});

const TutorChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  num: { type: Number, default: 1 }, // lesson number of the user: 1, 2, 3…
  title: { type: String, required: true },
  level: { type: Number, min: 1, max: 6, default: 1 }, // HSK level the teacher speaks at
  messages: { type: [MessageSchema], default: [] },
  summarizedCount: { type: Number, default: 0 }, // messages already folded into TutorProfile.memory
  // lesson type, chosen at the start (server/src/api/services/tutor/lesson-focus.js)
  focus: {
    kind: { type: String, enum: ['chat', 'vocab', 'text'], default: 'chat' },
    words: { type: [String], default: undefined }, // 'vocab': words picked at the start
    textId: { type: mongoose.Schema.Types.ObjectId, ref: 'text' }, // 'text'
    textTitle: { type: String },
    textLevel: { type: Number },
    text: { type: String }, // 'text': Chinese of the first page, as sent to the model
    // 'vocab' progress, reported by the model after each reply (prompts.js, VOCAB PROGRESS)
    practiced: { type: [String], default: undefined }, // used / answered correctly
    missed: { type: [String], default: undefined }, // answered wrong: quiz again
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TutorChatSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('tutorchat', TutorChatSchema);
