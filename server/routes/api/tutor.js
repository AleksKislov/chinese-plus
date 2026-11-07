const router = require('express').Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/admin-auth');

const {
  sendMessage,
  getChats,
  getChat,
  getAllChats,
  deleteChat,
  clearMemory,
  getBlockAudio,
  getSampleAudio,
  updateTtsSettings,
  setListenMode,
  getTextSuggestions,
} = require('../../src/api/services/tutor');
const { getUserPrivileges } = require('../../src/api/services/_misc');

// for now the tutor is open to admins only (page, menu link and every endpoint)
async function adminOnly(req, res, next) {
  try {
    const { isAdmin } = await getUserPrivileges(req.user.id);
    if (!isAdmin)
      return res.status(403).json({ msg: 'AI-учитель пока доступен только администраторам' });
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
router.use(auth, adminOnly);

/**
 * @route     GET api/tutor/chats
 * @desc      User's AI tutor chats (titles only), memory and today's usage
 * @access    Private
 */
router.get('/chats', auth, getChats);

/**
 * @route     GET api/tutor/all-chats
 * @desc      Latest chats of all users (titles and owners), to read them
 * @access    Admin
 */
router.get('/all-chats', adminAuth, getAllChats);

/**
 * @route     GET api/tutor/chats/:id
 * @desc      One chat with messages; assistant blocks carry word tooltips.
 *            Admins may read other users' chats (readOnly: true, owner)
 * @access    Private
 */
router.get('/chats/:id', auth, getChat);

/**
 * @route     DELETE api/tutor/chats/:id
 * @desc      Delete one of the user's chats
 * @access    Private
 */
router.delete('/chats/:id', auth, deleteChat);

/**
 * @route     GET api/tutor/texts?level=1..6
 * @desc      3 texts for an "Обсудить текст" lesson: bookmarks first, then random of the level
 * @access    Private
 */
router.get('/texts', auth, getTextSuggestions);

/**
 * @route     POST api/tutor/messages
 * @desc      Send a message ({ text, level, chatId?, lesson? }) and get the tutor's reply;
 *            without chatId a new lesson is created, lesson { kind: chat | vocab | text,
 *            textId? | textUrl? } sets its type (vocab / text may come without text)
 * @access    Private
 */
router.post('/messages', auth, sendMessage);

/**
 * @route     POST api/tutor/tts
 * @desc      Audio of a Chinese block of a tutor reply ({ chatId, messageId, block }):
 *            generated once with MiniMax, stored in the audio bucket -> { audio }
 * @access    Private (own chats; admins also for chats they read)
 */
router.post('/tts', auth, getBlockAudio);

/**
 * @route     POST api/tutor/tts/sample
 * @desc      Fixed sample phrase with { voice, speed } (keys), to try a voice -> { audio }
 * @access    Private
 */
router.post('/tts/sample', auth, getSampleAudio);

/**
 * @route     PUT api/tutor/settings
 * @desc      Save the user's audio settings { voice, speed } (keys of TTS_VOICES / TTS_SPEEDS)
 * @access    Private
 */
router.put('/settings', auth, updateTtsSettings);

/**
 * @route     PUT api/tutor/listen-mode
 * @desc      Remember the "Аудирование" toggle ({ listenMode: boolean })
 * @access    Private
 */
router.put('/listen-mode', auth, setListenMode);

/**
 * @route     DELETE api/tutor/memory
 * @desc      Forget what the tutor remembers about the user
 * @access    Private
 */
router.delete('/memory', auth, clearMemory);

module.exports = router;
