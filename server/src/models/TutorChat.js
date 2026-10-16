const mongoose = require('mongoose');

// AI tutor conversation of one user (server/src/api/services/tutor)
const BlockSchema = new mongoose.Schema(
  {
    // Chinese sentence | Russian explanation | link to a grammar lesson
    kind: { type: String, enum: ['cn', 'note', 'grammar'], required: true },
    text: { type: String, required: true }, // for 'grammar': the lesson title
    ru: { type: String }, // translation of a 'cn' block
    slug: { type: String }, // 'grammar' block: Grammar.slug, checked against the DB
    audio: { type: String }, // 'cn' block: path under the audio bucket, e.g. 'tutor/3f2a….mp3'
    words: { type: [String], default: [] }, // segmented text, for word tooltips
  },
  { _id: false },
);

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String }, // user message, as typed
  blocks: { type: [BlockSchema], default: undefined }, // assistant reply
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
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TutorChatSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('tutorchat', TutorChatSchema);
