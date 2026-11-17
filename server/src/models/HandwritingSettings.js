const mongoose = require('mongoose');

// settings of the admin handwriting page (/admin/handwriting/) saved for a model font, so the
// page can go back to them after an accidental change. One document per font: saving replaces it.
// The page's working copy stays in localStorage; this one changes only on an explicit save.
//
// settings: { size, opacity, width, brush, sensitivity, taperStart, taperEnd, smoothing,
//   speed, autoNext } (FE components/handwriting/settings.ts; checked in
//   api/services/handwriting/index.js)
const HandwritingSettingsSchema = new mongoose.Schema(
  {
    font: { type: String, required: true, unique: true },
    settings: { type: mongoose.Schema.Types.Mixed, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('handwritingsettings', HandwritingSettingsSchema);
