const mongoose = require('mongoose');

const DonateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },
  operationId: { type: String, required: true, unique: true },
  amount: { type: Number },
  label: { type: String },
  datetime: { type: String },
  currency: { type: String },
  isCryptoAnon: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Donate = mongoose.model('donate', DonateSchema);
