const mongoose = require('mongoose');

// a character written by the admin with a stylus (/admin/handwriting/), raw pen movement to build
// an animated handwriting font later. One document per (font, char): resubmitting replaces it.
//
// strokes: one array per touch of the pen to the screen (pen down -> pen up), in writing order.
// Not split into standard strokes (笔画): a 连笔 line that joins two strokes stays one array.
// Each point is [x, y, pressure, t]:
//   x, y      0..1000 on the writing square, y down (like SVG; Hanzi Writer's 1024 grid flips y)
//   pressure  0..1 (0.5 for a mouse, which has none)
//   t         ms since the first point of the character, so pauses and speed are kept
const HandwritingSchema = new mongoose.Schema(
  {
    font: { type: String, required: true }, // id of the model font the char was traced over
    char: { type: String, required: true },
    strokes: { type: mongoose.Schema.Types.Mixed, required: true },
    size: { type: Number }, // writing square in CSS px when it was recorded
    pen: { type: Boolean, default: false }, // written with a stylus (real pressure)
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  },
  { timestamps: true },
);

HandwritingSchema.index({ font: 1, char: 1 }, { unique: true });

module.exports = mongoose.model('handwriting', HandwritingSchema);
