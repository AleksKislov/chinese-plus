const mongoose = require('mongoose');

// Grammar topics by HSK 3.0 level, imported from content/grammar/{level}.json
// by scripts/import-grammar.js (replaces the old `textbooks` collection).
const ExampleSchema = new mongoose.Schema(
  {
    cn: { type: String, required: true },
    words: { type: [String], default: [] }, // segmented cn, for word tooltips
    py: { type: String, required: true },
    ru: { type: String, required: true },
    audio: { type: String }, // path under the audio bucket, e.g. 'grammar/3f2a….mp3'
  },
  { _id: false },
);

const RuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pattern: { type: String },
    text: { type: String },
    examples: { type: [ExampleSchema], default: [] },
  },
  { _id: false },
);

const GrammarSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  level: { type: String, required: true }, // '1'..'6', '789'
  ind: { type: Number, required: true }, // order within the level
  category: { type: String, required: true }, // see GRAMMAR_CATEGORIES
  group: { type: String }, // syllabus path, e.g. '词类 · 代词'
  title: {
    cn: { type: String, required: true },
    ru: { type: String, required: true },
  },
  items: { type: [String], default: [] }, // syllabus items covered by the topic
  summary: { type: String, required: true },
  rules: { type: [RuleSchema], default: [] },
  notes: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

GrammarSchema.index({ level: 1, ind: 1 });

module.exports = mongoose.model('grammar', GrammarSchema);
