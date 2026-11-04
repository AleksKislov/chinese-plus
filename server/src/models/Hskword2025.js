const mongoose = require('mongoose');

// hsk 3.0 vocab, syllabus published 2025-11 (in force since 2026-07).
// `lvl` is '1'..'6' or '789'; `id` is 1-based and contiguous within each lvl.
// Translation is not stored here: it is joined from `dictionary` via `dictId`.
// The previous (2021) list lives in the `hskwords` collection (Hskword model).
const Hskword2025Schema = new mongoose.Schema({
  id: { type: Number },
  lvl: { type: String },
  num: { type: Number }, // global number in the official syllabus
  cn: { type: String },
  py: { type: String }, // reading from the syllabus (dictionary pinyin lists all readings)
  pos: { type: String },
  lvlRaw: { type: String }, // e.g. '1（4）'
  homograph: { type: Number },
  dictId: { type: mongoose.Schema.Types.ObjectId, ref: 'dictionary' },
  audio: { type: String }, // path relative to the audio bucket, e.g. 'newhsk/band1/37.mp3'
});

Hskword2025Schema.index({ lvl: 1, id: 1 });
Hskword2025Schema.index({ cn: 1 });

module.exports = mongoose.model('hskword2025', Hskword2025Schema);
