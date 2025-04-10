const mongoose = require('mongoose');

const DonateWalletSchema = new mongoose.Schema({
  address: { type: String },
  qrCodeUrl: { type: String },
  name: { type: String },
  isActive: { type: Boolean },
});

module.exports = DonateWallet = mongoose.model('donatewallet', DonateWalletSchema);
