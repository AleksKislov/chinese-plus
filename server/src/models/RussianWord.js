const mongoose = require('mongoose');

const RussianWordSchema = new mongoose.Schema({
  cn: { type: String },
  ru: { type: String },
});

// case-insensitive lookup: "Александр" and "александр" both match; queries must pass the same collation
const RU_COLLATION = { locale: 'ru', strength: 2 };
RussianWordSchema.index({ ru: 1 }, { collation: RU_COLLATION });

module.exports = mongoose.model('RussianWord', RussianWordSchema, 'russianwords');
module.exports.RU_COLLATION = RU_COLLATION;
