const mongoose = require('mongoose');
const NoticeSchema = new mongoose.Schema({
  text: { type: String },
  link: { type: String },
  display: { type: Boolean },
  color: {
    type: String,
    default: 'info',
    enum: ['warning', 'info', 'primary', 'light', 'secondary', 'success', 'danger'],
  },
});

module.exports = Notice = mongoose.model('notice', NoticeSchema);
