const { logger } = require('../../../logger');
const { sendMessage } = require('./send-message');
const { getBlockAudio, getSampleAudio, updateTtsSettings } = require('./tts');
const {
  getChats,
  getChat,
  getAllChats,
  deleteChat,
  clearMemory,
  setListenMode,
  getTextSuggestions,
} = require('./chats');

// unlike apiDecorator, never sends the error text to the client
const safe = (cb) => async (req, res) => {
  try {
    await cb(req, res);
  } catch (err) {
    (req.log || logger).error({ err }, `tutor: ${req.method} ${req.originalUrl} failed`);
    if (!res.headersSent) res.status(500).json({ msg: 'Ошибка сервера, попробуйте позже' });
  }
};

module.exports = {
  sendMessage: safe(sendMessage),
  getChats: safe(getChats),
  getChat: safe(getChat),
  getAllChats: safe(getAllChats),
  deleteChat: safe(deleteChat),
  clearMemory: safe(clearMemory),
  setListenMode: safe(setListenMode),
  getTextSuggestions: safe(getTextSuggestions),
  getBlockAudio: safe(getBlockAudio),
  getSampleAudio: safe(getSampleAudio),
  updateTtsSettings: safe(updateTtsSettings),
};
