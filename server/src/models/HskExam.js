const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A full HSK mock exam, authored offline as JSON under server/content/hsk-exams
 * and imported with scripts/import-hsk-exams.js. One document per exam - the
 * whole thing is always read and written as a unit, so sections/parts/questions
 * are embedded rather than split across collections (same call as Textbook's
 * nested `examples`, unlike the Book/BookContent/BookPage split).
 *
 * The nesting mirrors a real exam paper:
 *   exam -> section (听力 / 阅读 / 书写) -> part (第一部分, 第二部分, ...) -> question
 *
 * Media is NOT stored as URLs. Pictures and audio are generated separately and
 * uploaded to Object Storage under a path derived from the exam slug, so the
 * `hasAudio` / `hasImage` booleans are the only thing persisted here and the URL
 * is rebuilt by convention - the same approach as Text.audioSrc +
 * CONST_URLS.textsAudioUrl. See src/api/services/hsk-exams/media-paths.js.
 */

// One lettered choice: either an inline option (A 他是老师) or an entry in a
// part-level bank shared by every question in that part (the A-F picture strip).
const ChoiceSchema = new Schema(
  {
    label: { type: String, required: true }, // 'A', 'B', 'C', ... or '1', '2'
    textCn: { type: String, default: null },
    textRu: { type: String, default: null },
    pinyin: { type: String, default: null },
    hasImage: { type: Boolean, default: false },
    // Kept for regeneration/auditing of the picture - never shown to users.
    imagePrompt: { type: String, default: null },
  },
  { _id: false }
);

const QuestionSchema = new Schema(
  {
    ind: { type: Number, required: true }, // position within the part, 0-based
    // number as printed on the exam paper, continuous across the whole section
    number: { type: Number, default: null },
    questionType: {
      type: String,
      required: true,
      enum: [
        // listening
        'listening-true-false', // hear a sentence, judge the picture: ✓ / ✗
        'listening-picture-match', // hear it, pick the picture from the part bank
        'listening-choice', // hear a dialogue + question, pick a text option
        // reading
        'reading-true-false', // read a word, judge the picture: 对 / 错
        'reading-picture-match', // match word/sentence to a picture in the bank
        'reading-sentence-match', // match a sentence to its pair in the bank
        'reading-fill-blank', // fill the gap from a shared word bank
        'reading-choice', // read a passage, answer multiple choice
        // writing (higher levels only)
        'writing-sentence-order', // reorder scrambled chunks into a sentence
        'writing-character', // write the character for a given pinyin
        'writing-essay', // free text, not auto-graded
      ],
    },

    // What the test-taker sees. promptCn is empty for pure-listening questions
    // where the only stimulus is the audio.
    promptCn: { type: String, default: null },
    promptRu: { type: String, default: null },
    pinyin: { type: String, default: null },

    // Spoken script for the listening sections - the exact text fed to TTS.
    // Kept in the DB (not just in the JSON) so listening transcripts can be
    // revealed after grading and audio can be regenerated without the source file.
    ttsText: { type: String, default: null },

    // Media generated separately; flags flip to true once the files are uploaded.
    hasAudio: { type: Boolean, default: false },
    hasImage: { type: Boolean, default: false },
    // Kept for regeneration/auditing of the picture - never shown to users.
    imagePrompt: { type: String, default: null },

    // Per-question options. Empty when the part carries a shared `bank` instead.
    options: { type: [ChoiceSchema], default: [] },

    // Label from `options`/`bank` ('A'), or the literal answer for
    // writing-character / writing-sentence-order. Null for ungraded essays.
    correctAnswer: { type: String, default: null },
    explanationRu: { type: String, default: null },
  },
  { _id: false }
);

const PartSchema = new Schema(
  {
    ind: { type: Number, required: true }, // 0-based; 第一部分 is ind 0
    instructionCn: { type: String, default: null },
    instructionRu: { type: String, default: null },
    // Example item shown before the real questions (例如), as on the real paper.
    exampleRu: { type: String, default: null },

    // Shared answer set for match-type parts: the A-F picture strip, or the word
    // bank of a fill-in-the-blank part. Questions in the part answer with a label.
    bank: { type: [ChoiceSchema], default: [] },

    questions: { type: [QuestionSchema], default: [] },
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
    type: { type: String, required: true, enum: ['listening', 'reading', 'writing'] },
    titleCn: { type: String, default: null },
    titleRu: { type: String, default: null },
    durationMinutes: { type: Number, default: null },
    parts: { type: [PartSchema], default: [] },
  },
  { _id: false }
);

const HskExamSchema = new Schema({
  // 'old' = HSK 1-6 (lexicon), 'new' = HSK 3.0 bands 1-9 (hskwords)
  version: { type: String, required: true, enum: ['old', 'new'] },
  level: { type: String, required: true },

  // Stable human-authored id, unique across the collection. The import script
  // upserts on this field, so fixing a JSON file and re-running updates the
  // existing exam in place instead of creating a duplicate.
  slug: { type: String, required: true, unique: true, index: true },

  title: {
    cn: { type: String, default: null },
    ru: { type: String, default: null },
  },
  descriptionRu: { type: String, default: null },
  // Ordering of exams within a level in listings.
  ind: { type: Number, default: 0 },
  durationMinutes: { type: Number, default: null },

  // Moderation flag, same role as BlogPost.isApproved / Text.isApproved -
  // imported exams stay hidden until explicitly published.
  isApproved: { type: Boolean, default: false },

  sections: { type: [SectionSchema], default: [] },

  date: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = HskExam = mongoose.model('hskexam', HskExamSchema);
