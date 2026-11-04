const multer = require('multer');

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'audio/mpeg' && file.mimetype !== 'audio/mp3') {
    return cb(new Error('Only mp3 files are allowed'));
  }
  cb(null, true);
};

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
