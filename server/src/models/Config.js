const mongoose = require('mongoose');
const ConfigSchema = new mongoose.Schema({
  type: { type: String },
  isActive: { type: Boolean },
});

module.exports = Config = mongoose.model('config', ConfigSchema);
